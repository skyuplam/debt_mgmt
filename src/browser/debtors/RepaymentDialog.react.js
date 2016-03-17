import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { closeRepaymentDialog } from '../../common/ui/actions';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import { toFloat, isNumeric } from 'validator';
import { payRepayment } from '../../common/repayments/actions';
import { dateFormat } from '../../common/intl/format';
import Checkbox from 'material-ui/lib/checkbox';

class RepaymentDialog extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static propTypes = {
    msg: PropTypes.object.isRequired,
    repayment: PropTypes.object.isRequired,
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
  }

  isInvalidAmount() {
    const input = this.getValueOfAmount();
    if (input && input > 0) {
      return false;
    }
    return true;
  }

  getValueOfAmount() {
    const { repayment, fields } = this.props;

    return fields.repaymentAmount.value?fields.repaymentAmount.value:repayment.principal;
  }

  getValueOfRepaidAt() {
    const { repayment, fields } = this.props;

    return fields.repaidAt.value?fields.repaidAt.value:new Date();
  }

  onCheckPaidInFull(e) {
    const { setField, fields } = this.props;
    setField(['repaymentDialog', 'paidInFull'], e.target.checked);
  }

  handleRepayRequest() {
    const { closeRepaymentDialog, repayment, debtorId, fields, payRepayment } = this.props;

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
      debtorId: debtorId,
      repaymentId: repayment.id,
      amount: this.getValueOfAmount(),
      repaidAt: this.getValueOfRepaidAt(),
      paidInFull: paidInFull
    });

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

  render() {
    const {
      msg,
      isRepaymentDialogOpen,
      repayment,
      fields,
    } = this.props;

    const actions = [
      <FlatButton
        label={msg.cancel}
        secondary={true}
        onTouchTap={this.handleCloseOfDialog}
      />,
      <FlatButton
        label={msg.confirm}
        primary={true}
        onTouchTap={this.handleRepayRequest}
        disabled={this.isInvalidAmount()}
      />,
    ];

    return (
      <Dialog
        title={msg.title}
        actions={actions}
        modal={true}
        open={isRepaymentDialogOpen}
      >
        <TextField
          hintText={repayment.term}
          floatingLabelText={msg.term}
          type='number'
          value={repayment.term}
          disabled
        /><br />
        <TextField
          hintText={repayment.principal}
          floatingLabelText={msg.repayAmount}
          type='number'
          defaultValue={repayment.principal}
          onChange={this.handleChangeAmount}
        /><br />
        <TextField
          floatingLabelText={msg.expectedRepayAt}
          value={repayment.expectedRepaidAt?dateFormat(new Date(repayment.expectedRepaidAt), ['zh']):''}
          disabled
        />
        <DatePicker
          hintText={msg.repaidAt}
          floatingLabelText={msg.repaidAt}
          locale='zh'
          defaultDate={fields.repaidAt.value?new Date(fields.repaidAt.value):new Date()}
          DateTimeFormat={global.Intl.DateTimeFormat}
          onChange={this.handleChangeOfRepaidAt}
          wordings={{
            ok: msg.confirm,
            cancel: msg.cancel
          }}
        />
      <Checkbox
        label={msg.paidInFull}
        defaultChecked={repayment.terms===repayment.term}
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

export default connect(state => ({
  msg: state.intl.msg.repaymentDialog,
  isRepaymentDialogOpen: state.ui.isRepaymentDialogOpen,
  repayment: state.ui.currentRepayment,
}), {
  closeRepaymentDialog,
  setField,
  payRepayment,
})(RepaymentDialog);
