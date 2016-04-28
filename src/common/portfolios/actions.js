// Note prefix ON_.
// This convention means action is dispatched by server, not by viewer.
import { translateHttpError } from '../lib/error/error';

const API_VERSION = '/api/v1';

export const FETCH_PORTFOLIOS_START = 'FETCH_PORTFOLIOS_START';
export const FETCH_PORTFOLIOS_SUCCESS = 'FETCH_PORTFOLIOS_SUCCESS';
export const FETCH_PORTFOLIOS_ERROR = 'FETCH_PORTFOLIOS_ERROR';
export const CREATE_PORTFOLIO_START = 'CREATE_PORTFOLIO_START';
export const CREATE_PORTFOLIO_ERROR = 'CREATE_PORTFOLIO_ERROR';
export const CREATE_PORTFOLIO_SUCCESS = 'CREATE_PORTFOLIO_SUCCESS';


export function fetchPortfolios(locParams, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/portfolios`, {
          method: 'get',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          }
        });
        if (response.status !== 200) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'fetchPortfolios' });
      }
    }
    return {
      type: 'FETCH_PORTFOLIOS',
      payload: {
        promise: getPromise()
      }
    };
  };
}

export function createPortfolio(portfolio, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        // eslint-disable-next-line no-alert, max-len
        const response = await fetch(`${API_VERSION}/portfolios`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          },
          body: JSON.stringify(portfolio)
        });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'createPortfolio' });
      }
    }
    return {
      type: 'CREATE_PORTFOLIO',
      payload: {
        promise: getPromise()
      }
    };
  };
}
