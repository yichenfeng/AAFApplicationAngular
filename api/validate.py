#########################################################################################
###https://pypi.python.org/pypi/voluptuous
###Need to create schema objects for incoming JSON
###See URL for guite to validation class
###Wrap validation call in try/except and return error messages as results to web service
#########################################################################################
from voluptuous import Schema, All, Any, Length, Required, Datetime, Boolean, Email
from decimal import Decimal
import datetime

def IsValid(schema, data):
    return schema(data)

def ValidateAsstReq(data):
    return IsValid(assistance_schema, data)

test_schema = Schema( { Required(1) : 'one', 
                        Required(2) : All(Any(str, unicode), Length(min=1)),
                        Required('3') : float,
                        4 : [ Any(str, unicode), 5, 'five' ]} )

date_schema = Schema({'$date' : Any(int, Datetime()) })

personnel_schema = Schema( { 'fName' : Any(str, unicode),
                              'initial' : Any(str, unicode),
                              'lName' : Any(str, unicode),
                              'age' : int,
                              'relationship' : Any(str, unicode),
                              'row' : int } )

applicant_schema = Schema( { 'firstName' : Any(str, unicode),
                              'middleName' : Any(str, unicode),
                              'lastName' : Any(str, unicode),
                              'employeeId' : int,
                              'status' : Any('fullTime', 'partTime'),
                              'position' : Any(str, unicode),
                              'storeDeptNo' : int,
                              'permanentAddress' : Any('yes', 'no'),
                              'address1' : Any(str, unicode),
                              'address2' : Any(str, unicode),
                              'city' : Any(str, unicode),
                              'state' : Any(str, unicode), #needs review
                              'zip' : Any(str, unicode), #needs review
                              'dayPhone' : Any(str, unicode), #needs review
                              'nightPhone' : Any(str, unicode), #needs review
                              'email' : Email() } )

incident_schema = Schema( { 'eventDate' : date_schema,
                              'eventDescription' : Any(str, unicode) } )

requested_schema = Schema( { 'amountRequested' : Any(str, unicode),
                              'shelter' : ['temporary', 'eviction', 'homeless'],
                              'funeral' : Boolean(),
                              'utilities' : Boolean(),
                              'fire' : Boolean(),
                              'naturalDisaster' : Boolean(),
                              'other' : Boolean() } )

recieved_schema = Schema( { 'assistSalvArmy' : Any(str, unicode),    #need to discuss data type
                              'assistRedCross' : Any(str, unicode),
                              'assistGovt' : Any(str, unicode),
                              'assistEmployer' : Any(str, unicode),
                              'assistOther' : Any(str, unicode) } )

submit_schema = Schema( { 'submitName' : Any(str, unicode),
                              'submitDate' : date_schema,
                              'signature' : Any(str, unicode) } )

assistance_schema = Schema( { 'applicantInfo' : applicant_schema,
                              'eligiblePersonnel' : [personnel_schema],
                              'incidentInfo' : incident_schema,
                              'assistanceRequested' : requested_schema,
                              'assistanceRecieved' : recieved_schema,
                              'submitDetails' : submit_schema } )

if __name__ == '__main__':
    print type(1485382223700)
    print(IsValid(test_schema, { 1: 'one', 2 : 'three' , '3' : 2.5, 4 : ['4', 5, '6'] }))
    print(IsValid(date_schema, {"$date": 1485382223700}))
    print(ValidateAsstReq({ 'applicantInfo' : { 'firstName' : 'Trevor', 'storeDeptNo' : 23, 'status' : 'partTime', 'permanentAddress' : 'no' }, 'incidentInfo' : { 'eventDate' : {"$date": 1485382223700} }, 'assistanceRequested': { 'funeral' : False} , 'eligiblePersonnel' : [{'row' : 1 }] } ))
