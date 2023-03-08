FROM shellspec/shellspec:latest

COPY ./smoke/ /w3security/smoke/
COPY ./fixtures/ /snyk/fixtures/

RUN shellspec --version
RUN apk add curl jq libgcc libstdc++

WORKDIR /w3security/smoke/

ENTRYPOINT [ "./alpine/entrypoint.sh" ]
