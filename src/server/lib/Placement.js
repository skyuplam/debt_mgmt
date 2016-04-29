import Boarding from './Boarding';
import placementFields from './placementFields.json';
import rabbit from 'rabbit.js';
import logger from '../lib/logger';
import config from '../config';
import models from '../models';


const {
  rbmqUri,
  rbmqUser,
  rbmqPwd,
} = config;

function placementFieldMapping(ws, r, c) {
  return {
    originatedAgreementNo: Boarding.getCell({ ws, r, c: c['合同号'] }),
    placementCode: Boarding.getCell({ ws, r, c: c['批次号'] }),
  };
}


export default function placement(ws) {
  if (!Boarding.validateBoarding(ws, placementFields.placementFields)) {
    return false;
  }
  const rows = Boarding.getRows(ws);
  const cols = Boarding.getColIndexes(placementFields.placementFields);
  const context = rabbit.createContext(`amqp://${rbmqUser}:${rbmqPwd}@${rbmqUri}`);
  context.on('ready', () => {
    const push = context.socket('PUSH');
    const worker = context.socket('WORKER', { prefetch: 1 });
    worker.setEncoding('utf8');
    worker.connect('placement', () => {
      worker.on('data', row => {
        const r = JSON.parse(row);
        logger.info({
          placementProgress: r.originatedAgreementNo,
        });
        return models.sequelize.transaction(t =>
          models.placement.find({
            where: {
              placementCode: r.placementCode,
            },
            transaction: t,
          }).then(placement =>
            models.loan.find({
              where: {
                originatedAgreementNo: r.originatedAgreementNo,
              }
            }, {
              transaction: t,
            }).then(loan =>
              models.loanPlacement.create({
                refCode: `${placement.placementCode}-${loan.id}`,
                expectedRecalledAt: placement.expectedRecalledAt,
              }, {
                transaction: t,
              }).then(loanPlacement =>
                loanPlacement.setLoan(loan, {
                  transaction: t,
                }).then(() =>
                  loanPlacement.setPlacement(placement, {
                    transaction: t,
                  })
                )
              )
            )
          )
        ).then(() => worker.ack(row)).catch(error => {
          logger.error(error, row);
          worker.ack(row);
        });
      });

      push.connect('placement', () => {
        rows.forEach(r => {
          const theRow = placementFieldMapping(ws, r, cols);
          push.write(JSON.stringify(theRow), 'utf8');
        });
      });
    });
  });
  context.on('error', error => logger.warn(error));
  return true;
}
