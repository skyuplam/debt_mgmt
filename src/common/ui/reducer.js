import * as actions from './actions';
import { Record } from 'immutable';
import Repayment from '../repayments/repayment';
import Loan from '../loans/loan';
import Note from '../notes/note';
import {
  LOGIN_SUCCESS,
  LOGIN_ERROR,
} from '../auth/actions';
import {
  ADD_NEW_ADDRESS_SUCCESS,
  ADD_NEW_ADDRESS_ERROR,
} from '../addresses/actions';
import {
  CREATE_AGENCY_SUCCESS,
  CREATE_AGENCY_ERROR,
} from '../agencies/actions';
import {
  NEW_CONTACT_NUMBER_SUCCESS,
  NEW_CONTACT_NUMBER_ERROR,
} from '../contactNumbers/actions';
import {
  SEARCH_DEBTORS_SUCCESS,
  SEARCH_DEBTORS_ERROR,
} from '../debtors/actions';
import {
  POSTPONE_PLACEMENT_RECALL_SUCCESS,
  POSTPONE_PLACEMENT_RECALL_ERROR,
} from '../loans/actions';
import {
  ADD_NEW_NOTE_SUCCESS,
  ADD_NEW_NOTE_ERROR,
} from '../notes/actions';
import {
  CREATE_PORTFOLIO_SUCCESS,
  CREATE_PORTFOLIO_ERROR,
} from '../portfolios/actions';
import {
  NEW_REPAYMENT_PLAN_SUCCESS,
  NEW_REPAYMENT_PLAN_ERROR,
} from '../repaymentPlans/actions';
import {
  PAY_REPAYMENT_SUCCESS,
  PAY_REPAYMENT_ERROR,
} from '../repayments/actions';
import {
  UPLOAD_SUCCESS,
  UPLOAD_ERROR,
} from '../upload/actions';
import {
  NEW_USER_SUCCESS,
  NEW_USER_ERROR,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
} from '../users/actions';
import { notify } from '../eventEmitter/eventEmitter';

const InitialState = Record({
  isSideMenuOpen: false,
  isConfirmDialogOpen: false,
  isNewRepaymentPlan: false,
  currentLoanId: undefined,
  isRepaymentDialogOpen: false,
  currentRepayment: Repayment(),
  currentLoan: Loan(),
  isLoanDetailDialogOpen: false,
  isAddContactNumberDialogOpen: false,
  isAddAddressDialogOpen: false,
  isAddNoteDialogOpen: false,
  isNoteDialogOpen: false,
  selectedNote: Note(),
  isPostponeRecallDialogOpen: false,
  isUserActionPopupOpen: false,
  isUserActionDialogOpen: false,
  userActionType: undefined,
  isAppBarPopupUp: false,
  appBarActionType: undefined,
  isAddAgencyDialogOpen: false,
  isAddPortfolioDialogOpen: false,
  isAddPlacementDialogOpen: false,
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
      return state.update('isConfirmDialogOpen', () => true);
    }

    case actions.CLOSE_CONFIRM_DIALOG: {
      return state.update('isConfirmDialogOpen', () => false);
    }

    case actions.OPEN_NEW_REPAYMENT_PLAN_DIALOG: {
      const loanId = action.payload.loanId;
      state = state.update('currentLoanId', () => loanId);
      return state.update('isNewRepaymentPlan', () => true);
    }

    case actions.CLOSE_NEW_REPAYMENT_PLAN_DIALOG: {
      return state.update('isNewRepaymentPlan', () => false);
    }

    case actions.OPEN_REPAYMENT_DIALOG: {
      state = state.update('currentRepayment', () => new Repayment(action.payload));
      return state.update('isRepaymentDialogOpen', () => true);
    }

    case actions.CLOSE_REPAYMENT_DIALOG: {
      return state.update('isRepaymentDialogOpen', () => false);
    }

    case actions.OPEN_LOAN_DETAIL_DIALOG: {
      state = state.update('currentLoan', () => new Loan(action.payload));
      return state.update('isLoanDetailDialogOpen', () => true);
    }

    case actions.CLOSE_LOAN_DETAIL_DIALOG: {
      return state.update('isLoanDetailDialogOpen', () => false);
    }

    case actions.OPEN_ADD_CONTACTNUMBER_DIALOG: {
      return state.update('isAddContactNumberDialogOpen', () => true);
    }

    case actions.CLOSE_ADD_CONTACTNUMBER_DIALOG: {
      return state.update('isAddContactNumberDialogOpen', () => false);
    }

    case actions.OPEN_ADD_ADDRESS_DIALOG: {
      return state.update('isAddAddressDialogOpen', () => true);
    }

    case actions.CLOSE_ADD_ADDRESS_DIALOG: {
      return state.update('isAddAddressDialogOpen', () => false);
    }

    case actions.OPEN_ADD_NOTE_DIALOG: {
      return state.update('isAddNoteDialogOpen', () => true);
    }

    case actions.CLOSE_ADD_NOTE_DIALOG: {
      return state.update('isAddNoteDialogOpen', () => false);
    }

    case actions.TOGGLE_NOTE_DIALOG: {
      const theState = state.update('isNoteDialogOpen', isNoteDialogOpen => !isNoteDialogOpen);
      if (action.payload) {
        return theState.update('selectedNote', () => new Note(action.payload));
      }
      return theState;
    }

    case actions.TOGGLE_POSTPONE_RECALL_DIALOG: {
      return state.update('isPostponeRecallDialogOpen',
        isPostponeRecallDialogOpen => !isPostponeRecallDialogOpen);
    }

    case actions.TOGGLE_USER_ACTION_POPUP: {
      return state.update('isUserActionPopupOpen',
        isUserActionPopupOpen => !isUserActionPopupOpen);
    }

    case actions.TOGGLE_USER_ACTION_DIALOG: {
      const newState = state.update('isUserActionDialogOpen',
        isUserActionDialogOpen => !isUserActionDialogOpen);
      if (!(action.payload && action.payload.actionType)) {
        return newState.delete('userActionType');
      }
      const actionType = action.payload.actionType;
      return newState.set('userActionType', actionType);
    }

    case actions.TOGGLE_APP_BAR_ACTIONS: {
      const newState = state.update('isAppBarPopupUp',
        isAppBarPopupUp => !isAppBarPopupUp);
      if (!(action.payload && action.payload.actionType)) {
        return newState.delete('appBarActionType');
      }
      const actionType = action.payload.actionType;
      return newState.set('appBarActionType', actionType);
    }

    case actions.TOGGLE_ADD_AGENCY_DIALOG: {
      return state.update('isAddAgencyDialogOpen',
        isAddAgencyDialogOpen => !isAddAgencyDialogOpen);
    }

    case actions.TOGGLE_ADD_PORTFOLIO_DIALOG: {
      return state.update('isAddPortfolioDialogOpen',
        isAddPortfolioDialogOpen => !isAddPortfolioDialogOpen);
    }

    case actions.TOGGLE_ADD_PLACEMENT_DIALOG: {
      return state.update('isAddPlacementDialogOpen',
        isAddPlacementDialogOpen => !isAddPlacementDialogOpen);
    }

    case ADD_NEW_ADDRESS_SUCCESS:
    case NEW_CONTACT_NUMBER_SUCCESS:
    case SEARCH_DEBTORS_SUCCESS:
    case POSTPONE_PLACEMENT_RECALL_SUCCESS:
    case CREATE_AGENCY_SUCCESS:
    case ADD_NEW_NOTE_SUCCESS:
    case CREATE_PORTFOLIO_SUCCESS:
    case NEW_REPAYMENT_PLAN_SUCCESS:
    case PAY_REPAYMENT_SUCCESS:
    case UPLOAD_SUCCESS:
    case NEW_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
    case LOGIN_SUCCESS: {
      notify({
        message: 'congratuation',
      });
      return state;
    }

    case LOGIN_ERROR:
    case ADD_NEW_ADDRESS_ERROR:
    case CREATE_AGENCY_ERROR:
    case NEW_CONTACT_NUMBER_ERROR:
    case SEARCH_DEBTORS_ERROR:
    case POSTPONE_PLACEMENT_RECALL_ERROR:
    case ADD_NEW_NOTE_ERROR:
    case CREATE_PORTFOLIO_ERROR:
    case NEW_REPAYMENT_PLAN_ERROR:
    case PAY_REPAYMENT_ERROR:
    case UPLOAD_ERROR:
    case NEW_USER_ERROR:
    case UPDATE_USER_ERROR: {
      notify({
        message: 'failure',
      });
      return state;
    }
  }

  return state;
}
