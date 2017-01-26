#########################################################################################
###https://pypi.python.org/pypi/voluptuous
###Need to create schema objects for incoming JSON
###See URL for guite to validation class
###Wrap validation call in try/except and return error messages as results to web service
#########################################################################################
from voluptuous import Schema, All, Any, Length, Required, Datetime, Boolean
import datetime

def IsValid(schema, data):
    return schema(data)

def ValidateAsstReq(data):
    return IsValid(assistance_schema, data)

test_schema = Schema( { Required(1) : 'one', 
                        Required(2) : All(Any(str, unicode), Length(min=1)),
                        Required('3') : int,
                        4 : [ Any(str, unicode), 5, 'five' ]} )

date_schema = Schema({'$date' : int })

assistance_schema = Schema( { 'first_name' : Any(str, unicode),
                              'middle_name' : Any(str, unicode),
                              'last_name' : Any(str, unicode),
                              'position' : Any(str, unicode),
                              'store_dept_no' : int,
                              'event_date' : date_schema,
                              'funeral' : Boolean() } )



if __name__ == '__main__':
    print type(1485382223700)
    print(IsValid(test_schema, { 1: 'one', 2 : 'three' , '3' : 2, 4 : ['4', 5, '6'] }))
    print(IsValid(date_schema, {"$date": 1485382223700}))
    print(ValidateAsstReq({ 'first_name' : 'Trevor', 'store_dept_no' : 23, 'event_date' : {"$date": 1485382223700}, 'funeral' : False}))
