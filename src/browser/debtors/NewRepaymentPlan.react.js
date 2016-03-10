// import './NewRepaymentPlan.scss';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { closeNewRepyamnetPlanDialog, onConfirmSubmit } from '../../common/ui/actions';
import { fields } from '../../common/lib/redux-fields';
import { FormattedNumber, FormattedDate, IntlMixin } from 'react-intl';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import { setField } from '../../common/lib/redux-fields/actions';
import { newRepaymentPlan, addRepayments, resetRepyments } from '../../common/repaymentPlans/actions';
import RepaymentList from './RepaymentList.react';
import { toFloat } from 'validator';

const customContentStyle = {
  width: '600px',
  height: '600px',
  'maxHeight': '600px',
  'maxWidth': '600px',
}

class NewRepaymentPlan extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;
  mixins = [IntlMixin];

  static propTypes = {
    msg: PropTypes.object.isRequired,
    closeNewRepyamnetPlanDialog: PropTypes.func.isRequired,
    isNewRepaymentPlan: PropTypes.bool.isRequired,
    onConfirmSubmit: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    loans: PropTypes.object.isRequired,
    repayments: PropTypes.object.isRequired,
    currentLoanId: PropTypes.number,
    setField: PropTypes.func.isRequired,
    newRepaymentPlan: PropTypes.func.isRequired,
    addRepayments: PropTypes.func.isRequired,
    resetRepyments: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onHandlingSubmit = this.onHandlingSubmit.bind(this);
    this._handleOnChange = this._handleOnChange.bind(this);
    this._handleGenerate = this._handleGenerate.bind(this);
    this._isInValidAmt = this._isInValidAmt.bind(this);
    this._totalAmt = this._totalAmt.bind(this);
  }

  onHandlingSubmit() {
    const {
      onConfirmSubmit,
      closeNewRepyamnetPlanDialog,
      loans,
      currentLoanId,
      fields,
      newRepaymentPlan,
      repayments,
      resetRepyments
    } = this.props;

    if (!(fields.amount.value.trim() ||
        fields.terms.value.trim() ||
        fields.repayDate.value ||
        currentLoanId ||
        loans ||
        loans.get(currentLoanId)
      )) return;

    const currentLoan = loans.get(currentLoanId);

    newRepaymentPlan({
      loanId: currentLoanId,
      repayAmount: fields.amount.value,
      terms: fields.terms.value,
      startedAt: fields.repayDate.value?fields.repayDate.value:new Date(),
      repayments: repayments.toArray()
    });

    onConfirmSubmit();
    closeNewRepyamnetPlanDialog();
    fields.$reset();
    resetRepyments();
  }

  _handleOnChange(e, date) {
    const { setField } = this.props;
    setField(['newRepaymentPlan', 'repayDate'], date);
    return date;
  }

  _handleGenerate() {
    const { addRepayments, fields } = this.props;
    if (!parseFloat(fields.amount.value.trim())) return;
    addRepayments({
      terms: fields.terms.value,
      amount: fields.amount.value,
      repayDate: fields.repayDate.value
    });
  }

  _totalAmt() {
    const { loans, currentLoanId } = this.props;
    const currentLoan = loans.get(currentLoanId);
    const totalAmt = currentLoan?
      currentLoan.collectablePrincipal
      +currentLoan.collectableInterest
      +currentLoan.collectableMgmtFee
      +currentLoan.collectableHandlingFee
      +currentLoan.collectableLateFee
      +currentLoan.collectablePenaltyFee:0;
    return totalAmt;
  }

  _isInValidAmt() {
    const { fields } = this.props;
    const totalAmt = this._totalAmt();
    const amt = toFloat(fields.amount.value);
    if (amt < 0 || amt > totalAmt) {
      return true;
    }
    return false;
  }

  _isInvalidRepaymentsAmt() {
    const { repayments, fields } = this.props;
    if (!repayments || !repayments.size) return true;
    const totalAmt = toFloat(fields.amount.value);
    let repaymentAmt = 0;
    repayments.map(repayment => repaymentAmt+=repayment.principal);
    if (repaymentAmt < 0 || repaymentAmt !== totalAmt) {
      return true;
    }
    return false;
  }

  render() {
    const { msg, closeNewRepyamnetPlanDialog, isNewRepaymentPlan, loans, currentLoanId, fields } = this.props;
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
        disabled={this._isInvalidRepaymentsAmt()}
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
              value={this._totalAmt()}
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
          {...fields.terms}
        />
        <DatePicker
          hintText={msg.repayDate}
          floatingLabelText={msg.repayDate}
          locale='zh'
          defaultDate={fields.repayDate.value?fields.repayDate.value:new Date()}
          DateTimeFormat={global.Intl.DateTimeFormat}
          onChange={this._handleOnChange}
          wordings={{
            ok: msg.ok,
            cancel: msg.cancel
          }}
        />
      <div style={{textAlign: 'right'}}>
          <FlatButton
            label={msg.generateRepayments}
            secondary={true}
            keyboardFocused={true}
            onTouchTap={this._handleGenerate}
            fullWidth={true}
            disabled={this._isInValidAmt()}
          />
        </div>
        <RepaymentList />
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
  repayments: state.repaymentPlans.newRepaymentPlan.repayments,
  currentLoanId: state.ui.currentLoanId,
  isNewRepaymentPlan: state.ui.isNewRepaymentPlan,
}), {
  closeNewRepyamnetPlanDialog,
  setField,
  newRepaymentPlan,
  addRepayments,
  resetRepyments
})(NewRepaymentPlan);
