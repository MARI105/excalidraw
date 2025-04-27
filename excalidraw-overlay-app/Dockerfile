FROM nginx:1.28-alpine

COPY dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK CMD wget -q -O /dev/null http://localhost || exit 1
