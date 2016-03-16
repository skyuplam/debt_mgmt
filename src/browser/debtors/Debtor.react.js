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
import fetch from '../../common/components/fetch';

class Debtor extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    debtors: PropTypes.object.isRequired,
    repaymentPlans: PropTypes.object.isRequired,
  };

  render() {
    const { msg, params, repaymentPlans } = this.props;
    const debtorId = params.id;
    const newRepaymentPlans = repaymentPlans.filter(repaymentPlan => {
      return repaymentPlan.debtorId == debtorId;
    });
    return (
      <div className="debtor-detail">
        <Helmet title={msg.debtorDetail} />
        <DebtorInfo debtorId={debtorId}/>
        <ContactList />
        <DebtorLoans debtorId={debtorId}/>
        <Repayments
          debtorId={debtorId}
          repaymentPlans={newRepaymentPlans}
        />
      </div>
    );
  }

}

Debtor = fetch(fetchDebtor, fetchLoans, fetchRepamentPlans)(Debtor);

export default connect(state => ({
  msg: state.intl.msg.debtors,
  debtors: state.debtors.map,
  repaymentPlans: state.repaymentPlans.map,
}))(Debtor);
