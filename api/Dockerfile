FROM httpd
ENV http_proxy=http://proxy.autozone.com:8080/ SERVER_HOST=0.0.0.0
WORKDIR /opt
RUN apt-get update && apt-get install --no-install-recommends -y unzip curl python-pip python-dev build-essential && \
      curl -k https://infosec.autozone.com/files/openam/Apache_v24_Linux_64bit_4.1.0.zip > /var/tmp/agent.zip && \
      unzip /var/tmp/agent.zip && rm /var/tmp/agent.zip && \
      echo "{OpenAM_Password}" > /var/tmp/pw.txt  && chmod 0400 /var/tmp/pw.txt && \
      setfacl -m user:daemon:rwx /var/log && rm -rf /var/lib/apt/lists/* && \
      apt-get remove -y unzip curl 

RUN /opt/web_agents/apache24_agent/bin/agentadmin --s /usr/local/apache2/conf/httpd.conf \
        "{OpenAM_Auth Server}:443/auth" \
        "http://{host server}:80/" \
        "/{Realm}" \
        "{OpenAM_Profile_Name}" \
        /var/tmp/pw.txt \
        --changeOwner --acceptLicence --forceInstall
RUN mkdir /usr/local/apache2/wsgi-bin
COPY . /usr/local/apache2/wsgi-bin
RUN chmod -R 0655 /usr/local/apache2/wsgi-bin
WORKDIR /usr/local/apache2/wsgi-bin
RUN pip install --upgrade pip --proxy proxy.autozone.com && \
       pip install -r requirements.txt --proxy proxy.autozone.com && \
       mod_wsgi-express install-module
COPY ./server.crt /usr/local/apache2/conf/server.crt
COPY ./server.key /usr/local/apache2/conf/server.key
