class RequestType(object):
    ASSISTANCE = 'assistance'
    DONATION = 'donation'
    FILE = 'documents'

class RequestActions(object):
    SUBMIT = 'submit'
    APPROVE = 'approve'
    DENY = 'deny'
    CLOSE = 'close'
    RETURN = 'return'

class RequestStatus(object):
    DRAFT = 'Draft'
    SUBMITTED = 'Submitted'
    PENDING_APPROVAL = 'Pending Approval'
    APPROVED = 'Approved'
    RETURNED = 'Returned'
    DENIED = 'Denied'
    COMPLETED = 'Completed'

class ResponseType(object):
    SUCCESS = 'success'
    ERROR = 'error'
