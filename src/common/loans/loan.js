import { Record } from 'immutable';

const Loan = Record({
  id: null,
  appliedAt: null,
  issuedAt: null,
  terms: 0,
  delinquentAt: null,
  amount: 0,
  apr: 0,
  transferredAt: null,
  managementFeeRate: 0,
  handlingFeeRate: 0,
  lateFeeRate: 0,
  penaltyFeeRate: 0,
  collectablePrincipal: 0,
  collectableInterest: 0,
  collectableMgmtFee: 0,
  collectableHandlingFee: 0,
  collectableLateFee: 0,
  collectablePenaltyFee: 0,
  repaidTerms: 0,
  completedAt: null,
  originatedAgreementNo: null,
  originatedLoanProcessingBranch: null,
  loanStatusId: null,
});

export default Loan;
