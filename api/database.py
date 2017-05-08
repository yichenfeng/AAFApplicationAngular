from pymongo import MongoClient
from gridfs import GridFS
from bson.objectid import ObjectId
from datetime import datetime
from os import environ
from const import RequestType

def GetAdminUsers(db=None):
    if not db:
        client = MongoClient('data', 27017)
        db = client.aaf_db
    admins = []
    for admin in db.admin_users.find():
        admins.append(dict(admin))
    return admins

class MongoConnection(object):
    def __init__(self, db=None):
        if db:
            self.db = db
        else:
            self.db = self.GetDb()
    #instance of Mongo DB Connection config connection and db values
    def GetDb(self):
        client = MongoClient('data', 27017)
        return client.aaf_db

    #get the collection for the request type
    def GetCollection(self, request_type):
        if request_type == RequestType.ASSISTANCE:
            return self.db.assistance_requests
        elif request_type == RequestType.DONATION:
            return self.db.donation_requests
        else:
            raise Exception('Invalid Request Collection')

    def GetGridFS(self):
        return GridFS(self.db, collection='request_documents')

class MongoInterface(object):
    def _getObjectId(self, obj):
        return str(obj)

    def findDocuments(self, collection, query, sort=None):
        return_value = { }
        results = [ ]

        #simple pagination. Can be costly with later pages in larger result sets
        search_results = collection.find(query)

        return search_results

    def getDocument(self, collection, id):
        doc = collection.find_one({'_id':ObjectId(id)})
        if doc:
            doc['_id'] = self._getObjectId(doc['_id'])
            return doc
        else:
            return None

    def insertDocument(self, collection, data):
        result = collection.insert_one(data).inserted_id
        return self._getObjectId(result)

    def updateDocument(self, collection, data, id, **kwargs):
        update_data = {'$set' : data}
        if 'push_data' in kwargs:
            update_data['$push'] = kwargs['push_data']
        if 'pull_data' in kwargs:
            update_data['$pull'] = kwargs['pull_data']
        doc = collection.update({'_id':ObjectId(id)}, update_data)
        return self._getObjectId(doc)

    def getFile(self, collection, id):
        file = collection.get(ObjectId(id))
        return file.read()

    def insertFile(self, collection, data):
        file = collection.put(data.encode("UTF-8"))
        return self._getObjectId(file)

    def deleteFile(self, collection, id):
        return collection.remove(ObjectId(id))

if __name__ == '__main__':
    db = MongoClient('172.18.0.2', 27017).aaf_db
    print(GetAdminUsers(db))

    #GetAdminUsers

    #db = MongoClient('172.18.0.2', 27017).aaf_db
    #db.admin_users.insert({'userId' : 10705332, 'userName' : 'Trevor Robinson'})
    #print(GetAdminUsers(db))
