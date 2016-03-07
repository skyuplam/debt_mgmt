import { Record } from 'immutable';

const Loan = Record({
  id: null,
  appliedAt: null,
  issuedAt: null,
  terms: null,
  delinquentAt: null,
  amount: null,
  apr: null,
  transferredAt: null,
  managementFeeRate: null,
  handlingFeeRate: null,
  lateFeeRate: null,
  penaltyFeeRate: null,
  collectablePrincipal: null,
  collectableInterest: null,
  collectableMgmtFee: null,
  collectableHandlingFee: null,
  collectableLateFee: null,
  collectablePenaltyFee: null,
  repaidTerms: null,
  originatedAgreementNo: null,
  originatedLoanProcessingBranch: null,
});

export default Loan;
