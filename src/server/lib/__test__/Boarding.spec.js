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
import { loanMap } from '../LoanMapping.json';

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

  describe('Testing against database', function () {
    beforeEach(function () {
      return Promise.all([
        models.person.truncate({
          cascade: true,
        }),
        models.personContactNumber.truncate({
          cascade: true,
        }),
        models.contactNumber.truncate({
          cascade: true,
        }),
        models.personAddress.truncate({
          cascade: true,
        }),
        models.address.truncate({
          cascade: true,
        }),
        models.identity.truncate({ cascade: true }),
        models.loan.truncate({ cascade: true }),
      ]);
    });
    afterEach(function () {
      return Promise.all([
        models.person.truncate({
          cascade: true,
        }),
        models.personContactNumber.truncate({
          cascade: true,
        }),
        models.contactNumber.truncate({
          cascade: true,
        }),
        models.personAddress.truncate({
          cascade: true,
        }),
        models.address.truncate({
          cascade: true,
        }),
        models.identity.truncate({ cascade: true }),
        models.loan.truncate({ cascade: true }),
      ]);
    });

    describe('#savePersonInfo()', function () {
      it('should save the data into database', function () {
        const personInfos = [{
          idNumber: '440301197209104105',
          issueAuthority: 'Authority',
          censusRegisteredAddress: 'Long Address',
          origRefDebtorId: 'ZAC_456788484833',
          name: 'Perter Pan',
          dob: new Date(1980, 8, 13),
          gender: 'M',
        }, {
          idNumber: '440301197209104104',
          issueAuthority: 'Authority',
          censusRegisteredAddress: 'Long Long Address',
          origRefDebtorId: 'ZAC_456788484834',
          name: 'Marry Lim',
          dob: new Date(1988, 8, 13),
          gender: 'F',
        }];
        return models.sequelize.transaction(function (t) {
          return Promise.all(personInfos.map(function (personInfo) {
            return Boarding.savePersonInfo(personInfo, t);
          }));
        }).then(function (ids) {
          expect(ids).is.an('array');
          expect(ids.length).is.eql(personInfos.length);
          return Promise.all(ids.map(function (id, index) {
            return models.identity.find({
              where: {
                id: id.id,
              },
              include: models.person,
            }).then(function (idP) {
              expect(idP.people[0].name).to.eql(personInfos[index].name);
              return idP;
            });
          }));
        });
      });
    });

    describe('#saveLoan', function () {
      it('should map the loan type', function () {
        expect(loanMap['老板贷']).to.be.eql('Executive Loan');
        expect(loanMap.XXX).to.be.undefined();
      });
      it('should save the loan data into database', function () {
        const loan = {
          originatedAgreementNo: 'ZAC_3456712838',
          packageReference: 1,
          issuedAt: new Date(2010, 10, 19),
          originatedLoanProcessingBranch: 'Branch',
          originatedLoanType: '老板贷',
          amount: 50000,
          terms: 12,
          delinquentAt: new Date(2011, 2, 19),
          transferredAt: new Date(2015, 12, 7),
          apr: 0.276,
          managementFeeRate: 0,
          handlingFeeRate: 0,
          lateFeeRate: 0.001,
          penaltyFeeRate: 0,
          collectablePrincipal: 40000.0,
          collectableInterest: 12343.0,
          collectableMgmtFee: 6573.0,
          collectableHandlingFee: 9283.0,
          collectableLateFee: 3453.0,
          collectablePenaltyFee: 1246.5,
          repaidTerms: 1,
          accruedPrincipal: 10000.0,
          accruedInterest: 3454.5,
          accruedMgmtFee: 2344.0,
          accruedHandlingFee: 434.0,
          accruedLateFee: 423.0,
          accruedPenaltyFee: 4234.0,
          lastRepaidAmount: 3644.0,
          lastRepaidAt: new Date(2010, 11, 19),
        };
        return models.sequelize.transaction(function (t) {
          return Boarding.saveLoan(loan, t).then(function (theLoan) {
            Object.keys(loan).forEach(function (k) {
              if ([
                'issuedAt',
                'delinquentAt',
                'transferredAt',
                'lastRepaidAt',
              ].indexOf(k) !== -1) {
                expect(new Date(theLoan[k])).to.be.eql(loan[k]);
              } else {
                expect(theLoan[k]).to.be.eql(loan[k]);
              }
            });
          });
        });
      });
    });

    describe('#savePersonAddresses()', function () {
      it('should save the address to database', function () {
        const addresses = [{
          longAddress: 'Long Long Address',
          addressType: 'Home',
          source: 'Originator',
          relationship: 'Personal',
          contactPerson: undefined,
          companyName: undefined,
        }, {
          longAddress: 'Long Long Address 2',
          addressType: 'Work',
          source: 'Originator',
          relationship: 'Spouse',
          contactPerson: 'Tester 2',
          companyName: 'ABC company',
        }, {
          longAddress: undefined,
          addressType: 'Work',
          source: 'Originator',
          relationship: 'Spouse',
          contactPerson: undefined,
          companyName: undefined,
        }];
        return models.sequelize.transaction(function (t) {
          return models.person.create({
            name: 'Tester',
          }, {
            transaction: t
          }).then(function (person) {
            return Boarding.savePersonAddresses(person, addresses, t)
              .then(function (personAddresses) {
                expect(personAddresses).is.an('array');
                expect(personAddresses.length).is.eql(addresses.length);
                personAddresses.forEach(function (pa, index) {
                  if (index !== addresses.length - 1) {
                    expect(pa.addressId).to.exist('pa.addressId');
                    expect(pa.addressTypeId).to.exist('pa.addressTypeId');
                    expect(pa.personId).to.exist('pa.personId');
                    expect(pa.sourceId).to.exist('pa.sourceId');
                    expect(pa.contactPerson).to.eql(addresses[index].contactPerson);
                    expect(pa.relationshipId).to.exist('pa.relationshipId');
                    if (index === 1) {
                      expect(pa.companyId).to.exist('pa.companyId');
                    }
                  } else {
                    expect(pa).to.be.null('pa');
                  }
                });
              });
          });
        });
      });
    });

    describe('#savePersonContacts()', function () {
      it('should save into database', function () {
        const contacts = [{
          contactNumber: '157889900',
          countryCode: '+86',
          contactNumberType: 'Mobile',
          contactPerson: undefined,
          source: 'Originator',
          relationship: 'Personal',
          companyName: undefined,
        }, {
          contactNumber: '157889901',
          countryCode: '+86',
          contactNumberType: 'Mobile',
          contactPerson: 'Pete Pon',
          source: 'Originator',
          relationship: 'Spouse',
          companyName: 'BBC Ltd',
        }, {
          contactNumber: '',
          countryCode: undefined,
          contactNumberType: 'Mobile',
          contactPerson: undefined,
          source: 'Originator',
          relationship: 'Spouse',
          companyName: undefined,
        }];
        return models.sequelize.transaction(function (t) {
          return models.person.create({
            name: 'Tester',
          }, {
            transaction: t
          }).then(function (person) {
            return Boarding.savePersonContacts(person, contacts, t)
              .then(function (personContacts) {
                expect(personContacts).is.an('array');
                expect(personContacts.length).is.eql(contacts.length);
                personContacts.forEach(function (pa, index) {
                  if (index !== contacts.length - 1) {
                    expect(pa.contactNumberId).to.exist();
                    expect(pa.contactPerson).to.eql(contacts[index].contactPerson);
                    expect(pa.personId).to.exist();
                    expect(pa.sourceId).to.exist();
                    expect(pa.relationshipId).to.exist();
                    if (index === 1) {
                      expect(pa.companyId).to.exist('pa.companyId');
                    }
                  } else {
                    expect(pa).is.be.null('pa');
                  }
                });
              });
          });
        });
      });
    });

    describe('#boarding()', function () {
      let worksheet;
      before(function () {
        const workbook = XLSX.readFile(testFielPath);
        const firstSheetName = workbook.SheetNames[0];
        worksheet = workbook.Sheets[firstSheetName];
        return models.portfolio.create({
          referenceCode: 'SZYZ-Z-201512070001',
          biddedAt: new Date(2015, 12, 7),
          cutoffAt: new Date(2015, 12, 7),
        });
      });
      after(function () {
        return models.portfolio.truncate({
          cascade: true,
        });
      });
      it('should save the data into database from the worksheet provided', function () {
        const ws = worksheet;
        return Boarding.boarding(ws).then(function () {
          const rows = Boarding.getRows(ws);
          const cols = Boarding.getColIndexes();
          return Promise.all(rows.map(function (r) {
            return models.identity.find({
              where: {
                idNumber: Boarding.getCell({ ws, r, c: cols['身份证号'] }),
              },
              include: [models.person]
            }).then(function (id) {
              expect(id).to.exist();
              expect(id.people).is.an('array');
              expect(id.people[0]).to.exist();
              expect(id.people[0].name).to.eql(Boarding.getCell({ ws, r, c: cols['姓名'] }));
            });
          }));
        });
      });
    });
  });
});
