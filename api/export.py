import csv
import StringIO
from flask import current_app

def getCsvResponseFromJsonList(json_list):
    output = StringIO.StringIO()
    headers = ["Date",
               "Employee ID",
               "AutoZoner Name",
               "Store/Dept",
               "Amount Requested",
               "Review",
               "Amount Awarded",
               "Date Awarded",
               "Comments",
               "Date of Event"]

    writer = csv.writer(output, dialect='excel')
    writer.writerow(headers)
    for item in json_list:
        req_date = item['createdDate']
        az_name = '%s %s %s' % (item['requestContent']['applicantInfo'].get('firstName'),\
                                item['requestContent']['applicantInfo'].get('middleName'),\
                                item['requestContent']['applicantInfo'].get('lastName'))
        emp_id = item['requestContent']['applicantInfo'].get('employeeId')
        dept_no = item['requestContent']['applicantInfo'].get('storeDeptNo')
        amount_req = item['requestContent']['assistanceRequested'].get('amountRequested')
        review = item['requestContent']['reviewDetails'].get('review')
        amount_awarded = item['requestContent']['reviewDetails'].get('amountAwarded')
        date_awarded = item['requestContent']['reviewDetails'].get('dateAwarded')
        comments = item['requestContent']['reviewDetails'].get('comments')
        event_date = item['requestContent']['incidentInfo'].get('eventDate')

        writer.writerow([req_date,
                         emp_id,
                         az_name,
                         dept_no,
                         amount_req,
                         review,
                         amount_awarded,
                         date_awarded,
                         comments,
                         event_date])

    results = output.getvalue()
    output.close()

    return results
