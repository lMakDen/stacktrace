FROM node:20-bullseye AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    yarn install

COPY . .
RUN yarn build

FROM busybox:stable
WORKDIR /app
COPY --from=builder /app/build /app
EXPOSE 80
CMD ["httpd", "-f", "-p", "80", "-h", "/app"]

# image build: DOCKER_BUILDKIT=1 docker build --secret id=npmrc,src=$HOME/.npmrc -t svelte-stacktrace .
