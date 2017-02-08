#########################################################################################
###https://pypi.python.org/pypi/voluptuous
###Need to create schema objects for incoming JSON
###See URL for guite to validation class
###Wrap validation call in try/except and return error messages as results to web service
#########################################################################################
from voluptuous import Schema, All, Any, Length, Required, Datetime, Boolean, Email, Optional
from decimal import Decimal
import datetime
from const import RequestStatus

def IsValid(schema, data):
    return schema(data)

def ValidateAsstReq(data, submit_flag=False, approve_flag=False):
    date_schema = Schema({'$date' : Any(int, Datetime()) })

    personnel_schema = Schema( { 'fName' : Any(str, unicode),
                                  'initial' : Any(str, unicode),
                                  'lName' : Any(str, unicode),
                                  'age' : int,
                                  'relationship' : Any(str, unicode),
                                  'row' : int } )
    
    applicant_schema = Schema( { 'firstName' : Any(str, unicode),
                                  Optional('middleName') : Any(str, unicode),
                                  'lastName' : Any(str, unicode),
                                  'employeeId' : int,
                                  'status' : Any('fullTime', 'partTime'),
                                  'position' : Any(str, unicode),
                                  'storeDeptNo' : int,
                                  'permanentAddress' : Any('own', 'rent'),
                                  'address1' : Any(str, unicode),
                                  Optional('address2') : Any(str, unicode),
                                  'city' : Any(str, unicode),
                                  'state' : Any(str, unicode), #needs review
                                  'zip' : Any(str, unicode), #needs review
                                  'dayPhone' : Any(str, unicode), #needs review
                                  'nightPhone' : Any(str, unicode), #needs review
                                  'email' : Email(),
                                  'behalf' : Any('yes', 'no')}, required=submit_flag )

    incident_schema = Schema( { 'eventDate' : date_schema,
                                  'eventDescription' : Any(str, unicode) }, required=submit_flag )

    requested_schema = Schema( { 'amountRequested' : Any(str, unicode),
                                  Optional('shelter') : Any('temporary', 'eviction', 'homeless', ''),
                                  Optional('funeral') : Boolean(),
                                  Optional('utilities') : Boolean(),
                                  Optional('fire') : Boolean(),
                                  Optional('naturalDisaster') : Boolean(),
                                  Optional('other') : Boolean() }, required=submit_flag )

    recieved_schema = Schema( { Optional('assistSalvArmy') : Any(str, unicode),    #need to discuss data type
                                  Optional('assistRedCross') : Any(str, unicode),
                                  Optional('assistGovt') : Any(str, unicode),
                                  Optional('assistEmployer') : Any(str, unicode),
                                  Optional('assistOther') : Any(str, unicode) } )

    submit_schema = Schema( { 'submitName' : Any(str, unicode),
                                  'submitDate' : date_schema,
                                  'signature' : Any(str, unicode) }, required=submit_flag )

    review_schema = Schema ( { 'approver1' : int,
                                  'approver2' : int,
                                  Optional('denialReason') : Any(str, unicode),
                                  Optional('amountAwarded') : Any(str, unicode),
                                  'dateAwarded' : date_schema,
                                  'review' : Any('Approve', 'Deny', ''),
                                  Optional('comments') : Any(str, unicode) }, required=approve_flag )
    
    assistance_schema = Schema( { 'applicantInfo' : applicant_schema,
                                  Optional('eligiblePersonnel') : [personnel_schema],
                                  'incidentInfo' : incident_schema,
                                  'assistanceRequested' : requested_schema,
                                  Optional('assistanceRecieved') : recieved_schema,
                                  'submitDetails' : submit_schema,
                                  Optional('reviewDetails') : review_schema }, required=submit_flag )
    return IsValid(assistance_schema, data)

if __name__ == '__main__':
    #print(IsValid(date_schema, {"$date": 1485382223700}))
    print(ValidateAsstReq({ 'applicantInfo' : { 'firstName' : 'Trevor', 'storeDeptNo' : 23, 'behalf' : 'yes' , 'status' : 'partTime', 'permanentAddress' : 'rent' }, 'incidentInfo' : { 'eventDate' : {"$date": 1485382223700} }, 'assistanceRequested': { 'funeral' : False} , 'eligiblePersonnel' : [{'row' : 1 }], 'reviewDetails' : { 'approver1' : 10705332, 'approver2' : 10705331, 'denialReason' : 'test denial reason', 'amountAwarded' : '$100.23', 'dateAwarded' : {"$date": 1485382223700}, 'review' : 'Deny', 'comments' : 'test comments'} }, True, False ))
