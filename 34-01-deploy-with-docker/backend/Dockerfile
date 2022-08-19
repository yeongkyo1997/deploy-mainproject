FROM node:14

WORKDIR /my_backend/
COPY ./package.json /my_backend/
COPY ./yarn.lock /my_backend/
RUN yarn

COPY . /my_backend/
CMD yarn start:dev