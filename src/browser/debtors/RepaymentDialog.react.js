import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { closeRepaymentDialog } from '../../common/ui/actions';
import DatePicker from 'material-ui/DatePicker';
import { payRepayment } from '../../common/repayments/actions';
import Checkbox from 'material-ui/Checkbox';
import { injectIntl, intlShape } from 'react-intl';
import repaymentsMessages from '../../common/repayments/repaymentsMessages';


class RepaymentDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    repayment: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    debtorId: PropTypes.number.isRequired,
    isRepaymentDialogOpen: PropTypes.bool.isRequired,
    closeRepaymentDialog: PropTypes.func.isRequired,
    setField: PropTypes.func.isRequired,
    payRepayment: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.isInvalidAmount = this.isInvalidAmount.bind(this);
    this.handleRepayRequest = this.handleRepayRequest.bind(this);
    this.handleChangeOfRepaidAt = this.handleChangeOfRepaidAt.bind(this);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleCloseOfDialog = this.handleCloseOfDialog.bind(this);
    this.getValueOfAmount = this.getValueOfAmount.bind(this);
    this.onCheckPaidInFull = this.onCheckPaidInFull.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }
  shouldComponentUpdate = shouldPureComponentUpdate;

  onCheckPaidInFull(e) {
    const { setField } = this.props;
    setField(['repaymentDialog', 'paidInFull'], e.target.checked);
  }

  getValueOfRepaidAt() {
    const { fields } = this.props;

    return fields.repaidAt.value ? fields.repaidAt.value : new Date();
  }

  getValueOfAmount() {
    const { repayment, fields } = this.props;

    return fields.repaymentAmount.value ? fields.repaymentAmount.value : repayment.principal;
  }

  isInvalidAmount() {
    const input = this.getValueOfAmount();
    if (input && input > 0) {
      return false;
    }
    return true;
  }

  handleRepayRequest() {
    const { closeRepaymentDialog, repayment, debtorId, fields, payRepayment, viewer } = this.props;

    let paidInFull;
    if (fields.paidInFull.value === null) {
      if (repayment.terms === repayment.term) {
        paidInFull = true;
      } else {
        paidInFull = false;
      }
    } else {
      paidInFull = fields.paidInFull.value;
    }

    payRepayment({
      repaymentPlanId: repayment.repaymentPlanId,
      debtorId,
      repaymentId: repayment.id,
      amount: this.getValueOfAmount(),
      repaidAt: this.getValueOfRepaidAt(),
      paidInFull
    }, viewer);

    closeRepaymentDialog();
    fields.$reset();
  }

  handleChangeAmount(e) {
    const { setField } = this.props;
    const value = e.target.valueAsNumber;
    setField(['repaymentDialog', 'repaymentAmount'], value);
    return value;
  }

  handleChangeOfRepaidAt(e, date) {
    const { setField } = this.props;
    setField(['repaymentDialog', 'repaidAt'], date);
    return date;
  }

  handleCloseOfDialog() {
    const { closeRepaymentDialog, fields } = this.props;

    closeRepaymentDialog();
    fields.$reset();
  }

  formatDate(date) {
    const { intl } = this.props;
    const theDate = date ? new Date(date) : null;
    return intl.formatDate(theDate);
  }

  render() {
    const {
      intl,
      isRepaymentDialogOpen,
      repayment,
    } = this.props;

    const actions = [
      <FlatButton
        label={intl.formatMessage(repaymentsMessages.cancel)}
        secondary
        onTouchTap={this.handleCloseOfDialog}
      />,
      <FlatButton
        label={intl.formatMessage(repaymentsMessages.confirm)}
        primary
        onTouchTap={this.handleRepayRequest}
        disabled={this.isInvalidAmount()}
      />,
    ];

    return (
      <Dialog
        title={intl.formatMessage(repaymentsMessages.title)}
        actions={actions}
        modal
        open={isRepaymentDialogOpen}
      >
        <TextField
          hintText={repayment.term}
          floatingLabelText={intl.formatMessage(repaymentsMessages.term)}
          type="number"
          value={repayment.term}
          disabled
        /><br />
        <TextField
          hintText={repayment.principal}
          floatingLabelText={intl.formatMessage(repaymentsMessages.repayAmount)}
          type="number"
          defaultValue={repayment.principal}
          onChange={this.handleChangeAmount}
        /><br />
        <TextField
          floatingLabelText={intl.formatMessage(repaymentsMessages.expectedRepayAt)}
          value={this.formatDate(repayment.expectedRepaidAt)}
          disabled
        />
        <DatePicker
          hintText={intl.formatMessage(repaymentsMessages.repaidAt)}
          floatingLabelText={intl.formatMessage(repaymentsMessages.repaidAt)}
          locale="zh"
          DateTimeFormat={global.Intl.DateTimeFormat}
          onChange={this.handleChangeOfRepaidAt}
          cancelLabel={intl.formatMessage(repaymentsMessages.cancel)}
          okLabel={intl.formatMessage(repaymentsMessages.confirm)}
        />
      <Checkbox
        label={intl.formatMessage(repaymentsMessages.paidInFull)}
        defaultChecked={repayment.terms === repayment.term}
        onCheck={this.onCheckPaidInFull}
      />
      </Dialog>
    );
  }
}

RepaymentDialog = fields(RepaymentDialog, {
  path: 'repaymentDialog',
  fields: [
    'repaymentAmount',
    'repaidAt',
    'paidInFull'
  ],
});

RepaymentDialog = injectIntl(RepaymentDialog);

export default connect(state => ({
  isRepaymentDialogOpen: state.ui.isRepaymentDialogOpen,
  repayment: state.ui.currentRepayment,
  viewer: state.users.viewer,
}), {
  closeRepaymentDialog,
  setField,
  payRepayment,
})(RepaymentDialog);
