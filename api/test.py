import requests, json, sys, base64

test_url = 'http://localhost/api/'

get_headers = {"OpenAMHeaderID" : "10705332"}
post_headers = {"OpenAMHeaderID" : "10705332", "Content-Type" : "application/json"}
request_data = { "applicantInfo" : { "firstName" : "Trevor", 
                        "middleName" : "Thomas",
                        "lastName" : "Robinson",
                        "position" : "Systems Engineer",
                        "storeDeptNo" : 4023 }, 
                 "assistanceRequested" : { "funeral" : False },
                 "incidentInfo" : { "eventDate" : {"$date" : 1485388800} } }


nr_response = requests.post(test_url + 'request/assistance', headers=post_headers, data=json.dumps(request_data))
nr_json = nr_response.json()
print(nr_json['result'])

get_response = requests.get(test_url + 'request/assistance/' + nr_json['result'], headers=get_headers)
get_json = get_response.json()

print(get_json)

test_file = open(sys.argv[0], 'rb')
file_data = base64.b64encode(test_file.read())

fr_data = {}
fr_data['fileName'] = sys.argv[0]
fr_data['base64String'] = file_data
fr_data['description'] = 'The test script.'

upload_reponse = requests.post(test_url + 'request/assistance/' + nr_json['result'] + '/document', headers=post_headers, data=json.dumps(fr_data)) 

print(file_data)
upload_json = upload_reponse.json()

get_response = requests.get(test_url + 'request/assistance/' + nr_json['result'], headers=get_headers)
get_json = get_response.json()

print(get_json)

document_response = requests.get(test_url + 'request/assistance/' + nr_json['result'] + '/document/' + upload_json['result'][0]['docId'], headers=get_headers)
doc_json = document_response.json()

print(doc_json)

submit_reponse = requests.post(test_url + 'request/assistance/' + nr_json['result'] + '/submit', headers=post_headers )

print(submit_reponse.json())

approve_reponse = requests.post(test_url + 'request/assistance/' + nr_json['result'] + '/approve', headers=post_headers )

print(approve_reponse.json())

#curl -X POST http://localhost/request/assistance/search -H "OpenAMHeaderID: 10705431"


#curl -X POST http://localhost/request/assistance/search -H "OpenAMHeaderID: 10705431" -d '{"created_by" : 10705332}'

