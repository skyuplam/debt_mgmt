// import './NewRepaymentPlan.scss';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as uiAction from '../../common/ui/actions';
import { fields } from '../../common/lib/redux-fields';
import { FormattedNumber, FormattedDate, IntlMixin } from 'react-intl';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
// import { newRepaymentPlan } from '../../common/repaymentPlans/actions';


const customContentStyle = {
  width: '500px',
  height: '300px',
  'maxHeight': '300px',
}

class NewRepaymentPlan extends Component {
  shouldPureComponentUpdate = shouldPureComponentUpdate;
  mixins = [IntlMixin];

  static propTypes = {
    msg: PropTypes.object.isRequired,
    closeNewRepyamnetPlanDialog: PropTypes.func.isRequired,
    isNewRepaymentPlan: PropTypes.bool.isRequired,
    onConfirmSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    loans: PropTypes.object.isRequired,
    currentLoanId: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);

    this.onHandlingSubmit = this.onHandlingSubmit.bind(this);
  }

  onHandlingSubmit() {
    const {
      onConfirmSubmit,
      closeNewRepyamnetPlanDialog,
      loans,
      currentLoanID,
      fields
    } = this.props;

    if (!(fields.amount.value.trim() ||
        fields.terms.value.trim() ||
        fields.repayDate.value.trim()
      )) return;

    const currentLoan = loans.get(currentLoanId);

    // newRepaymentPlan({
    //   loanId: currentLoanId,
    //   amount: fields.amount.value,
    //   terms: fields.terms.value,
    //   repayDate: fields.repayDate.value
    // });

    onConfirmSubmit();
    closeNewRepyamnetPlanDialog();
  }

  render() {
    const { msg, closeNewRepyamnetPlanDialog, isNewRepaymentPlan, loans, currentLoanId } = this.props;
    const currentLoan = loans.get(currentLoanId);

    const actions = [
      <FlatButton
        label={msg.cancel}
        secondary={true}
        onTouchTap={closeNewRepyamnetPlanDialog}
      />,
      <FlatButton
        label={msg.submit}
        primary={true}
        onTouchTap={this.onHandlingSubmit}
      />,
    ];

    return (
      <Dialog
        title={msg.newRepaymentPlanTitle}
        actions={actions}
        modal={true}
        contentStyle={customContentStyle}
        open={isNewRepaymentPlan}
      >
        <TextField
          hintText={(
            <FormattedNumber
              value={currentLoan?
                currentLoan.collectablePrincipal
                +currentLoan.collectableInterest
                +currentLoan.collectableMgmtFee
                +currentLoan.collectableHandlingFee
                +currentLoan.collectableLateFee
                +currentLoan.collectablePenaltyFee:0
              }
              style='currency'
              currency='CNY'
            />
          )}
          type='number'
          floatingLabelText={msg.amount}
          {...fields.amount}
        />
        <TextField
          hintText={(
            <FormattedNumber
              value={12}
            />
          )}
          type='number'
          floatingLabelText={msg.terms}
          {...fields.amount}
        />
        <DatePicker
          hintText={msg.repayDate}
          floatingLabelText={msg.repayDate}
          locale='zh'
          DateTimeFormat={global.Intl.DateTimeFormat}
          wordings={{
            ok: msg.ok,
            cancel: msg.cancel
          }}
          {...fields.repayDate}
        />
      </Dialog>
    );
  }

}

NewRepaymentPlan = fields(NewRepaymentPlan, {
  path: 'newRepaymentPlan',
  fields: [
    'amount',
    'repayDate',
    'terms',
  ]
});

export default connect(state => ({
  msg: state.intl.msg.newRepaymentPlanDialog,
  loans: state.loans.map,
  currentLoanId: state.ui.currentLoanId,
  isNewRepaymentPlan: state.ui.isNewRepaymentPlan,
}), uiAction)(NewRepaymentPlan);
