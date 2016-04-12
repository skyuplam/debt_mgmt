import api from './api';
import config from './config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import helmet from 'helmet';
import frontend from './frontend';
import models from './models';
import passport from './auth/passport';
import typesAndStatus from './data/data.json';
import { loanTestData } from './data/testDataLoader';


const app = express();
const { port, isProduction } = config;
// passport setup
app.use(passport.initialize());
// passport piggy backs of express sessions, still need to set express session options
app.use(passport.session());

app.disable('x-powered-by');

// helmet
app.use(helmet());

const directives = isProduction ?
{
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "'unsafe-eval'", 'https://cdn.polyfill.io'],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'"],
  sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
  reportUri: '/report-violation',
  connectSrc: ["'self'"],
  mediaSrc: ["'self'"],
  objectSrc: ["'self'", 'allow-same-origin'], // An empty array allows nothing through
}
:
{
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.polyfill.io', '192.168.1.210:8080'],
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'"],
  sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
  reportUri: '/report-violation',
  connectSrc: ["'self'", '192.168.1.210:8080'],
  mediaSrc: ["'self'"],
  objectSrc: ["'self'", 'allow-same-origin'], // An empty array allows nothing through
};

app.use(helmet.csp({
  // Specify directives as normal.
  directives: {
    ...directives
  },

  // Set to true if you only want browsers to report errors, not block them
  reportOnly: false,

  // Set to true if you want to blindly set all headers: Content-Security-Policy,
  // X-WebKit-CSP, and X-Content-Security-Policy.
  setAllHeaders: true,

  // Set to true if you want to disable CSP on Android where it can be buggy.
  disableAndroid: false,

  // Set to false if you want to completely disable any user-agent sniffing.
  // This may make the headers less compatible but it will be much faster.
  // This defaults to `true`.
  browserSniff: true
}));

app.use('/api/v1', api);
app.use(frontend);
app.use(errorHandler);

models.sequelize.sync({ force: !isProduction }).then(() => {
  const {
    identityTypes,
    loanTypes,
    repaymentStatuses,
    loanStatuses,
    repaymentPlanStatuses,
    placementStatuses,
    contactNumberTypes,
    addressTypes,
    sources,
    relationships,
    roles,
  } = typesAndStatus;

  models.sequelize.transaction(t2 =>
    // Status and Types
    Promise.all([
      identityTypes.map(idType => models.identityType.create(idType, {
        transaction: t2
      })),
      loanTypes.map(loanType => models.loanType.create(loanType, {
        transaction: t2
      })),
      repaymentStatuses.map(status => models.repaymentStatus.create(status, {
        transaction: t2
      })),
      loanStatuses.map(loanStatus =>
        models.loanStatus.create(loanStatus, {
          transaction: t2
        })
      ),
      repaymentPlanStatuses.map(repaymentPlanStatus =>
        models.repaymentPlanStatus.create(repaymentPlanStatus, {
          transaction: t2
        })
      ),
      placementStatuses.map(placementStatus =>
        models.placementStatus.create(placementStatus, {
          transaction: t2
        })
      ),
      contactNumberTypes.map(contactNumberType =>
        models.contactNumberType.create(contactNumberType, {
          transaction: t2
        })
      ),
      addressTypes.map(addressType =>
        models.addressType.create(addressType, {
          transaction: t2
        })
      ),
      sources.map(source =>
        models.source.create(source, {
          transaction: t2
        })
      ),
      relationships.map(relationship =>
        models.relationship.create(relationship, {
          transaction: t2
        })
      ),
      roles.map(role =>
        models.role.create(role, {
          transaction: t2
        })
      ),
    ])
  ).then((data) => {
    if (!isProduction) {
      return loanTestData();
    }
    return data;
  })
  .catch(error => console.log(error));

  const server = app.listen(port, () => {
    console.log('Server started at port %d', port);
  });

  return server;
});
