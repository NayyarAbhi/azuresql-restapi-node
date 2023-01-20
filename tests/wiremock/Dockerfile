FROM uksadmortgageonbrdnglabacr.azurecr.io/node:18.12.1.1-buster-slim as deps
LABEL name="prospect-managment-ms-stub"
LABEL maintainer="MVS Onbrdng Lab"
WORKDIR /app
COPY tests/wiremock/  /app/
COPY .yarnrc .npmrc /app/
RUN yarn install --frozen-lockfile
RUN rm -rf dist
RUN rm -rf node_modules/public-encrypt/test/
RUN rm -rf node_modules/cookie-encrypter/example

FROM uksadmortgageonbrdnglabacr.azurecr.io/node:18.12.1.1-buster-slim as runtime
LABEL name="prospect-managment-ms-stub"
LABEL maintainer="MVS Onbrdng Lab"
WORKDIR /app
COPY --from=deps /app/package.json*  /app/
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=deps /app/src /app/src
EXPOSE 3000
CMD [ "yarn", "start"]