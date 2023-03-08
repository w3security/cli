FROM node:16

COPY ./smoke/ /w3security/smoke/
COPY ./fixtures/ /snyk/fixtures/

RUN apt-get update && apt-get install -y curl jq
RUN /w3security/smoke/install-shellspec.sh --yes
ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /w3security/smoke/

ENTRYPOINT [ "./docker-root/entrypoint.sh" ]
