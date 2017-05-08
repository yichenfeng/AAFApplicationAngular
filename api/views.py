##########################################################################
###Main view file for the request routes
###Currently supports search, view and submit of assistance and donation
###requests.
###Depends on const.py and auth.py
##########################################################################

from flask import Flask, request, redirect, url_for, abort, send_file, g, make_response
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
#from export import getCsvResponseFromJson
from aafrequest import AAFRequest, AAFSearch, InvalidActionException
from voluptuous.error import MultipleInvalid
from database import MongoConnection, GetAdminUsers
from notification import mail, send_email
from flask_pymongo import PyMongo
from validate import validateB64FileSize, validateFileExtension
from export import getCsvResponseFromJsonList

#move this to init script - stest up the base app object
app = Flask(__name__)
app.config.from_pyfile('services.cfg')

#init mail
mail.init_app(app)

handler = RotatingFileHandler(app.config.get('LOG_LOCATION'), maxBytes=10000, backupCount=1)
handler.setLevel(logging.INFO)
handler.setFormatter(Formatter(
    '%(asctime)s %(levelname)s: %(message)s '
    '[in %(pathname)s:%(lineno)d]'
))
app.logger.addHandler(handler)

mongo = PyMongo(app)

#decorator for creating callbacks to be executed after the response is generated
def after_this_request(f):
    if not hasattr(g, 'after_request_callbacks'):
        g.after_request_callbacks = []
    g.after_request_callbacks.append(f)
    return f

#check request type from the path
def IsValidRequest(request_type):
    return bool(request_type == RequestType.ASSISTANCE)

def GetCurUserId():
    return int(request.headers.get('Uid'))

def GetCurUserEmail():
    return request.headers.get('Mail')

#prepare the response for the user
def GetResponseJson(response_status, results):
    return json_util.dumps({"status" : response_status, "result" : results}, json_options=json_util.STRICT_JSON_OPTIONS)

def IsUserAdmin(user_id):
    return bool(any(d['userId'] == user_id for d in GetAdminUsers(mongo.db)))

@app.before_request
def check_auth_header():
    if request.method != 'OPTIONS' and 'Uid' not in request.headers:
        abort(401)

@app.after_request
def set_user_headers(response):
    response.headers['Uid'] = GetCurUserId() #user_id
    response.headers['IsAdmin'] = IsUserAdmin(GetCurUserId()) #request.headers.get('Memberof') #is_admin
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
    out_format = request.args.get('format')
    app.logger.error(str(request.args))
    if not page_num:
        page_num = 1
    if IsValidRequest(request_type):
        if request.json:
            find_input = request.json
        else:
            find_input = { }
        if not IsUserAdmin(GetCurUserId()):
            find_input['createdBy'] = GetCurUserId()
        conn = MongoConnection(mongo.db)

        search_results = AAFSearch.Search(conn, request_type, find_input, per_page, page_num)

        if out_format == 'csv':
            csv_result = getCsvResponseFromJsonList(search_results['results'])
            response = make_response(csv_result)
            response.headers["Content-Disposition"] = "attachment; filename=export.csv"
            response.headers["Content-type"] = "text/csv"
            return response
        else:
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
        elif not IsUserAdmin(GetCurUserId()) and\
                (not aaf_request.IsExistingRequest() or not aaf_request.IsUserCreator(user_id)) and\
                aaf_request.IsExistingRequest():
            return abort(403)
        if request.method == 'POST':
           if request.json:
               try:
                   aaf_request.Update(user_id, GetCurUserEmail(), request.json)
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
    admin_flag = IsUserAdmin(user_id)
    conn = MongoConnection(mongo.db)
    aaf_request = AAFRequest(conn, request_type, request_id)

    try:
        aaf_request.PerformAction(action, user_id, GetCurUserEmail(), admin_flag)
    except InvalidActionException as ex:
        return GetResponseJson(ResponseType.ERROR, str(ex))

@app.route('/request/<request_type>/<request_id>/document', methods=['POST'])
@app.route('/request/<request_type>/<request_id>/document/<document_id>', methods=['GET', 'DELETE'])
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
                    if not validateFileExtension(document['fileName']):
                        return GetResponseJson(ResponseType.ERROR, 'Invalid file format %s.' % (document['fileName']))
                    elif not validateB64FileSize(document['base64String'].encode('utf-8')):
                        return GetResponseJson(ResponseType.ERROR, 'File size too large %s.' % (document['fileName']))
                    else:
                        results.append(aaf_request.UploadDocument(user_id, GetCurUserEmail(), document['fileName'], document['base64String'], document['description']))

                return GetResponseJson(ResponseType.SUCCESS, results)
            else:
                return GetResponseJson(ResponseType.ERROR, 'No file data recieved')
        elif request.method == 'DELETE':
            if document_id:
                aaf_request.DeleteDocument(user_id, GetCurUserEmail(), document_id)
                return GetResponseJson(ResponseType.SUCCESS, 'File %s deleted.' % (document_id))
            else:
                abort(404)
        else:
            if document_id:
                document = aaf_request.GetDocument(document_id)
            if document == None:
                abort(404)
            return GetResponseJson(ResponseType.SUCCESS, document)

#returns current user info from ldap
@app.route('/userinfo', methods=['GET'])
@app.route('/userinfo/<int:user_id>', methods=['GET'])
def curr_user_details(user_id=None):
    try:
        user_details = { }
        if user_id:
            user_details['user_id'] = user_id
        else:
            user_details['user_id'] = GetCurUserId()

        user_details['IsAdmin'] = IsUserAdmin(GetCurUserId())

        return GetResponseJson(ResponseType.SUCCESS, user_details)
    except Exception as ex:
        return GetResponseJson(ResponseType.ERROR, str(ex))

@app.route('/adminlist', methods=['GET'])
def get_admins():
    if not IsUserAdmin(GetCurUserId()):
        abort(403)
    try:
        return GetResponseJson(ResponseType.SUCCESS, GetAdminUsers(mongo.db))
    except Exception as ex:
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
