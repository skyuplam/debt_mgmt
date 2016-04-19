import { utils } from 'xlsx';
import BoardingValidationError from './BoardingValidationError';
import { boardingFields } from './boardingFields.json';
import models from '../models';
import logger from '../lib/logger';


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
        models.identity.findOrCreate({
          where: {
            idNumber: getCell({ ws, r, c: cols['身份证号'] }),
          },
          include: [
            {
              model: models.identityType,
              where: {
                type: 'ID Card'
              }
            }
          ],
          defaults: {
            idNumber: getCell({ ws, r, c: cols['身份证号'] }),
            issueAuthority: getCell({ ws, r, c: cols['发证机关'] }),
          },
          transaction: t
        }).all().then(([identity, created]) => {
          if (created) {
            return models.identityType.find({
              where: {
                type: 'ID Card'
              },
              transaction: t
            }).then(idType =>
              identity.setIdentityType(idType, {
                transaction: t
              })
            ).then(identity =>
              models.address.create({
                longAddress: getCell({ ws, r, c: cols['身份证户籍地址'] }),
              }, {
                transaction: t
              }).then(address =>
                identity.setCensusRegisteredAddress(address, {
                  transaction: t
                })
              )
            ).then(identity =>
              models.person.create({
                name: getCell({ ws, r, c: cols['姓名'] }),
                dob: getIdInfo(identity.idNumber).dob,
                gender: getIdInfo(identity.idNumber).gender,
              }, {
                transaction: t
              }).then(person => {
                person.addIdentity(identity, {
                  transaction: t
                });
                return person;
              })
            );
          }
          return models.person.find({
            include: [
              {
                model: models.identity,
                where: {
                  id: identity.id
                }
              }
            ],
            transaction: t
          });
        })
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
Boarding.boarding = boarding;

export default Boarding;
