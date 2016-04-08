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

// passport setup
app.use(passport.initialize());
// passport piggy backs of express sessions, still need to set express session options
app.use(passport.session());


// helmet
app.use(helmet());

app.use('/api/v1', api);
app.use(frontend);
app.use(errorHandler);

const { port, isProduction } = config;

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
