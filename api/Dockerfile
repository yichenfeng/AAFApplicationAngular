FROM httpd:2.4.23
ENV http_proxy=http://proxy.autozone.com:8080/ SERVER_HOST=0.0.0.0
WORKDIR /opt
RUN apt-get update && apt-get install --no-install-recommends -y unzip curl libxml2-dev libxslt-dev zlib1g-dev python-pip python-dev build-essential && \
      curl -k https://infosec.autozone.com/files/openam/Apache_v24_Linux_64bit_4.1.0.zip > /var/tmp/agent.zip && \
      unzip /var/tmp/agent.zip && rm /var/tmp/agent.zip && rm -rf /var/lib/apt/lists/* && \
      apt-get remove -y unzip curl 
RUN mkdir /usr/local/apache2/wsgi-bin && mkdir /usr/local/apache2/wsgi-bin/templates
COPY ./requirements.txt /usr/local/apache2/wsgi-bin
WORKDIR /usr/local/apache2/wsgi-bin
RUN pip install --upgrade pip --proxy proxy.autozone.com && \ 
       pip install -r requirements.txt --no-compile --proxy proxy.autozone.com && \
       mod_wsgi-express install-module
COPY ./*.py /usr/local/apache2/wsgi-bin/
#COPY ./templates/*.html /usr/local/apache2/wsgi-bin/templates/
RUN chmod -R 0555 /usr/local/apache2/wsgi-bin
