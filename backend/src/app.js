const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
if (env.nodeEnv !== 'test') app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use('/api/auth/login', rateLimit({ windowMs: 15 * 60 * 1000, limit: env.nodeEnv === 'test' ? 10000 : 30, message: { success: false, message: 'Too many attempts, try later' } }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
