import { utils } from 'xlsx';
import BoardingValidationError from './BoardingValidationError';
import { boardingFields } from './boardingFields.json';
import models from '../models';
import logger from '../lib/logger';
import { loanMap } from './LoanMapping.json';
// import { relationshipMap } from './RelationshipMapping.json';


function getFieldNames(fields) {
  return fields.reduce((fieldNames, field) =>
    fieldNames.concat(field.field)
  , []);
}

function getGender(str) {
  const number = parseInt(str, 10);
  if (number % 2) {
    return 'M';
  }
  return 'F';
}

function getIdInfo(idNumber) {
  if (!idNumber) {
    return {};
  }
  const len = idNumber.length;
  if (len < 15) {
    return {};
  }
  const yearAt = 3;
  const monthAt = 4;
  const dayAt = 5;
  const genderAt = 6;
  let dob = undefined;
  let gender = undefined;
  if (len === 15) {
    const pattern = /^(\d{6})((\d{2})(\d{2})(\d{2}))(\d{3})$/;
    const result = pattern.exec(idNumber);
    if (result) {
      dob = new Date(
        parseInt(`19${result[yearAt]}`, 10),
        parseInt(result[monthAt], 10),
        parseInt(result[dayAt], 10));
      gender = getGender(result[genderAt]);
    }
  } else if (len === 18) {
    const pattern = /^(\d{6})((\d{4})(\d{2})(\d{2}))(\d{3})([0-9Xx]{1})$/;
    const result = pattern.exec(idNumber);
    if (result) {
      dob = new Date(
        parseInt(result[yearAt], 10),
        parseInt(result[monthAt], 10),
        parseInt(result[dayAt], 10));
      gender = getGender(result[genderAt]);
    }
  }
  return {
    dob,
    gender,
  };
}

function getCell({ ws, r, c }) {
  const cell = ws[utils.encode_cell({ r, c })];
  return cell ? cell.v : undefined;
}

function getRows(ws) {
  const range = utils.decode_range(ws['!ref']);
  // Gather the rows except the 1st row
  const rows = [];
  for (let i = range.s.r + 1; i <= range.e.r; i++) {
    rows.push(i);
  }
  return rows;
}


function getColIndexes(fields = boardingFields) {
  return fields.reduce((prev, cur, curIdx) => {
    prev[cur.field] = curIdx;
    return prev;
  }, {});
}

function checkColumnNames(worksheet, fields = boardingFields) {
  const columnNames = getFieldNames(fields);
  for (let c = 0; c < columnNames.length; c++) {
    const headerCellValue = worksheet[utils.encode_cell({ r: 0, c })].v;
    if (headerCellValue !== columnNames[c]) {
      throw new BoardingValidationError('Incorrect Column Header', {
        header: headerCellValue
      });
    }
  }
  return true;
}

function checkRequiredFields(worksheet, fields = boardingFields) {
  const range = utils.decode_range(worksheet['!ref']);
  fields.forEach((field, idx) => {
    if (field.required) {
      for (let i = range.s.r; i <= range.e.r; i++) {
        if (!worksheet[utils.encode_cell({ r: i, c: idx })] ||
          !worksheet[utils.encode_cell({ r: i, c: idx })].v
        ) {
          throw new BoardingValidationError('Missing Required Field', {
            field: field.field
          });
        }
      }
    }
  });
  return true;
}

function checkIfPortfolioExists(worksheet) {
  const range = utils.decode_range(worksheet['!ref']);
  // Portfolio Code should be at A2
  const firstPortfolioValue = worksheet[utils.encode_cell({
    r: 1,
    c: 0
  })].v;
  for (let i = range.s.r + 1; i <= range.e.r; i++) {
    const portfolioCode = worksheet[utils.encode_cell({
      r: i,
      c: 0
    })].v;
    if (portfolioCode !== firstPortfolioValue) {
      throw new BoardingValidationError('Inconsistent Portfolio Code', {
        portfolioCode
      });
    }
  }
  return models.portfolio.find({
    where: {
      referenceCode: firstPortfolioValue
    }
  });
}

function validateBoarding(worksheet, fields = boardingFields) {
  if (!worksheet && !worksheet['!ref']) {
    throw new BoardingValidationError('Empty sheet');
  }
  return checkColumnNames(worksheet, fields) &&
    checkRequiredFields(worksheet, fields);
}

function savePersonInfo({
  idNumber,
  issueAuthority,
  censusRegisteredAddress,
  origRefDebtorId,
  name,
  dob,
  gender,
}, t) {
  return models.identityType.find({
    where: {
      type: 'ID Card',
    },
    transaction: t
  }).then(idType =>
    models.identity.findOrCreate({
      where: {
        idNumber
      },
      include: [{
        model: models.identityType,
        where: {
          type: idType.type,
        }
      }],
      defaults: {
        idNumber,
        issueAuthority,
      },
      transaction: t
    }).all().then(([identity, created]) => {
      if (created) {
        return models.person.create({
          name,
          dob,
          gender,
        }, {
          transaction: t
        }).then(person =>
          person.addIdentity(identity, {
            transaction: t
          }).then(() =>
            models.identity.findOrCreate({
              where: {
                idNumber: origRefDebtorId
              },
              include: [{
                model: models.identityType,
                where: {
                  type: 'Portfolio Company ID'
                },
              }],
              defaults: {
                idNumber: origRefDebtorId
              },
              transaction: t
            }).all().then(([debtorId, created]) => {
              if (created) {
                return models.identityType.find({
                  where: {
                    type: 'Portfolio Company ID'
                  },
                  transaction: t
                }).then(debtorIdType =>
                  debtorId.setIdentityType(debtorIdType, {
                    transaction: t
                  })
                ).then(() =>
                  person.addIdentity(debtorId, {
                    transaction: t
                  }).then(() => person)
                );
              }
              return person.addIdentity(debtorId, {
                transaction: t
              }).then(() => person);
            })
          )
        ).then(() =>
          identity.setIdentityType(idType, {
            transaction: t
          })
        ).then(() =>
          models.address.findOrCreate({
            where: {
              longAddress: censusRegisteredAddress,
            },
            defaults: {
              longAddress: censusRegisteredAddress,
            },
            transaction: t
          }).all().then(([address]) =>
            identity.setCensusRegisteredAddress(address, {
              transaction: t
            })
          ).then(() => identity)
        );
      }
      return identity;
    })
  );
}

function saveLoan({
  originatedAgreementNo,
  packageReference,
  issuedAt,
  originatedLoanProcessingBranch,
  originatedLoanType,
  amount,
  terms,
  delinquentAt,
  transferredAt,
  apr,
  managementFeeRate,
  handlingFeeRate,
  lateFeeRate,
  penaltyFeeRate,
  collectablePrincipal,
  collectableInterest,
  collectableMgmtFee,
  collectableHandlingFee,
  collectableLateFee,
  collectablePenaltyFee,
  repaidTerms,
  accruedPrincipal,
  accruedInterest,
  accruedMgmtFee,
  accruedHandlingFee,
  accruedLateFee,
  accruedPenaltyFee,
  lastRepaidAmount,
  lastRepaidAt,
}, t) {
  return models.loan.create({
    originatedAgreementNo,
    packageReference,
    issuedAt,
    originatedLoanProcessingBranch,
    originatedLoanType,
    amount,
    terms,
    delinquentAt,
    transferredAt,
    apr,
    managementFeeRate,
    handlingFeeRate,
    lateFeeRate,
    penaltyFeeRate,
    collectablePrincipal,
    collectableInterest,
    collectableMgmtFee,
    collectableHandlingFee,
    collectableLateFee,
    collectablePenaltyFee,
    repaidTerms,
    accruedPrincipal,
    accruedInterest,
    accruedMgmtFee,
    accruedHandlingFee,
    accruedLateFee,
    accruedPenaltyFee,
    lastRepaidAmount,
    lastRepaidAt,
  }, {
    transaction: t
  }).then(loan =>
    models.loanType.find({
      where: {
        type: loanMap[originatedLoanType],
      },
      transaction: t
    }).then(loanType =>
      loan.setLoanType(loanType, {
        transaction: t
      })
    )
  );
}

/*
 * addresses: an array of address containing
 *   loangAddress
 *   addressType
 *   source
 *   relationship
 *   contactPerson: allowNull
 *   companyName: allowNull
 * person: sequelize instance
 * t: transaction
 */
function savePersonAddresses(person, addresses, t) {
  if (!person || !Array.isArray(addresses)) {
    throw new BoardingValidationError('Invalid param', {
      person,
      addresses,
    });
  }
  return models.companyType.find({
    where: {
      type: 'General'
    },
    transaction: t
  }).then(generalCompanyType =>
    Promise.all(addresses.map(address =>
      models.address.findOrCreate({
        where: {
          longAddress: address.longAddress,
        },
        defaults: {
          longAddress: address.longAddress
        },
        transaction: t,
      }).all().then(([theAddress]) =>
        models.addressType.find({
          where: {
            type: address.addressType
          },
          transaction: t,
        }).then(addressType =>
          models.personAddress.create({
            contactPerson: address.contactPerson
          }, {
            transaction: t
          }).then(personAddress =>
            personAddress.setPerson(person, {
              transaction: t
            }).then(() =>
              personAddress.setAddress(theAddress, {
                transaction: t,
              })
            ).then(() =>
              personAddress.setAddressType(addressType, {
                transaction: t,
              })
            ).then(() =>
              models.relationship.find({
                where: {
                  relationship: address.relationship
                },
                transaction: t,
              }).then(relationship =>
                personAddress.setRelationship(relationship, {
                  transaction: t,
                })
              ).then(() =>
                models.source.find({
                  where: {
                    source: address.source,
                  },
                  transaction: t,
                }).then(source =>
                  personAddress.setSource(source, {
                    transaction: t,
                  })
                ).then(() => {
                  if (address.companyName) {
                    return models.company.findOrCreate({
                      where: {
                        name: address.companyName,
                      },
                      defaults: {
                        name: address.companyName,
                      },
                      transaction: t,
                    }).all().then(([company, created]) => {
                      if (created) {
                        return company.setCompanyType(generalCompanyType, {
                          transaction: t,
                        });
                      }
                      return company;
                    }).then(company =>
                      personAddress.setCompany(company, {
                        transaction: t,
                      })
                    );
                  }
                  return personAddress;
                })
              )
            )
          )
        )
      )
    ))
  );
}
/*
 * contacts: [{
 *   contactNumber: @ref contactNumber,
 *   countryCode: @ref contactNumber,
 *   contactNumberType: @ref contactNumberType,
 *   contactPerson: @ref contactNumber,
 *   source: @ref source,
 *   relationship: @ref relationship,
 *   companyName: @ref company,
 * }]
 */
function savePersonContacts(person, contacts, t) {
  if (!person || !Array.isArray(contacts)) {
    throw new BoardingValidationError('Invalid param', {
      person,
      contacts,
    });
  }
  return models.companyType.find({
    where: {
      type: 'General'
    },
    transaction: t
  }).then(generalCompanyType =>
    Promise.all(contacts.map(contact =>
      models.contactNumber.findOrCreate({
        where: {
          contactNumber: contact.contactNumber,
          countryCode: contact.countryCode,
        },
        transaction: t,
        defaults: {
          countryCode: '+86',
        }
      }).all().then(([contactNumber, created]) => {
        if (created) {
          return models.contactNumberType.find({
            where: {
              type: contact.contactNumberType,
            },
            transaction: t,
          }).then(contactNumberType =>
            contactNumber.setContactNumberType(contactNumberType, {
              transaction: t,
            })
          );
        }
        return contactNumber;
      }).then(contactNumber =>
        models.personContactNumber.create({
          contactPerson: contact.contactPerson,
        }, {
          transaction: t,
        }).then(personContactNumber =>
          personContactNumber.setContactNumber(contactNumber, {
            transaction: t
          }).then(() =>
            personContactNumber.setPerson(person, {
              transaction: t,
            })
          ).then(() =>
            models.source.find({
              where: {
                source: contact.source,
              },
              transaction: t,
            }).then(source =>
              personContactNumber.setSource(source, {
                transaction: t,
              })
            )
          ).then(() =>
            models.relationship.find({
              where: {
                relationship: contact.relationship,
              },
              transaction: t,
            }).then(relationship =>
              personContactNumber.setRelationship(relationship, {
                transaction: t,
              })
            )
          ).then(() => {
            if (contact.companyName) {
              return models.company.findOrCreate({
                where: {
                  name: contact.companyName,
                },
                transaction: t,
              }).all().then(([company, created]) => {
                if (created) {
                  return company.setCompanyType(generalCompanyType, {
                    transaction: t,
                  });
                }
                return company;
              }).then(company =>
                personContactNumber.setCompany(company, {
                  transaction: t,
                })
              );
            }
            return personContactNumber;
          })
        )
      )
    ))
  );
}

function boarding(ws, fields = boardingFields) {
  if (!validateBoarding(ws, fields)) {
    return false;
  }
  const referenceCode = ws[utils.encode_cell({ r: 1, c: 0 })].v;
  // const range = utils.decode_range(ws['!ref']);
  // Gather the rows except the 1st row
  const rows = getRows(ws);
  const cols = getColIndexes();
  return models.portfolio.find({
    where: {
      referenceCode
    },
  }).then(portfolio =>
    Promise.all(rows.forEach(r =>
      models.sequelize.transaction(t =>
        logger.debug(r, t, portfolio, cols)
      ).catch(error => logger.error(error))
    ))
  );
}

const Boarding = {};

Boarding.getFieldNames = getFieldNames;
Boarding.getColIndexes = getColIndexes;
Boarding.getIdInfo = getIdInfo;
Boarding.getRows = getRows;
Boarding.getCell = getCell;
Boarding.validateBoarding = validateBoarding;
Boarding.checkIfPortfolioExists = checkIfPortfolioExists;
Boarding.savePersonInfo = savePersonInfo;
Boarding.saveLoan = saveLoan;
Boarding.savePersonAddresses = savePersonAddresses;
Boarding.savePersonContacts = savePersonContacts;
Boarding.boarding = boarding;

export default Boarding;
