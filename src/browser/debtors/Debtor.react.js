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
import { fetchNotes } from '../../common/notes/actions';
import { fetchRepamentPlans } from '../../common/repaymentPlans/actions';
import { fetchContactNumbers } from '../../common/contactNumbers/actions';
import { fetchAddresses } from '../../common/addresses/actions';
import { fetchRelationships } from '../../common/categories/actions';
import fetch from '../../common/components/fetch';
import { injectIntl, intlShape } from 'react-intl';
import debtorsMessages from '../../common/debtors/debtorsMessages';

class Debtor extends Component {

  static propTypes = {
    intl: intlShape.isRequired,
    debtors: PropTypes.object.isRequired,
    repaymentPlans: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  render() {
    const { intl, params, debtors, repaymentPlans } = this.props;
    const debtorId = parseInt(params.id, 10);
    const debtor = debtors.get(debtorId);
    const newRepaymentPlans = repaymentPlans.filter(repaymentPlan =>
      repaymentPlan.debtorId === debtorId
    );
    return (
      <div className="debtor-detail">
        <Helmet title={intl.formatMessage(debtorsMessages.debtorDetail)} />
        <DebtorInfo debtor={debtor} />
        <DebtorLoans debtorId={debtorId} />
        <Repayments
          debtorId={debtorId}
          repaymentPlans={newRepaymentPlans}
        />
        <ContactList debtorId={debtorId} />
      </div>
    );
  }

}

Debtor = fetch(
  fetchDebtor,
  fetchLoans,
  fetchRepamentPlans,
  fetchContactNumbers,
  fetchNotes,
  fetchAddresses,
  fetchRelationships
)(Debtor);

Debtor = injectIntl(Debtor);

export default connect(state => ({
  debtors: state.debtors.map,
  repaymentPlans: state.repaymentPlans.map,
}))(Debtor);
