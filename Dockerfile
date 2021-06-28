FROM node:8.15-alpine as mg-app
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
	&& npm install -g ionic \
    && npm install \
	&& npm install -g @angular/cli@'>=1.5.0 <=1.7' \
	&& npm install typescript@'>=2.1.0 <2.4.0' \
#	&& npm uninstall @ngtools/webpack \
	&& npm rebuild node-sass
# && apk del build-dependencies

COPY ./ /usr/src/app
EXPOSE 8100