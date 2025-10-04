FROM node:20-bullseye AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    yarn install --frozen-lockfile --non-interactive

COPY . .
RUN yarn build

FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=builder /app/build ./build
EXPOSE 80
CMD ["serve", "-s", "build", "-l", "80"]

# image build: DOCKER_BUILDKIT=1 docker build --secret id=npmrc,src=$HOME/.npmrc -t svelte-stacktrace:alpine-serve .
# container run: docker run --rm -p 8080:80 svelte-stacktrace:alpine-serve