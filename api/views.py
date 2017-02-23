##########################################################################
###Main view file for the request routes
###Currently supports search, view and submit of assistance and donation
###requests.
###Depends on const.py and auth.py
##########################################################################

from flask import Flask, request, redirect, url_for, abort, send_file, g
from datetime import datetime
from os import environ
from functools import wraps
import json
import base64
import logging
import time
from bson import json_util
from logging.handlers import RotatingFileHandler
from logging import Formatter
#constants file in this directory
from const import RequestType, ResponseType, RequestActions, RequestStatus
from aafrequest import AAFRequest, AAFSearch, InvalidActionException
from ldap import GetUserById, GetAdminUsers, LdapError
from voluptuous.error import MultipleInvalid
from database import MongoConnection
from flask_pymongo import PyMongo

#move this to init script - stest up the base app object
app = Flask(__name__)

handler = RotatingFileHandler('/var/log/aaf_api.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.INFO)
handler.setFormatter(Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(handler)

app.config['MONGO_HOST'] = 'data' 
app.config['MONGO_PORT'] = 27017 
app.config['MONGO_DBNAME'] = 'aaf_db'
mongo = PyMongo(app)

#decorator for creating callbacks to be executed after the response is generated
def after_this_request(f):
    if not hasattr(g, 'after_request_callbacks'):
        g.after_request_callbacks = []
    g.after_request_callbacks.append(f)
    return f

#check request type from the path
def IsValidRequest(request_type):
    if request_type == RequestType.ASSISTANCE or request_type == RequestType.DONATION:
        return True
    else:
        return False

def GetCurUserId():
    return request.headers.get('Uid')

#prepare the response for the user
def GetResponseJson(response_status, results):
    return json_util.dumps({"status" : response_status, "result" : results}, json_options=json_util.STRICT_JSON_OPTIONS)

def IsUserAdmin():
    user_id = int(request.headers.get('Uid'))
    if any(d['userId'] == user_id for d in GetAdminUsers()):
        return True
    else:
        return False

@app.before_request
def check_auth_header():
    if request.method != 'OPTIONS' and 'Uid' not in request.headers:
        abort(401)

@app.after_request
def set_user_headers(response):
    response.headers['Uid'] = GetCurUserId() #user_id
    response.headers['IsAdmin'] = IsUserAdmin() #request.headers.get('Memberof') #is_admin
    return response

#Test route for the root directory - Remove
@app.route('/')
def hello():
    return GetResponseJson(ResponseType.SUCCESS, "Hello World!")

#Search method - query string can contain any of the attributes of a request
#If _id is previded as a search param, redirects to /request_type/id
@app.route('/request/<request_type>/search', methods=['POST'])
def search_requests(request_type):
    per_page = request.args.get('perPage')
    page_num = request.args.get('pageNumber')
    if not page_num:
        page_num = 1
    if IsValidRequest(request_type):
        if request.json:
            find_input = request.json
        else:
            find_input = { }
        if not IsUserAdmin():
            find_input['createdBy'] = GetCurUserId()
        conn = MongoConnection(mongo.db)

        search_results = AAFSearch.Search(conn, request_type, find_input, per_page, page_num)

        return GetResponseJson(ResponseType.SUCCESS, search_results)
    else:
        return GetResponseJson(ResponseType.ERROR, "invalid request - type")

#view method for requests - takes MongoDB id and returns the dict result from Mongo
@app.route('/request/<request_type>', methods=['POST'])
@app.route('/request/<request_type>/<request_id>', methods=['GET','POST'])
def get_upd_request(request_type, request_id=None):
    user_id = int(GetCurUserId())
    if not IsValidRequest(request_type):
        return GetResponseJson(ResponseType.ERROR, "invalid request type")
    else:
        conn = MongoConnection(mongo.db)
        aaf_request = AAFRequest(conn, request_type, request_id)
        if request_id and not aaf_request.IsExistingRequest():
            return abort(404)
        elif not IsUserAdmin() and\
                (not aaf_request.IsExistingRequest() or not aaf_request.IsUserCreator(user_id)) and\
                aaf_request.IsExistingRequest():
            return abort(403)
        if request.method == 'POST':
           if request.json:
               try:
                   aaf_request.Update(user_id, request.json)
                   return GetResponseJson(ResponseType.SUCCESS, aaf_request.request_id)
               except MultipleInvalid as ex:
                   return GetResponseJson(ResponseType.ERROR, str(ex))
           else:
               GetResponseJson(ResponseType.ERROR, "invalid request - no json recieved")
        else:
            return GetResponseJson(ResponseType.SUCCESS, aaf_request.request_details)

@app.route('/request/<request_type>/<request_id>/<action>', methods=['POST'])
def request_action(request_type, request_id, action):
    if not IsValidRequest(request_type):
        return GetResponseJson(ResponseType.ERROR, "invalid request")
    
    user_id = int(GetCurUserId())
    admin_flag = IsUserAdmin()
    conn = MongoConnection(mongo.db)
    aaf_request = AAFRequest(conn, request_type, request_id)

    try: 
        aaf_request.PerformAction(action, user_id, admin_flag)
    except InvalidActionException as ex:
        return GetResponseJson(ResponseType.ERROR, str(ex))

    return GetResponseJson(ResponseType.SUCCESS, aaf_request.request_details)

@app.route('/request/<request_type>/<request_id>/document', methods=['GET'])
def get_request_docs():
    return('type: %s - id: %s - get_docs' % (request_type, request_id))

@app.route('/request/<request_type>/<request_id>/document', methods=['POST'])
@app.route('/request/<request_type>/<request_id>/document/<document_id>', methods=['GET'])
def document(request_type, request_id, document_id=None):
    user_id = int(GetCurUserId())  
    if not IsValidRequest(request_type):
        return GetResponseJson(ResponseType.ERROR, "invalid request")
    else:
        conn = MongoConnection(mongo.db)
        aaf_request = AAFRequest(conn, request_type, request_id)
        if request.method == 'POST':
            if request.json:
                input = request.json
                results = [ ]

                #if request is a singe doc, wrap in the a list and process.
                if type(input) == dict:
                    input = [input]
                for document in input:
                    results.append(aaf_request.UploadDocument(user_id, document['fileName'], document['base64String'], document['description']))

                return GetResponseJson(ResponseType.SUCCESS, results)
            else:
                return GetResponseJson(ResponseType.ERROR, 'No file data recieved')
        else:
            if document_id:
                document = aaf_request.GetDocument(document_id)
            if document == None:
                abort(404)
            return GetResponseJson(ResponseType.SUCCESS, document)

#returns current user info from ldap
@app.route('/userinfo', methods=['GET'])
@app.route('/userinfo/<user_id>', methods=['GET'])
def curr_user_details(user_id=None):
    try:
        if user_id:
            user_details = GetUserById(user_id)
        else:
            user_details = GetUserById(GetCurUserId())

        user_details['IsAdmin'] = IsUserAdmin()

        return GetResponseJson(ResponseType.SUCCESS, user_details)
    except LdapError as ex:
        return GetResponseJson(ResponseType.ERROR, str(ex))

@app.route('/adminlist', methods=['GET'])
def get_admins():
    if not IsUserAdmin():
        abort(403)
    try:
        return GetResponseJson(ResponseType.SUCCESS, GetAdminUsers())
    except LdapError as ex:
        return GetResponseJson(ResponseType.ERROR, str(ex))

@app.errorhandler(500)
def server_error(e):
    return GetResponseJson(ResponseType.ERROR, "Unexpected server error, please see app logs for additional details.")


#run the app, needs to be moved to init file
if __name__ == '__main__':
    HOST = environ.get('SERVER_HOST', '192.168.250.133')
    try:
        PORT = int(environ.get('SERVER_PORT', '5555'))
    except ValueError:
        PORT = 5555

    app.run(HOST, PORT)
