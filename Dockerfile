FROM node:20-alpine

# Create app directory
USER node

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json yarn.lock ./

RUN npm install yarn

RUN yarn


COPY --chown=node:node . .

EXPOSE 3000

CMD ["yarn", "start"]