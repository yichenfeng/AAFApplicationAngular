from ldap3 import Server, Connection, ALL_ATTRIBUTES
from getpass import getpass

#server = Server('localhost',use_ssl=True)
server = Server('localhost')
conn = Connection(server) 

print(ALL_ATTRIBUTES)
print(conn.bind())

#conn.search("ou=Users,dc=example,dc=com", "(uidNumber=1007)", attributes=[ALL_ATTRIBUTES])
conn.search("ou=People,dc=example,dc=com", "(cn=rgraves)", attributes=[ALL_ATTRIBUTES])
for attribute in conn.entries[0]:
    print(attribute.key,attribute.value)
