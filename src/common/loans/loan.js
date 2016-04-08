import { Record } from 'immutable';
import moment from 'moment';

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
  originator: null,
  originatedAgreementNo: null,
  originatedLoanProcessingBranch: null,
  loanStatusId: null,
  placementStatusId: null,
  placementCode: '',
  placementServicingFeeRate: 0.0,
  placedAt: null,
  expectedRecalledAt: null,
  recalledAt: null,
  agency: '',
});

export function getInterestAfterCutoff(loan) {
  if (!loan) {
    return 0;
  }
  const cutOffDate = moment(loan.transferredAt);
  const monthlyInterestRate = loan.apr / 12;
  const principal = loan.collectablePrincipal;
  const now = moment();
  // Round up for the number of month elapsed
  const nMths = Math.ceil(now.diff(cutOffDate, 'months', true));
  // We use simple interest calculation here
  return Math.round(monthlyInterestRate * principal * nMths * 100.0) / 100.0;
}

export function getLateFeeAfterCutoff(loan) {
  if (!loan) {
    return 0;
  }
  const cutOffDate = moment(loan.transferredAt);
  const dailyRate = loan.lateFeeRate;
  const principal = loan.collectablePrincipal;
  const now = moment();
  // Round up for the number of month elapsed
  const nMths = Math.ceil(now.diff(cutOffDate, 'days', true));
  // We use simple interest calculation here
  return Math.round(dailyRate * principal * nMths * 100.0) / 100.0;
}

export function getTotalAmount(loan) {
  return loan.collectablePrincipal +
  loan.collectableInterest +
  loan.collectableMgmtFee +
  loan.collectableHandlingFee +
  loan.collectableLateFee +
  loan.collectablePenaltyFee +
  getInterestAfterCutoff(loan) +
  getLateFeeAfterCutoff(loan);
}

export function getServicingFee(loan) {
  const placementServicingFeeRate = loan.placementServicingFeeRate;
  return Math.round(getTotalAmount(loan) * placementServicingFeeRate * 100.0) / 100.0;
}


export default Loan;
