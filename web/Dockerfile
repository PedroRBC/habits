FROM node:20-slim

WORKDIR /home/node/app

# Necessary for Gpg Sign in Devcontainer
RUN apt update && apt install --no-install-recommends -y \
        git gpg gnupg gpg-agent socat

COPY --from=golang:latest /usr/local/go/ /usr/local/go/
 
ENV PATH="/usr/local/go/bin:${PATH}"

CMD ["tail", "-f", "/dev/null"]