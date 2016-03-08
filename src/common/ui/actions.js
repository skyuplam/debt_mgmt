export const ON_SIDE_MENU_CHANGE = 'ON_SIDE_MENU_CHANGE';
export const TOGGLE_SIDE_MENU = 'TOGGLE_SIDE_MENU';
export const OPEN_CONFIRM_DIALOG = 'OPEN_CONFIRM_DIALOG';
export const CLOSE_CONFIRM_DIALOG = 'CLOSE_CONFIRM_DIALOG';
export const OPEN_NEW_REPAYMENT_PLAN_DIALOG = 'OPEN_NEW_REPAYMENT_PLAN_DIALOG';
export const CLOSE_NEW_REPAYMENT_PLAN_DIALOG = 'CLOSE_NEW_REPAYMENT_PLAN_DIALOG';

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
