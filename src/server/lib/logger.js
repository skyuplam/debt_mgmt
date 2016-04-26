import bunyan from 'bunyan';
import config from '../config';
import expressBunyanLogger from 'express-bunyan-logger';

const { appName } = config;

const loggerName = `${appName}Server`;

const logger = bunyan.createLogger({
  name: loggerName,
  serializers: {
    err: bunyan.stdSerializers.err,   // <--- use this
  }
});

// Config the loggin level accordingly
// logger.level(isProduction ? bunyan.INFO : bunyan.DEBUG);

logger.expressLogger = expressBunyanLogger({
  name: loggerName,
  obfuscate: [
    'req-headers.authorization',
    'body.user.password',
    'body.user.oldPassword',
  ]
});


export default logger;
