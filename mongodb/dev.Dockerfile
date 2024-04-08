FROM mongo:4.0

ENV MONGO_INITDB_ROOT_USERNAME admin-user
ENV MONGO_INITDB_ROOT_PASSWORD admin-password
ENV MONGO_INITDB_DATABASE admin

ADD mongo-init-user.js /docker-entrypoint-initdb.d/

EXPOSE 27017
