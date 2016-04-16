import { setCurrentLocale } from '../intl/actions';

export const UPDATE_APP_STATE_FROM_STORAGE = 'UPDATE_APP_STATE_FROM_STORAGE';

export const LINKS = {
  home: '/',
  debtors: 'debtors',
  login: 'login',
  users: 'users',
  boarding: 'boarding',
};

export function updateAppStateFromStorage() {
  return ({ dispatch, engine }) => {
    engine.load().then(state => {
      if (state.intl && state.intl.currentLocale) {
        dispatch(setCurrentLocale(state.intl.currentLocale));
      } else if (process.env.IS_SERVERLESS) {
        // TODO: Add a reliable client side only locale detection with failback
        // to config defaultLocale.
        dispatch(setCurrentLocale('zh'));
      }
    });
    return {
      type: UPDATE_APP_STATE_FROM_STORAGE
    };
  };
}
