FROM httpd
ENV http_proxy=http://proxy.autozone.com:8080/ SERVER_HOST=0.0.0.0
WORKDIR /opt
RUN apt-get update && apt-get install --no-install-recommends -y unzip curl python-pip python-dev build-essential && \
      curl -k https://infosec.autozone.com/files/openam/Apache_v24_Linux_64bit_4.1.0.zip > /var/tmp/agent.zip && \
      unzip /var/tmp/agent.zip && rm /var/tmp/agent.zip && \
      echo "{OpenAM Password}" > /var/tmp/pw.txt  && chmod 0400 /var/tmp/pw.txt && \
      rm -rf /var/lib/apt/lists/* && \
      apt-get remove -y unzip curl 
RUN /opt/web_agents/apache24_agent/bin/agentadmin --s /usr/local/apache2/conf/httpd.conf \
        "https://{OpenAM Server}:443/auth" \
        "https://{Host Server}:443" \
        "/{OpenAM Realm}" \
        "{OpenAM Policy}" \
        /var/tmp/pw.txt \
        --changeOwner --acceptLicence --forceInstall
RUN mkdir /usr/local/apache2/wsgi-bin
COPY ./requirements.txt /usr/local/apache2/wsgi-bin
WORKDIR /usr/local/apache2/wsgi-bin
RUN pip install --upgrade pip --proxy proxy.autozone.com && \
       pip install -r requirements.txt --proxy proxy.autozone.com && \
       mod_wsgi-express install-module
COPY ./*.py /usr/local/apache2/wsgi-bin/
RUN chmod -R 0555 /usr/local/apache2/wsgi-bin
