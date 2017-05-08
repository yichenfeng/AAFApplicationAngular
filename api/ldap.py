from flask import current_app
from ldap3 import Server, Connection, ALL_ATTRIBUTES
from ldap3.utils.dn import parse_dn

def set_admin_list(new_admin_list, db=None):
    if not db:
        client = MongoClient('data', 27017)
        db = client.aaf_db

    existing_admin_list = db.admin_users.find()
    for admin in existing_admin_list:
        user_found = False
        for index in range(0, len(new_admin_list)):
            if admin['userId'] == new_admin_list[index]['userId']:
                new_admin_list.pop(index)
                user_found = True
                break
        if not user_found:
            db.admin_users.remove(admin.get('_id'))

    for new_admin in new_admin_list:
        print(new_admin)
        db.admin_users.insert(new_admin)

def _GetConnection(ldap_id=None, password=None):
    server = Server('ldaptest.autozone.com', use_ssl=True)
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

def GetAdminUsers(groups):
    conn = _GetConnection()

    admin_users = [ ]
 
    for group in groups:
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


if __name__ == '__main__':
    from pymongo import MongoClient 
    admin_groups = ['aafboard']

    db = MongoClient('172.18.0.2', 27017).aaf_db

    users = GetAdminUsers(admin_groups)
    print(str(users))
    set_admin_list(users, db)
    
 
