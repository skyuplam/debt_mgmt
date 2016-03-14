export default function (sequelize, DataTypes) {
  const Loan = sequelize.define('loan', {
    appliedAt: {
      type: DataTypes.DATE,
    },
    issuedAt: {
      type: DataTypes.DATE,
    },
    terms: {
      type: DataTypes.INTEGER,
    },
    delinquentAt: {
      type: DataTypes.DATEONLY,
    },
    amount: {
      type: DataTypes.FLOAT
    },
    apr: {
      type: DataTypes.FLOAT
    },
    transferredAt: {
      type: DataTypes.DATEONLY,
    },
    managementFeeRate: {
      type: DataTypes.FLOAT
    },
    handlingFeeRate: {
      type: DataTypes.FLOAT
    },
    lateFeeRate: {
      type: DataTypes.FLOAT
    },
    penaltyFeeRate: {
      type: DataTypes.FLOAT
    },
    collectablePrincipal: {
      type: DataTypes.FLOAT
    },
    collectableInterest: {
      type: DataTypes.FLOAT
    },
    collectableMgmtFee: {
      type: DataTypes.FLOAT
    },
    collectableHandlingFee: {
      type: DataTypes.FLOAT
    },
    collectableLateFee: {
      type: DataTypes.FLOAT
    },
    collectablePenaltyFee: {
      type: DataTypes.FLOAT
    },
    repaidTerms: {
      type: DataTypes.INTEGER
    },
    originatedAgreementNo: {
      type: DataTypes.STRING
    },
    originatedLoanProcessingBranch: {
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: models => {
        Loan.belongsTo(models.loanType);
        Loan.belongsTo(models.loanStatus);
        Loan.belongsTo(models.company, { as: 'originator' });
        Loan.belongsToMany(models.person, {
          through: models.debtorLoan,
          as: 'Debtors',
          foreignKey: 'loanId',
        });
      },
      hook: models => {
        // Init Loan Status to "LO"
        Loan.afterCreate((loan, opts) => {
          return models.loanStatus.findOne({
            where: {
              status: 'Loan Originated'
            }
          }, { transaction: opts.transaction }).then(loanStatus => {
            return loan.setLoanStatus(loanStatus,
              {
                transaction: opts.transaction
              });
          });
        });
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Loan;
}
