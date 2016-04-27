import { Record } from 'immutable';
import moment from 'moment';

const Loan = Record({
  id: undefined,
  appliedAt: undefined,
  issuedAt: undefined,
  terms: 0,
  delinquentAt: undefined,
  amount: 0,
  apr: 0,
  transferredAt: undefined,
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
  completedAt: undefined,
  originator: undefined,
  originatedAgreementNo: undefined,
  originatedLoanProcessingBranch: undefined,
  loanStatus: undefined,
  loanStatusId: undefined,
  loanPlacementId: undefined,
  loanPlacements: undefined,
  placementStatusId: undefined,
  placementCode: '',
  placementServicingFeeRate: 0.0,
  packageReference: undefined,
  placedAt: undefined,
  portfolio: undefined,
  expectedRecalledAt: undefined,
  recalledAt: undefined,
  agency: '',
  cutoffAt: undefined,
  lastRepaidAmount: undefined,
  lastRepaidAt: undefined,
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

export function getAgencyName(loan) {
  if (!loan.loanPlacements || loan.loanPlacements.length < 1) {
    return '';
  }
  const loanPlacements = loan.loanPlacements.filter(lp => lp.placementStatusId === 1);
  if (!loanPlacements || loanPlacements.length < 1) {
    return '';
  }
  return loanPlacements[0].placement.company.name;
}

export function getServicingFeeRate(loan) {
  if (!loan.loanPlacements || loan.loanPlacements.length < 1) {
    return 0;
  }
  const loanPlacements = loan.loanPlacements.filter(lp => lp.placementStatusId === 1);
  if (!loanPlacements || loanPlacements.length < 1) {
    return 0;
  }
  return loanPlacements[0].placement.servicingFeeRate;
}

export function getOriginator(loan) {
  return loan.portfolio.company.name;
}

export function getServicingFee(loan) {
  const placementServicingFeeRate = getServicingFeeRate(loan);
  return Math.round(getTotalAmount(loan) * placementServicingFeeRate * 100.0) / 100.0;
}


export default Loan;
