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
      type: DataTypes.DATE,
    },
    amount: {
      type: DataTypes.FLOAT
    },
    apr: {
      type: DataTypes.FLOAT
    },
    transferredAt: {
      type: DataTypes.DATE,
    },
    managementFeeRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    handlingFeeRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    lateFeeRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    penaltyFeeRate: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    collectablePrincipal: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    collectableInterest: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    collectableMgmtFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    collectableHandlingFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    collectableLateFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    collectablePenaltyFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    repaidTerms: {
      type: DataTypes.INTEGER
    },
    completedAt: {
      type: DataTypes.DATE
    },
    originatedAgreementNo: {
      type: DataTypes.STRING
    },
    originatedLoanType: {
      type: DataTypes.STRING
    },
    originatedLoanProcessingBranch: {
      type: DataTypes.STRING
    },
    packageReference: {
      type: DataTypes.STRING,
    },
    accruedPrincipal: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    accruedInterest: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    accruedMgmtFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    accruedHandlingFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    accruedLateFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    accruedPenaltyFee: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    lastRepaidAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0.0,
    },
    lastRepaidAt: {
      type: DataTypes.DATE,
      defaultValue: 0.0,
    },
  }, {
    classMethods: {
      associate: models => {
        Loan.belongsTo(models.loanType);
        Loan.belongsTo(models.loanStatus);
        Loan.belongsTo(models.portfolio);
        Loan.belongsToMany(models.person, {
          through: models.debtorLoan,
          as: 'Debtors',
          foreignKey: 'loanId',
        });
        Loan.hasMany(models.loanPlacement);
      },
      hook: models => {
        // Init Loan Status to "LO"
        Loan.afterCreate((loan, opts) =>
          models.loanStatus.findOne({
            where: {
              status: 'Loan Originated'
            }
          }, { transaction: opts.transaction }).then(loanStatus =>
            loan.setLoanStatus(loanStatus,
              {
                transaction: opts.transaction
              })
          )
        );
      }
    },
    freezeTableName: true // Model tableName will be the same as the model name
  });

  return Loan;
}
