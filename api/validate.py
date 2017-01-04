#########################################################################################
###https://pypi.python.org/pypi/voluptuous
###Need to create schema objects for incoming JSON
###See URL for guite to validation class
###Wrap validation call in try/except and return error messages as results to web service
#########################################################################################
from voluptuous import Schema, All, Length, Required


def IsValid(schema, data):
    return schema(data)

test_schema = Schema( { Required(1) : 'one', 
                        Required(2) : All(str, Length(min=1)),
                        Required('3') : int,
                        4 : [ str, 5, 'five' ]} )


print(IsValid(test_schema, { 1: 'one', 2 : 'three' , '3' : 2, 4 : ['4', 5, '6'] }))
