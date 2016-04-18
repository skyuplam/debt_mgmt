import XLSX from 'xlsx';
import validateBoarding from '../validateBoarding';

const uploadPath = '../../../../uploads/';

describe('validateBoarding()', () => {
  it('should read the first sheet of workbook', () => {
    XLSX.readfile(`${uploadPath}/`)
  });
});
