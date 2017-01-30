##########################################################################
###Main view file for the request routes
###Currently supports search, view and submit of assistance and donation
###requests.
###Depends on const.py and auth.py
##########################################################################

from flask import Flask, request, redirect, url_for, abort, send_file
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
from const import RequestType, ResponseType, RequestActions
from auth import AuthHelper
from aafrequest import AAFRequest, AAFSearch
from ldap import GetUserById, LdapError
from voluptuous.error import MultipleInvalid

#move this to init script - stest up the base app object
app = Flask(__name__)

handler = RotatingFileHandler('/var/log/aaf_api.log', maxBytes=10000, backupCount=1)
handler.setLevel(logging.INFO)
handler.setFormatter(Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(handler)

#check request type from the path
def IsValidRequest(request_type):
    if request_type == RequestType.ASSISTANCE or request_type == RequestType.DONATION:
        return True
    else:
        return False

def GetCurUserId():
    return request.headers.get('OpenAMHeaderID')

#prepare the response for the user
def GetResponseJson(response_status, results):
    return json_util.dumps({"status" : response_status, "result" : results}, json_options=json_util.STRICT_JSON_OPTIONS)

def IsUserAdmin(user_id):
    helper = AuthHelper()
    return helper.IsUserAdmin(user_id)

@app.before_request
def check_auth_header():
   if request.method != 'OPTIONS' and 'OpenAMHeaderID' not in request.headers:
       abort(401) 

#Test route for the root directory - Remove
@app.route('/')
def hello():
    return GetResponseJson(ResponseType.SUCCESS, "Hello World!")

#Search method - query string can contain any of the attributes of a request
#If _id is previded as a search param, redirects to /request_type/id
@app.route('/api/request/<request_type>/search', methods=['POST'])
def search_requests(request_type):
    if IsValidRequest(request_type):
        if request.json:
            find_input = request.json
        else:
            find_input = { }
        if not IsUserAdmin(request.headers['OpenAMHeaderID']):
            find_input['createdBy'] = GetCurUserId()
        return GetResponseJson(ResponseType.SUCCESS, AAFSearch.Search(request_type, find_input))
    else:
        return GetResponseJson(ResponseType.ERROR, "invalid request - type")

#view method for requests - takes MongoDB id and returns the dict result from Mongo
@app.route('/api/request/<request_type>', methods=['POST'])
@app.route('/api/request/<request_type>/<request_id>', methods=['GET','POST'])
def get_upd_request(request_type, request_id=None):
    user_id = int(GetCurUserId())
    if not IsValidRequest(request_type):
        return GetResponseJson(ResponseType.ERROR, "invalid request type")
    else:
        aaf_request = AAFRequest(request_type, request_id)
        if request_id and not aaf_request.IsExistingRequest():
            return abort(404)
        elif not IsUserAdmin(user_id) and not aaf_request.IsUserCreator(user_id):
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

@app.route('/api/request/<request_type>/<request_id>/<action>', methods=['POST'])
def request_action(request_type, request_id, action):
    user_id = int(GetCurUserId())

    #non-admin users may only submit new requests
    if action != RequestActions.SUBMIT and not IsUserAdmin(user_id):
        return abort(403)
    if not IsValidRequest(request_type):
        return GetResponseJson(ResponseType.ERROR, "invalid request")
    else:
        #aaf_request = AAFRequest(request_type, request_id)
        return('type: %s - id: %s - action: %s' % (request_type, request_id, action))


@app.route('/api/request/<request_type>/<request_id>/document', methods=['GET'])
def get_request_docs():
    return('type: %s - id: %s - get_docs' % (request_type, request_id))

@app.route('/api/request/<request_type>/<request_id>/document', methods=['POST'])
@app.route('/api/request/<request_type>/<request_id>/document/<document_id>', methods=['GET'])
def document(request_type, request_id, document_id=None):
    user_id = int(GetCurUserId())  
    if not IsValidRequest(request_type):
        return GetResponseJson(ResponseType.ERROR, "invalid request")
    else:
        aaf_request = AAFRequest(request_type, request_id)
        if request.method == 'POST':
            if request.json:
                input = request.json
                document = aaf_request.UploadDocument(user_id, input['fileName'], input['base64String'], input['description'])
                return GetResponseJson(ResponseType.SUCCESS, document)
            else:
                return GetResponseJson(ResponseType.ERROR, 'No file data recieved')
        else:
            if document_id:
                document = aaf_request.GetDocument(document_id)
            if document == None:
                abort(404)
            return GetResponseJson(ResponseType.SUCCESS, document)

#returns current user info from ldap
@app.route('/api/userinfo', methods=['GET'])
@app.route('/api/userinfo/<user_id>', methods=['GET'])
def curr_user_details(user_id=None):
    try:
        if user_id:
            user_details = GetUserById(user_id)
        else:
            user_details = GetUserById(GetCurUserId())

        return GetResponseJson(ResponseType.SUCCESS, user_details)
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
