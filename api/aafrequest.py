import json
from flask import current_app
from bson import json_util
from database import MongoConnection, MongoInterface
from const import RequestType, RequestStatus, RequestActions
from datetime import datetime
from validate import ValidateAsstReq 
from notification import send_email

class AAFSearch(object):
    @staticmethod
    def Search(mongo_conn, request_type, query, per_page, page_num, sort=None):
        if mongo_conn:
            conn = mongo_conn
        else:
            conn = MongoConnection()
        mongo_collection = conn.GetCollection(request_type)
        mongo_interface = MongoInterface()

        result_cursor = mongo_interface.findDocuments(mongo_collection, json_util.loads(json.dumps(query), json_options=json_util.JSONOptions(tz_aware=False)), sort)

        if per_page:
            result_cursor.skip((int(page_num)-1)*int(per_page)).limit(int(per_page))

        results = []
        for result in result_cursor:
            result['_id'] = str(result['_id'])
            results.append(result)

        return_value = { }
        return_value['count'] = result_cursor.count()
        return_value['pageNum'] = page_num
        if per_page:
            return_value['perPage'] = per_page
        else:
            return_value['perPage'] = return_value['count']
        return_value['results'] = results

        return return_value

class AAFRequest(object):
    def __init__(self, mongo_conn, request_type, request_id=None):
        if mongo_conn:
            conn = mongo_conn
        else:
            conn = MongoConnection()
        self.mongo_collection = conn.GetCollection(request_type)
        self.file_collection = conn.GetGridFS()
        self.mongo_interface = MongoInterface()
        self.request_id = request_id
        self.request_type = request_type

        if request_id:
            self.request_details = self._retrieveRequest()
        else:
            self.request_details = None
    
    def _getNewMetaData(self, user_id, email):
        now = datetime.utcnow()
        meta = { }
        meta['createdBy'] = user_id
        meta['createdDate'] = now
        meta['updatedBy'] = user_id
        meta['updateDate'] = now
        meta['status'] = RequestStatus.DRAFT
        meta['submitterEmail'] = email
        meta['documentation'] = [ ]

        return meta

    def _getUpdateMetaData(self, user_id, email):
        meta = { }
        meta['updatedBy'] = user_id
        meta['updateDate'] = datetime.utcnow()
        if self.request_details['createdBy'] == user_id:
            meta['submitterEmail'] = email

        return meta

    def _getNewDocumentMetaData(self, user_id, file_name, doc_id, description=None):
        meta = { }
        meta['createdBy'] = user_id
        meta['createdDate'] = datetime.utcnow()
        meta['fileName'] = file_name
        meta['docId'] = doc_id
        meta['description'] = description

        return meta

    def _retrieveRequest(self):
        return self.mongo_interface.getDocument(self.mongo_collection, self.request_id)

    def IsUserCreator(self, user_id):
        if self.request_details and self.request_details['createdBy'] == user_id:
            return True
        else:
            return False

    def IsExistingRequest(self):
        if self.request_id:
            return True
        else:
            return False

    def IsUserSubmitter(self, user_id):
        if user_id == self.request_details['createdBy']:
            return True
        else:
            return False 

    def IsRequestEditable(self, admin_flag):
        if self.IsExistingRequest() or\
               self.request_details == None or\
               self.request_details.get('status') == RequestStatus.DRAFT or\
               self.request_details.get('status') == RequestStatus.RETURNED or\
               admin_flag:
            return True
        else:
            return False

    def IsReadyToSubmit(self):
        ##Add required field validation
        if self.request_details and\
               (self.request_details.get('status') == RequestStatus.DRAFT or\
                self.request_details.get('status') == RequestStatus.RETURNED):
            return True
        else:
            return False

    def GetRequestDetails(self):
        return self.request_details.to_son()

    def PerformAction(self, action, user_id, email, user_admin=False):
        if action == RequestActions.SUBMIT:
            new_status = RequestStatus.SUBMITTED
        elif action == RequestActions.APPROVE:
            new_status = RequestStatus.APPROVED
        elif action == RequestActions.RETURN:
            new_status = RequestStatus.RETURNED
        elif action == RequestActions.DENY:
            new_status = RequestStatus.DENIED
        else:
            raise InvalidActionException('Action %s not valid.' % (action))

        if (self.IsUserSubmitter(user_id) and self.IsReadyToSubmit() and action == RequestActions.SUBMIT) or user_admin:
            update_data = self._getUpdateMetaData(user_id, email)
            update_data['status'] = new_status
            self.mongo_interface.updateDocument(self.mongo_collection, update_data, self.request_id)
            self.request_details = self._retrieveRequest()

            cc_list = [ ]
            for group in current_app.config['ADMIN_GROUPS']:
                cc_list.append('%s@%s' % (group, current_app.config['DOMAIN']))

            subject = 'AAF Request %s' % (new_status)
            message = 'AAF Request # %s has been %s.' % (self.request_details['_id'], new_status)

            send_email(subject, self.request_details, new_status, [ self.request_details["submitterEmail"] ], cc_list)

        else:
            raise InvalidActionException('User id %s not authorized for this operation.' % (user_id))
         
    def Update(self, user_id, email, data, user_admin=False):
        if not self.IsRequestEditable(user_admin):
            raise InvalidUpdateException('User may not update records in status %s' % ())

        #validate the input against request schema, throws meanigful exception that 
        #is returned by the service
        data = ValidateAsstReq(data)
        #convert input to bson object that can be sent to mongodb
        data_bson = json_util.loads(json.dumps(data))
        if self.IsExistingRequest():
            update_details = self._getUpdateMetaData(user_id, email)         
            for key in data:
                update_details['requestContent.'+ key] = data_bson[key] 
            self.mongo_interface.updateDocument(self.mongo_collection, update_details, self.request_id)
        else:
            insert_details = self._getNewMetaData(user_id, email)
            insert_details['requestContent'] = data_bson
            self.request_id = self.mongo_interface.insertDocument(self.mongo_collection, insert_details)
        
        self.request_details = self.mongo_interface.getDocument(self.mongo_collection, self.request_id)

    def GetDocument(self, document_id):
        for doc in self.request_details['documentation']:
            if doc['docId'] == document_id:
                doc['base64String'] = self.mongo_interface.getFile(self.file_collection, document_id).decode('utf-8')
                return doc
        raise Exception("No such document for this request %s." % (document_id))        

    def UploadDocument(self, user_id, email, document_name, document_data, description=None):
        file_id = self.mongo_interface.insertFile(self.file_collection, document_data)
        doc_data = self._getNewDocumentMetaData(user_id, document_name, file_id, description)

        if self.IsExistingRequest():
            update_details = self._getUpdateMetaData(user_id, email)
            self.mongo_interface.updateDocument(self.mongo_collection, update_details, self.request_id, push_data={'documentation' : doc_data})
        else:
            insert_details = self._getNewMetaData(user_id, email)
            insert_details['documentation'].append(data)
            self.mongo_interface.insertDocument(self.mongo_collection, insert_details)
        
        self.request_details = self.mongo_interface.getDocument(self.mongo_collection, self.request_id)

        return doc_data

    def DeleteDocument(self, user_id, email, document_id):
        if self.IsExistingRequest():
            update_details = self._getUpdateMetaData(user_id, email)
            for doc in self.request_details['documentation']:
                if doc['docId'] == document_id:
                    self.mongo_interface.updateDocument(self.mongo_collection, update_details, self.request_id, pull_data={ 'documentation' : doc })
            self.mongo_interface.deleteFile(self.mongo_collection, document_id)
        else:
            raise Exception("Cannot delete from an unsaved request.")

class InvalidUpdateException(Exception):
    pass

class InvalidActionException(Exception):
    pass
