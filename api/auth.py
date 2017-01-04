##########################################################
###Dummy Class for AUTH, need to check user account detail
###from LDAP and determine User Type
##########################################################
class AuthHelper(object):
    def IsUserAdmin(self, user_id):
        if int(user_id) % 2 == 0:
            return True
        else:
            return False
