import { utils } from 'xlsx';
import BoardingValidationError from './BoardingValidationError';
import { boardingFields } from './boardingFields.json';


function getFieldNames(fields) {
  return fields.reduce((fieldNames, field) =>
    fieldNames.concat(field.field)
  , []);
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
          throw new BoardingValidationError('Missing Required Field');
        }
      }
    }
  });
  return true;
}

export function validateBoarding(worksheet, fields = boardingFields) {
  if (!worksheet && !worksheet['!ref']) {
    throw new BoardingValidationError('Empty sheet');
  }
  return checkColumnNames(worksheet, fields) &&
    checkRequiredFields(worksheet, fields);
}
