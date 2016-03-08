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
  };

  constructor(props) {
    super(props);

    this.onHandlingSubmit = this.onHandlingSubmit.bind(this);
  }

  onHandlingSubmit() {
    const { onConfirmSubmit, closeNewRepyamnetPlanDialog } = this.props;

    onConfirmSubmit();
    closeNewRepyamnetPlanDialog();
  }

  render() {
    const { msg, closeNewRepyamnetPlanDialog, isNewRepaymentPlan } = this.props;
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
              value={10000}
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
  isNewRepaymentPlan: state.ui.isNewRepaymentPlan
}), uiAction)(NewRepaymentPlan);
