/* eslint-disable no-alert, func-names, prefer-arrow-callback */
import path from 'path';
import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import chaiAsPromised from 'chai-as-promised';
import XLSX from 'xlsx';
import Boarding from '../Boarding';
import BoardingValidationError from '../BoardingValidationError';
import { boardingFields } from '../boardingFields.json';
import models from '../../models';

chai.use(dirtyChai);
chai.use(chaiAsPromised);

const uploadPath = '../../../../uploads';
const testingFileName = 'BoardingFile20160415_testing.xlsx';
const testFielPath = path.join(__dirname, uploadPath, testingFileName);
const testingFields = [
  {
    field: '投资组合ID',
    required: true,
  }
];

describe('Boarding', function () {
  describe('#validateBoarding()', function () {
    let worksheet;
    before(function () {
      const workbook = XLSX.readFile(testFielPath);
      const firstSheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[firstSheetName];
    });
    afterEach(function () {
      boardingFields[12].required = false;
    });

    it('should throw error if worksheet is empty', function () {
      expect(function () {
        Boarding.validateBoarding('');
      }).to.throw(BoardingValidationError, /Empty sheet/);
    });
    it('should validate the columns headers', function () {
      const result = Boarding.validateBoarding(worksheet);
      console.log(JSON.stringify(result));
      expect(result).to.be.true();
    });
    it('should throw error if the column headers are not exactly the same', function () {
      expect(function () {
        Boarding.validateBoarding(worksheet, testingFields);
      }).to.throw(BoardingValidationError, /Incorrect Column Header/);
    });
    it('should throw error when missing required fields', function () {
      boardingFields[12].required = true;
      expect(function () {
        Boarding.validateBoarding(worksheet, boardingFields);
      }).to.throw(BoardingValidationError, 'Missing Required Field');
    });
  });

  describe('#checkIfPortfolioExists()', function () {
    let worksheet;
    before(function () {
      const workbook = XLSX.readFile(testFielPath);
      const firstSheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[firstSheetName];
    });
    it('should verify with db if the portfolio exists', function () {
      expect(Boarding.checkIfPortfolioExists(worksheet)).to.eventually.be.fulfilled();
    });
  });

  describe('#getFieldNames()', function () {
    it('should return [] if given nothing', function () {
      expect(Boarding.getFieldNames([])).to.be.an('array');
      expect(Boarding.getFieldNames([])).to.be.empty();
      expect(Boarding.getFieldNames([
        {
          field: 'Test1',
        },
        {
          field: 'Test2',
        },
        {
          field: 'Test4',
        },
        {
          field: 'Test3',
        },
      ])).to.be.eql(['Test1', 'Test2', 'Test4', 'Test3']);
    });
  });

  describe('#getColIndexes()', function () {
    it('should return empty object if given empty []', function () {
      const idxes = Boarding.getColIndexes([]);
      expect(idxes).to.be.empty();
    });
    it('should return an object of indexes', function () {
      const idxes = Boarding.getColIndexes([
        {
          field: 'test1',
        },
        {
          field: 'test3',
        },
        {
          field: 'test2',
        }
      ]);
      expect(idxes).to.exist();
      expect(idxes.test1).to.be.equal(0);
      expect(idxes.test3).to.be.equal(1);
      expect(idxes.test2).to.be.equal(2);
    });
  });

  describe('#getIdInfo()', function () {
    it('should return an object even if given nothing', function () {
      expect(Boarding.getIdInfo()).to.be.empty();
      expect(Boarding.getIdInfo('')).to.be.empty();
      expect(Boarding.getIdInfo('xxxx')).to.be.empty();
      expect(Boarding.getIdInfo('xxxx')).to.be.exist();
      expect(Boarding.getIdInfo('xxxxxxxxxxxxxxx')).to.be.exist();
      expect(Boarding.getIdInfo('xxxxxxxxxxxxxxx')).to.have.all.keys(['dob', 'gender']);
    });
    it('should return an object that match a number string of length of 15', function () {
      expect(Boarding.getIdInfo('445224831225241')).to.have.all.keys(['dob', 'gender']);
      expect(Boarding.getIdInfo('445224831225241').dob).to.be.eql(new Date(1983, 12, 25));
      expect(Boarding.getIdInfo('445224831225241').gender).to.be.eql('M');
      expect(Boarding.getIdInfo('445224831225240').gender).to.be.eql('F');
      expect(Boarding.getIdInfo('44522483122524X').gender).to.be.undefined();
    });
    it('should return an object that match a number string of length of 18', function () {
      expect(Boarding.getIdInfo('440524188001010014')).to.have.all.keys(['dob', 'gender']);
      expect(Boarding.getIdInfo('440524188001010014').dob).to.be.eql(new Date(1880, 1, 1));
      expect(Boarding.getIdInfo('440524188001010014').gender).to.be.eql('M');
      expect(Boarding.getIdInfo('440524188001010024').gender).to.be.eql('F');
      expect(Boarding.getIdInfo('44052418800101001X').gender).to.not.be.undefined();
      expect(Boarding.getIdInfo('44052418800101001x').gender).to.not.be.undefined();
      expect(Boarding.getIdInfo('4405241xx00101001x').gender).to.be.undefined();
    });
  });

  describe('#getRows()', function () {
    let worksheet;
    before(function () {
      const workbook = XLSX.readFile(testFielPath);
      const firstSheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[firstSheetName];
    });

    it('should return an array', function () {
      const rows = Boarding.getRows(worksheet);
      expect(rows).to.not.be.empty();
      expect(rows).to.be.an('array');
      expect(rows.length).to.equal(5);
      expect(rows[0]).to.be.equal(1);
      expect(rows[4]).to.be.equal(5);
    });
  });

  describe('#getCell()', function () {
    let worksheet;
    before(function () {
      const workbook = XLSX.readFile(testFielPath);
      const firstSheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[firstSheetName];
    });

    it('should return a cell value', function () {
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      const firstCell = Boarding.getCell({
        ws: worksheet,
        r: range.s.r,
        c: range.s.c,
      });
      const lastCell = Boarding.getCell({
        ws: worksheet,
        r: range.e.r,
        c: range.s.c,
      });
      const outOfRangeCell = Boarding.getCell({
        ws: worksheet,
        r: range.e.r + 1,
        c: 0,
      });
      expect(firstCell).to.be.a('string');
      expect(firstCell).to.be.equal('投资组合代号');
      expect(lastCell).to.be.a('string');
      expect(lastCell).to.be.equal('SZYZ-Z-201512070001');
      expect(outOfRangeCell).to.be.undefined();
    });
  });

  describe('#savePersonInfo()', function () {
    it('should save the data into database', function () {
      const idNumber = '440301197209104105';
      const issueAuthority = 'Authority';
      const censusRegisteredAddress = 'Long Address';
      const origainatorRefDebtorId = 'ZAC_456788484833';
      const name = 'Perter Pan';
      const dob = new Date(1980, 8, 13);
      const gender = 'M';
      return models.sequelize.transaction(function (t) {
        return Boarding.savePersonInfo({
          idNumber,
          issueAuthority,
          censusRegisteredAddress,
          origainatorRefDebtorId,
          name,
          dob,
          gender,
        }, t);
      }).then(function (identity) {
        expect(identity.idNumber).to.be.eql(idNumber);
        expect(identity.issueAuthority).to.be.eql(issueAuthority);
        return models.address.findById(identity.censusRegisteredAddressId)
          .then(function (address) {
            expect(address.longAddress).to.be.eql(censusRegisteredAddress);
          }).then(function () {
            return models.person.find({
              include: [{
                model: models.identity,
                where: {
                  idNumber
                }
              }]
            }).then(function (person) {
              expect(person.name).to.be.eql(name);
              expect(new Date(person.dob)).to.be.eql(dob);
              expect(person.gender).to.be.eql(gender);
            });
          });
      });
    });
  });

  describe('#boarding', function () {
    let worksheet;
    before(function () {
      const workbook = XLSX.readFile(testFielPath);
      const firstSheetName = workbook.SheetNames[0];
      worksheet = workbook.Sheets[firstSheetName];
      return models.sequelize.transaction(function (t) {
        return models.portfolio.create({
          referenceCode: Boarding.getCell({ ws: worksheet, r: 1, c: 0 }),
          biddedAt: new Date(2015, 12, 7),
          cutoffAt: new Date(2015, 12, 7),
        }, {
          transaction: t
        }).then(function (portfolio) {
          return models.company.create({
            name: 'ZAC',
            code: 'ZAC',
          }, {
            transaction: t
          }).then(function (company) {
            return models.companyType.find({
              where: {
                type: 'MoneyLender'
              },
              transaction: t
            }).then(function (companyType) {
              return company.setCompanyType(companyType, {
                transaction: t
              });
            });
          }).then(function (company) {
            return portfolio.setCompany(company, {
              transaction: t
            });
          });
        });
      }).then(function () {
        return Boarding.boarding(worksheet);
      });
    });
    after(function () {
      return models.sequelize.transaction(function (t) {
        return models.portfolio.destroy({
          where: {
            referenceCode: Boarding.getCell({ ws: worksheet, r: 1, c: 0 }),
          },
          transaction: t
        }).then(function () {
          return models.company.destroy({
            where: {
              code: 'ZAC'
            },
            transaction: t
          });
        });
      });
    });
    // it('should add identity', function () {
    //   return models.identity.findAll({
    //     include: [
    //       {
    //         model: models.identityType,
    //         where: {
    //           type: 'ID Card',
    //         }
    //       }
    //     ]
    //   }).then(function (ids) {
    //     const colIdxes = Boarding.getColIndexes();
    //     const rows = Boarding.getRows(worksheet);
    //     const identities = ids.reduce(function (prev, cur) {
    //       return prev.concat(cur.idNumber);
    //     }, []);
    //     expect(rows).to.exist();
    //     return rows.forEach(function (r) {
    //       const cell = Boarding.getCell({ ws: worksheet, r, c: colIdxes['身份证号'] });
    //       return expect(identities.indexOf(cell) !== -1).to.be
    //         .true(`${cell} is not in ${JSON.stringify(identities)}`);
    //     });
    //   });
    // });
  });
});
