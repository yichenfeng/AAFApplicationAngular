from ldap3 import Server, Connection, ALL_ATTRIBUTES
from ldap3.utils.dn import parse_dn
from getpass import getpass

def GetUserById(ignition_id, ldap_id=None, password=None):
    server = Server("ldaptest.autozone.com", use_ssl=True)
    if ldap_id and password:
        conn = Connection(server, user="uid=%s,ou=users,dc=autozone,dc=com" % (ldap_id), password=password)
    else:
        conn = Connection(server)

    conn.bind()
    conn.search("ou=users,dc=autozone,dc=com", "(uid=%s)" % (str(ignition_id)), attributes=ALL_ATTRIBUTES)

    if len(conn.response) == 0:
        raise LdapError('No such user for id %s.' % (ignition_id))
    elif len(conn.response) > 1:
        raise LdapError('Search for %s returned more than one result.' % (ignition_id))
  
    user_details = { }

    for attribute in conn.response[0]['attributes']:
        user_details[attribute] = conn.response[0]['attributes'][attribute]

    return user_details

def IsAdminGroupDn(dn_str):
    admin_groups = ['aaf-council', 'it-infosec']

    for attr in parse_dn(dn_str, escape=True):
        if attr[0] == 'cn' and attr[1] in admin_groups:
            return True
        else:
            return False


class LdapError(Exception):
    pass
