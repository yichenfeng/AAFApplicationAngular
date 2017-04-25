import csv
import StringIO

def getCsvResponseFromJsonList(json_list):
    with StringIO.StringIO() as output:

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

        writer = csv.Writer(output, dialect='excel')
        writer.writerow(headers)

        for item in json_list:
            req_date = ""
            emp_id = ""
            az_name = ""
            dept_no = ""
            amount_req = ""
            review = ""
            amount_awarded = ""
            date_awarded = ""
            comments = ""
            event_date = ""

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

        return writer.getvalue()
