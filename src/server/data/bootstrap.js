import typesAndStatus from '../data/data.json';
import models from '../models';
import { loadTestData } from '../data/testDataLoader';
import config from '../config';
import logger from '../lib/logger';
import bcrypt from 'bcrypt';


const { isProduction, adminPwd } = config;


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
  companyTypes,
} = typesAndStatus;

export default function loadData() {
  return models.sequelize.transaction(t2 =>
    // Status and Types
    Promise.all([
      identityTypes.map(idType => models.identityType.create(idType, {
        transaction: t2
      })),
      companyTypes.map(companyType => models.companyType.create(companyType, {
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
  ).then(() => models.sequelize.transaction(t =>
    bcrypt.hashAsync(adminPwd, 10).then(passwordHashed =>
      models.user.create({
        username: 'terrencelam',
        password: passwordHashed
      }, {
        transaction: t
      }).then(user =>
        models.role.find({
          where: {
            role: 'admin'
          }
        }, {
          transaction: t
        }).then(role =>
          user.addRole(role, {
            transaction: t
          })
        )
      )
    )
  ))
  .then((data) => {
    if (!isProduction) {
      return loadTestData();
    }
    return data;
  })
  .catch(error => {
    logger.error(error);
  });
}
