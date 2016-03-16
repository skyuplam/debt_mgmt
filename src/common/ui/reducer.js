import * as actions from './actions';
import { Record } from 'immutable';
import Repayment from '../repayments/repayment';
import Loan from '../loans/loan';

const InitialState = Record({
  isSideMenuOpen: false,
  isConfirmDialogOpen: false,
  isNewRepaymentPlan: false,
  currentLoanId: null,
  isRepaymentDialogOpen: false,
  currentRepayment: Repayment(),
  currentLoan: Loan(),
  isLoanDetailDialogOpen: false,
});
const initialState = new InitialState;

export default function uiReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState;

  switch (action.type) {

    case actions.ON_SIDE_MENU_CHANGE: {
      const { isOpen } = action.payload;
      return state.set('isSideMenuOpen', isOpen);
    }

    case actions.TOGGLE_SIDE_MENU:
      return state.update('isSideMenuOpen', isSideMenuOpen => !isSideMenuOpen);

    case actions.OPEN_CONFIRM_DIALOG: {
      return state.update('isConfirmDialogOpen', isConfirmDialogOpen => true);
    }

    case actions.CLOSE_CONFIRM_DIALOG: {
      return state.update('isConfirmDialogOpen', isConfirmDialogOpen => false);
    }

    case actions.OPEN_NEW_REPAYMENT_PLAN_DIALOG: {
      const loanId = action.payload.loanId;
      state = state.update('currentLoanId', currentLoanId => loanId);
      return state.update('isNewRepaymentPlan', isNewRepaymentPlan => true);
    }

    case actions.CLOSE_NEW_REPAYMENT_PLAN_DIALOG: {
      return state.update('isNewRepaymentPlan', isNewRepaymentPlan => false);
    }

    case actions.OPEN_REPAYMENT_DIALOG: {
      state = state.update('currentRepayment', currentRepayment => new Repayment(action.payload));
      return state.update('isRepaymentDialogOpen', isRepaymentDialogOpen => true);
    }

    case actions.CLOSE_REPAYMENT_DIALOG: {
      return state.update('isRepaymentDialogOpen', isRepaymentDialogOpen => false);
    }

    case actions.OPEN_LOAN_DETAIL_DIALOG: {
      state = state.update('currentLoan', currentRepayment => new Loan(action.payload));
      return state.update('isLoanDetailDialogOpen', isLoanDetailDialogOpen => true);
    }

    case actions.CLOSE_LOAN_DETAIL_DIALOG: {
      return state.update('isLoanDetailDialogOpen', isLoanDetailDialogOpen => false);
    }

  }

  return state;
}
