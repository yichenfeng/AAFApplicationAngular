FROM ubuntu:latest
ENV SERVER_HOST=0.0.0.0
RUN apt-get update && apt-get install -y \
  python-pip \
  python-dev \
  build-essential
COPY . /app
WORKDIR /app
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
ENTRYPOINT ["python"]
CMD ["views.py"]
