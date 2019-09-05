import 'dotenv/config';
import express from 'express';
import expressGraphQL from 'express-graphql';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { Nuxt, Builder } from 'nuxt';

const app = express();
require('../config/mongoose');
const GraphQLSchema = require('../graphql/root_schema');
// const errors = require('../graphql/errors/errors')
const { attachUserToContext } = require('../middleware-express');

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3020;

app.set('port', port);

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text({ type: 'application/graphql' }));
app.use(bodyParser.json());
app.use(morgan(config.dev ? 'dev' : 'tiny'));

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // app.use(attachUserToContext);
  app.use(
    '/graphql',
    expressGraphQL({
      schema: GraphQLSchema,
      graphiql: true,
      formatError: error => {
        return {
          msg: error.message,
          field: error.message.match(/\"\S+\"/g)
            ? error.message.match(/\"\S+\"/g)[0] || ''
            : ''
        };
      }
    })
  );

  app.use((req, res, next) => {
    next();
  });

  // Give nuxt middleware to express
  app.use(nuxt.render);

  //Not found route
  app.use('/*', (req, res) => {
    res.status(404).json({ message: 'Not Authorized', success: false });
  });

  // Listen the server
  app.listen(port, host);
  console.log('Server listening on http://' + host + ':' + port); // eslint-disable-line no-console
}
start();
