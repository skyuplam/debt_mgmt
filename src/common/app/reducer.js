import { combineReducers } from 'redux';
import { reduxFields } from '../lib/redux-fields';
import { routerReducer as routing } from 'react-router-redux';

import auth from '../auth/reducer';
import config from '../config/reducer';
import device from '../device/reducer';
import intl from '../intl/reducer';
import ui from '../ui/reducer';
import users from '../users/reducer';
import debtors from '../debtors/reducer';
import loans from '../loans/reducer';
import repaymentPlans from '../repaymentPlans/reducer';
import repayments from '../repayments/reducer';
import contactNumbers from '../contactNumbers/reducer';
import addresses from '../addresses/reducer';
import notes from '../notes/reducer';
import categories from '../categories/reducer';
// redux-recycle higher-order reducer
import recycleState from 'redux-recycle';

export default combineReducers({
  auth,
  config,
  device,
  intl,
  reduxFields,
  routing,
  debtors,
  loans,
  repaymentPlans,
  repayments,
  contactNumbers,
  addresses,
  notes,
  categories,
  ui,
  users: recycleState(users, ['LOGOUT']),
});
