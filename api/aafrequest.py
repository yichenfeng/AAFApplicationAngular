import json
from bson import json_util
from database import MongoConnection, MongoInterface
from const import RequestType, RequestStatus
from datetime import datetime
from validate import ValidateAsstReq 

class AAFSearch(object):
    @staticmethod
    def Search(mongo_conn, request_type, query, sort=None):
        if mongo_conn:
            conn = mongo_conn
        else:
            conn = MongoConnection()
        mongo_collection = conn.GetCollection(request_type)
        mongo_interface = MongoInterface()
        return mongo_interface.findDocuments(mongo_collection, json_util.loads(json.dumps(query), json_options=json_util.JSONOptions(tz_aware=False)), sort)

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
            self.request_details = self.mongo_interface.getDocument(self.mongo_collection, request_id)
        else:
            self.request_details = None
    
    def _getNewMetaData(self, user_id):
        now = datetime.utcnow() #.strftime("%m/%d/%Y %I:%M%p")
        meta = { }
        meta['createdBy'] = user_id
        meta['createdDate'] = now
        meta['updatedBy'] = user_id
        meta['updateDate'] = now
        meta['status'] = RequestStatus.DRAFT
        meta['documentation'] = [ ]

        return meta

    def _getUpdateMetaData(self, user_id):
        meta = { }
        meta['updatedBy'] = user_id
        meta['updateDate'] = datetime.utcnow() #.strftime("%m/%d/%Y %I:%M%p")

        return meta

    def _getNewDocumentMetaData(self, user_id, file_name, doc_id, description=None):
        meta = { }
        meta['createdBy'] = user_id
        meta['createdDate'] = datetime.utcnow() #.strftime("%m/%d/%Y %I:%M%p") 
        meta['fileName'] = file_name
        meta['docId'] = doc_id
        meta['description'] = description

        return meta

    def IsUserCreator(self, user_id):
        if self.request_details['createdBy'] == user_id:
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

    def IsReadyToSubmit(self):
        ##Add validation
        return True

    def GetRequestDetails(self):
        return self.request_details.to_son()

    def Update(self, user_id, data):
        #validate the input against request schema, throws meanigful exception that 
        #is returned by the service
        data = ValidateAsstReq(data)
        #convert input to bson object that can be sent to mongodb
        data_bson = json_util.loads(json.dumps(data))
        if self.IsExistingRequest():
            update_details = self._getUpdateMetaData(user_id)         
            for key in data:
                update_details['requestContent.'+ key] = data_bson[key] 
            self.mongo_interface.updateDocument(self.mongo_collection, update_details, self.request_id)
        else:
            insert_details = self._getNewMetaData(user_id)
            insert_details['requestContent'] = data_bson
            self.request_id = self.mongo_interface.insertDocument(self.mongo_collection, insert_details)
        
        self.request_details = self.mongo_interface.getDocument(self.mongo_collection, self.request_id)

    def GetDocument(self, document_id):
        for doc in self.request_details['documentation']:
            if doc['docId'] == document_id:
                doc['base64String'] = self.mongo_interface.getFile(self.file_collection, document_id).decode('utf-8')
                return doc
        raise Exception("No such document for this request %s." % (document_id))        

    def UploadDocument(self, user_id, document_name, document_data, description=None):
        file_id = self.mongo_interface.insertFile(self.file_collection, document_data)
        doc_data = self._getNewDocumentMetaData(user_id, document_name, file_id, description)

        if self.IsExistingRequest():
            update_details = self._getUpdateMetaData(user_id)
            self.mongo_interface.updateDocument(self.mongo_collection, update_details, self.request_id, push_data={'documentation' : doc_data})
        else:
            insert_details = self._getNewMetaData(user_id)
            insert_details['documentation'].append(data)
            self.mongo_interface.insertDocument(self.mongo_collection, insert_details)
        
        self.request_details = self.mongo_interface.getDocument(self.mongo_collection, self.request_id)

        return doc_data

    def DeleteDocument(self, user_id, document_id):
        if self.IsExistingRequest():
            update_details = self._getUpdateMetaData(user_id)
            for doc in self.request_details['documentation']:
                if doc['docId'] == document_id:
                    self.mongo_interface.updateDocument(self.mongo_collection, update_details, self.request_id, pull_data={ 'documentation' : doc })
        else:
            raise Exception("Cannot delete from an unsaved request.")

if __name__ == '__main__':
    request = AAFRequest(RequestType.ASSISTANCE)

    if not request.IsExistingRequest():
        request.Update(10705332, {"test_data1" : "one", "test_data2" : 2, "test_data3" : "III"})

    if request.IsExistingRequest():
        print(request.request_details)
        request.Update(10705332, {"test_data3" : "tres", "test_data4" : [1, 2, 3, 4]})
        print(request.request_details)


    print('retriving fresh request')
    new_req = AAFRequest(RequestType.ASSISTANCE, request.request_id)

    print(new_req.request_details)


    input_file = open('./test.txt', 'rb')

    doc_data = new_req.UploadDocument(10705332, 'test.txt', input_file, 'test file')
    doc_data = new_req.UploadDocument(10705332, 'test.txt', input_file, 'test file')
    input_file.close()

    print(doc_data)
    print(new_req.request_details)

    output_file = open('./test_out.txt', 'wb')
    output_file.write(new_req.GetDocument(doc_data['docId']))
    output_file.close()

    
    print(new_req.request_details)

    new_req.DeleteDocument(10705332, doc_data['docId'])

    print(new_req.request_details)
