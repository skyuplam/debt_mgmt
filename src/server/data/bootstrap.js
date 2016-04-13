import typesAndStatus from '../data/data.json';
import models from '../models';
import { loanTestData } from '../data/testDataLoader';
import config from '../config';

const { isProduction } = config;

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

export default function loadData() {
  return models.sequelize.transaction(t2 =>
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
  .catch(error => {
    console.error(error);
  });
}
