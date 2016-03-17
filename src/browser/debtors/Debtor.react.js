import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DebtorInfo from './DebtorInfo.react';
import DebtorLoans from './DebtorLoans.react';
import Repayments from './Repayments.react';
import ContactList from './ContactList.react';
import { fetchDebtor } from '../../common/debtors/actions';
import { fetchLoans } from '../../common/loans/actions';
import { fetchRepamentPlans } from '../../common/repaymentPlans/actions';
import { fetchContactNumbers } from '../../common/contactNumbers/actions';
import fetch from '../../common/components/fetch';

class Debtor extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    debtors: PropTypes.object.isRequired,
    repaymentPlans: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  render() {
    const { msg, params, debtors, repaymentPlans } = this.props;
    const debtorId = parseInt(params.id, 10);
    const debtor = debtors.get(debtorId);
    const newRepaymentPlans = repaymentPlans.filter(repaymentPlan =>
      repaymentPlan.debtorId === debtorId
    );
    return (
      <div className="debtor-detail">
        <Helmet title={msg.debtorDetail} />
        <DebtorInfo debtor={debtor} />
        <DebtorLoans debtorId={debtorId} />
        <Repayments
          debtorId={debtorId}
          repaymentPlans={newRepaymentPlans}
        />
      <ContactList />
      </div>
    );
  }

}

Debtor = fetch(
  fetchDebtor,
  fetchLoans,
  fetchRepamentPlans,
  fetchContactNumbers,
)(Debtor);

export default connect(state => ({
  msg: state.intl.msg.debtors,
  debtors: state.debtors.map,
  repaymentPlans: state.repaymentPlans.map,
}))(Debtor);
