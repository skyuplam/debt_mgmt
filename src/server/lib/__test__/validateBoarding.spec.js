import path from 'path';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import XLSX from 'xlsx';
import { validateBoarding } from '../validateBoarding';
import BoardingValidationError from '../BoardingValidationError';
import { boardingFields } from '../boardingFields.json';

chai.use(dirtyChai);

const uploadPath = '../../../../uploads';
const testingFileName = 'BoardingFile20160415_testing.xlsx';
const testFielPath = path.join(__dirname, uploadPath, testingFileName);
const testingFields = [
  {
    field: '投资组合ID',
    required: true,
  }
];

describe('validateBoarding()', () => {
  let worksheet;
  before(() => {
    const workbook = XLSX.readFile(testFielPath);
    const firstSheetName = workbook.SheetNames[0];
    worksheet = workbook.Sheets[firstSheetName];
  });
  it('should throw error if worksheet is empty', () => {
    expect(() =>
      validateBoarding('')
    ).to.throw(BoardingValidationError, /Empty sheet/);
  });
  it('should validate the columns headers', () => {
    expect(validateBoarding(worksheet)).to.be.true();
  });
  it('should throw error if the column headers are not exactly the same', () => {
    expect(() =>
      validateBoarding(worksheet, testingFields)
    ).to.throw(BoardingValidationError, /Incorrect Column Header/);
  });
  it('should throw error when missing required fields', () => {
    const fields = boardingFields;
    fields[12].required = true;
    expect(() =>
      validateBoarding(worksheet, fields)
    ).to.throw(BoardingValidationError, 'Missing Required Field');
  });
});
