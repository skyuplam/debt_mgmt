import { Range } from 'immutable';
import moment from 'moment';
export const FETCH_REPAYMENT_PLANS_START = 'FETCH_REPAYMENT_PLANS_START';
export const FETCH_REPAYMENT_PLANS_FAILURE = 'FETCH_REPAYMENT_PLANS_FAILURE';
export const FETCH_REPAYMENT_PLANS_SUCCESS = 'FETCH_REPAYMENT_PLANS_SUCCESS';
export const NEW_REPAYMENT_PLAN_START = 'NEW_REPAYMENT_PLAN_START';
export const NEW_REPAYMENT_PLAN_FAILURE = 'NEW_REPAYMENT_PLAN_FAILURE';
export const NEW_REPAYMENT_PLAN_SUCCESS = 'NEW_REPAYMENT_PLAN_SUCCESS';
export const ADD_REPAYMENTS = 'ADD_REPAYMENTS';
export const UPDATE_REPAYMENT = 'UPDATE_REPAYMENT';
export const RESET_REPAYMENTS = 'RESET_REPAYMENTS';

import { translateHttpError } from '../lib/error/error';


const API_VERSION = '/api/v1';

export function newRepaymentPlan(repaymentPlan, debtorId, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(`${API_VERSION}/debtors/${debtorId}/repaymentPlans`, {
          method: 'post',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization
          },
          body: JSON.stringify(repaymentPlan)
        });
        if (response.status !== 201) throw response;
        return response.json();
      } catch (error) {
        throw translateHttpError(error, { action: 'newRepaymentPlan' });
      }
    }
    return {
      type: 'NEW_REPAYMENT_PLAN',
      payload: {
        promise: getPromise()
      }
    };
  };
}


export function fetchRepamentPlans(locParams, debtorId, user = {}) {
  const Authorization = `Bearer ${user.token}`;
  return ({ fetch }) => {
    async function getPromise() {
      try {
        const response = await fetch(
          `${API_VERSION}/debtors/${locParams.params.id}/repaymentPlans`,
          {
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
        throw translateHttpError(error, { action: 'newRepaymentPlan' });
      }
    }
    return {
      type: 'FETCH_REPAYMENT_PLANS',
      payload: {
        promise: getPromise()
      }
    };
  };
}


export function addRepayments(repaymentPlan) {
  const terms = parseInt(repaymentPlan.terms, 10);
  const amount = parseFloat(repaymentPlan.amount);
  const repayDate = repaymentPlan.repayDate;

  const payload = Range(0, terms).map(term => {
    if (terms === 1) {
      return {
        principal: amount,
        term: term + 1,
        expectedRepaidAt: repayDate ? new Date(repayDate) : new Date(),
      };
    }

    const unitAmt = Math.round(amount / terms / 100) * 100;
    const repayAt = moment(repayDate).isValid() ? moment(repayDate) : moment();
    // repayAt.setMonth(repayAt.getMonth() + term);
    repayAt.add(term, 'months');
    const repayment = {
      principal: term === terms - 1 ? amount - unitAmt * term : unitAmt,
      term: term + 1,
      expectedRepaidAt: repayAt,
    };
    return repayment;
  }).toJS();

  return {
    type: ADD_REPAYMENTS,
    payload,
  };
}

export function resetRepyments() {
  return {
    type: RESET_REPAYMENTS
  };
}

export function updateRepayment(repayment) {
  return {
    type: UPDATE_REPAYMENT,
    payload: repayment,
  };
}
