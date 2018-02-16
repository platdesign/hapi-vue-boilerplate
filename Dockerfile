FROM mhart/alpine-node:latest

MAINTAINER platdesign

# install machine deps
RUN apk update && apk upgrade && apk add git
RUN apk add --no-cache git make gcc g++ python

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app/
RUN npm install --production

# start app
CMD [ "npm", "start" ]
