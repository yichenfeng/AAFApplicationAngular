from pymongo import MongoClient
from gridfs import GridFS
from bson.objectid import ObjectId
from datetime import datetime
from os import environ
from const import RequestType

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
        results = [ ]
        for result in collection.find(query):
            result['_id'] = self._getObjectId(result['_id'])
            results.append(result)

        return results

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


"""
if __name__ == '__main__':
    conn = MongoConnection()
    interface = MongoInterface()
    collection = conn.GetCollection(RequestType.ASSISTANCE)

    print(interface.findDocuments(collection, {"user_id" : "10705332"}))

    test_data = {"user_id" : "10705332", "user_name" : "Trevor Robinson", "value_1" : "test value", "value_2" : "val 2"}

    id = interface.insertDocument(collection, test_data)
    print(id)

    doc = interface.getDocument(collection, id)
    print(doc)

    del doc['_id']
    del doc["value_2"]
    doc["value_1"] = "test value update"
    doc["value_3"] = "new value"

    print(doc)
    result = interface.updateDocument(collection, doc, id)
    print(result)

    last_val = interface.getDocument(collection, id)

    print(last_val)

    input_file = open('./test.txt', 'rb')

    fs = conn.GetGridFS()
    file_id = interface.insertFile(fs, input_file)
    print(file_id)
    input_file.close()
    output_file = open('./test_out.txt', 'wb')
    output_file.write(interface.getFile(fs, file_id))
    output_file.close()
 """
