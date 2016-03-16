export const ON_SIDE_MENU_CHANGE = 'ON_SIDE_MENU_CHANGE';
export const TOGGLE_SIDE_MENU = 'TOGGLE_SIDE_MENU';
export const OPEN_CONFIRM_DIALOG = 'OPEN_CONFIRM_DIALOG';
export const CLOSE_CONFIRM_DIALOG = 'CLOSE_CONFIRM_DIALOG';
export const OPEN_NEW_REPAYMENT_PLAN_DIALOG = 'OPEN_NEW_REPAYMENT_PLAN_DIALOG';
export const CLOSE_NEW_REPAYMENT_PLAN_DIALOG = 'CLOSE_NEW_REPAYMENT_PLAN_DIALOG';
export const OPEN_REPAYMENT_DIALOG = 'OPEN_REPAYMENT_DIALOG';
export const CLOSE_REPAYMENT_DIALOG = 'CLOSE_REPAYMENT_DIALOG';
export const OPEN_LOAN_DETAIL_DIALOG = 'OPEN_LOAN_DETAIL_DIALOG';
export const CLOSE_LOAN_DETAIL_DIALOG = 'CLOSE_LOAN_DETAIL_DIALOG';

export function onSideMenuChange(isOpen) {
  return {
    type: ON_SIDE_MENU_CHANGE,
    payload: { isOpen }
  };
}

export function toggleSideMenu() {
  return {
    type: TOGGLE_SIDE_MENU
  };
}

export function openConfirmDialog() {
  return {
    type: OPEN_CONFIRM_DIALOG
  };
}

export function closeConfirmDialog() {
  return {
    type: CLOSE_CONFIRM_DIALOG
  };
}

export function openNewRepyamnetPlanDialog(loanId) {
  return {
    type: OPEN_NEW_REPAYMENT_PLAN_DIALOG,
    payload: loanId
  };
}

export function closeNewRepyamnetPlanDialog() {
  return {
    type: CLOSE_NEW_REPAYMENT_PLAN_DIALOG
  };
}

export function openRepaymentDialog(repayment) {
  return {
    type: OPEN_REPAYMENT_DIALOG,
    payload: repayment
  };
}

export function closeRepaymentDialog() {
  return {
    type: CLOSE_REPAYMENT_DIALOG,
  };
}

export function openLoanDetailDialog(loan) {
  return {
    type: OPEN_LOAN_DETAIL_DIALOG,
    payload: loan
  };
}

export function closeLoanDetailDialog() {
  return {
    type: CLOSE_LOAN_DETAIL_DIALOG,
  };
}
