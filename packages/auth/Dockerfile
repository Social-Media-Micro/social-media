FROM node:20-alpine

WORKDIR /app/src/social-media

COPY ./package.json ./package.json
COPY ./packages/common ./packages/common
COPY ./packages/auth/package.json ./packages/auth/package.json

RUN yarn
COPY . .
EXPOSE 4000

CMD ["yarn", "workspace", "@monorepo/auth-service", "start:dev"]