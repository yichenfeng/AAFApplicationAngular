from flask import current_app
from ldap3 import Server, Connection, ALL_ATTRIBUTES
from ldap3.utils.dn import parse_dn

def _GetConnection(ldap_id=None, password=None):
    server = Server(current_app.config.get('LDAP_SERVER'), use_ssl=True)
    if ldap_id:
        conn = Connection(server, user="uid=%s,ou=users,dc=autozone,dc=com" % (ldap_id), password=password)
    else:
        conn = Connection(server)

    conn.bind()

    return conn

def _LdapSearch(conn, search_query):
    conn.search("ou=users,dc=autozone,dc=com", search_query, attributes=ALL_ATTRIBUTES)

    return conn.response

def GetUserById(ignition_id, ldap_id=None, password=None):
    conn = _GetConnection(ldap_id, password)

    response = _LdapSearch(conn, "(uid=%s)" % (str(ignition_id)))

    if len(response) == 0:
        raise LdapError('No such user for id %s.' % (ignition_id))
    elif len(response) > 1:
        raise LdapError('Search for %s returned more than one result.' % (ignition_id))
  
    user_details = { }

    for attribute in response[0]['attributes']:
        user_details[attribute] = conn.response[0]['attributes'][attribute]

    return user_details

def GetAdminUsers():
    conn = _GetConnection()

    admin_users = [ ]
 
    for group in current_app.config.get('ADMIN_GROUPS'):
        response = _LdapSearch(conn, "(memberOf=cn=%s,ou=groups,dc=autozone,dc=com)" % (group))
        for user in response:
            admin_users.append({ "userName" : user['attributes']['cn'][0], \
                                  "userId" : int(user['attributes']['uid'][0]) })

    return admin_users

def IsAdminGroupDn(dn_str):
    admin_groups = ['aaf-council', 'it-infosec']

    for attr in parse_dn(dn_str, escape=True):
        if attr[0] == 'cn' and attr[1] in admin_groups:
            return True
        else:
            return False


class LdapError(Exception):
    pass
