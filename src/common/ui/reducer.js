import * as actions from './actions';
import { Record } from 'immutable';

const InitialState = Record({
  isSideMenuOpen: false,
  isConfirmDialogOpen: false,
  isNewRepaymentPlan: false,
  currentLoanId: null,
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
  }

  return state;
}
