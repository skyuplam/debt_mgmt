import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DebtorInfo from './DebtorInfo.react';
import DebtorLoans from './DebtorLoans.react';
import Repayments from './Repayments.react';
import { fetchDebtor } from '../../common/debtors/actions';
import { fetchLoans } from '../../common/loans/actions';
import fetch from '../../common/components/fetch';

class Debtor extends Component {

  static propTypes = {
    msg: PropTypes.object,
    debtors: PropTypes.object.isRequired
  };

  render() {
    const { msg, params } = this.props;
    const debtorId = params.id;
    return (
      <div className="debtor-detail">
        <Helmet title={msg.debtorDetail} />
        <DebtorInfo debtorId={debtorId}/>
        <DebtorLoans />
        <Repayments />
      </div>
    );
  }

}

Debtor = fetch(fetchDebtor, fetchLoans)(Debtor);

export default connect(state => ({
  msg: state.intl.msg.debtors,
  debtors: state.debtors.map
}))(Debtor);
