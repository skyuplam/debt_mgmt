import api from './api';
import config from './config';
import errorHandler from './lib/errorHandler';
import express from 'express';
import helmet from 'helmet';
import frontend from './frontend';
import models from './models';
import data from './data/testData.json';

const app = express();

// helmet
app.use(helmet());

app.use('/api/v1', api);
app.use(frontend);
app.use(errorHandler);

const { port, isProduction } = config;

models.sequelize.sync({force: !!!isProduction}).then(() => {
  
  const { debtors } = data;

  models.sequelize.transaction(t1 =>
    models.identityType.create({
      type: 'ID Card',
      description: '身份证'
    }, {
      transaction: t1
    })
  ).then(identityType =>
    models.sequelize.transaction(t2 =>
      Promise.all(
        debtors.map(debtor => {
          return models.identity.create({
            idNumber: debtor['身份证号']
          }).then(identity => {
            identity.setIdentityType(identityType);
            return models.person.create({
              name: debtor['客户姓名'],
              dob: new Date(1980, 7, Math.floor(Math.random() * (31)) + 1)
            }).then(person => {
              person.addIdentity(identity);
              return person;
            });
          }).then(person =>
            models.loan.create({
              amount: parseFloat(debtor['原贷款本金']),
              terms: parseInt(debtor['贷款总期数']),
              issuedAt: new Date(debtor['贷款日期']),
              transferredAt: new Date(debtor['转让日期']),
              collectableMgmtFee: parseFloat(debtor['管理费应收']),
              collectableHandlingFee: parseFloat(debtor['手续费应收']),
              collectableLateFee: parseFloat(debtor['滞纳金应收']),
              collectablePenaltyFee: parseFloat(debtor['违约金应收']),
              collectablePrincipal: parseFloat(debtor['本金应收']),
              collectableInterest: parseFloat(debtor['利息应收']),
              repaidTerms: parseInt(debtor['已还期数']),
              originatedAgreementNo: debtor['贷款合同号'],
              originatedLoanProcessingBranch: debtor['分行']
            }).then(loan => {
              person.addLoan(loan);
              return loan;
            })
          );
        })
      )
    )
  ).catch(error =>
      console.log(error)
  );



  var server = app.listen(port, () => {
    console.log('Server started at port %d', port);
  });

  return server;
});
