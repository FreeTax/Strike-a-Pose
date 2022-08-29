FROM python:3
 ENV PYTHONUNBUFFERED 1
 RUN mkdir /code
 WORKDIR /code
 ADD requirements.txt /code/
 RUN apt-get update
 RUN apt-get -y install libgl1-mesa-dev
 RUN pip install -r requirements.txt
 ADD . /code/


