import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import agencyMessages from '../../common/agencies/agencyMessages';
import Dialog from 'material-ui/Dialog';
import { toggleAddAgencyDialog } from '../../common/ui/actions';
import TextField from 'material-ui/TextField';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { createAgency } from '../../common/agencies/actions';
import FlatButton from 'material-ui/FlatButton';


class AddAgencyDialog extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    fields: PropTypes.object.isRequired,
    isAddAgencyDialogOpen: PropTypes.bool.isRequired,
    toggleAddAgencyDialog: PropTypes.func.isRequired,
    createAgency: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();
    this.renderDialogContent = this.renderDialogContent.bind(this);
    this.validateFormInput = this.validateFormInput.bind(this);
    this.dismissDialog = this.dismissDialog.bind(this);
  }

  dismissDialog() {
    const { toggleAddAgencyDialog, fields } = this.props;

    fields.$reset();
    toggleAddAgencyDialog();
  }

  validateFormInput() {
    const { fields } = this.props;
    if (fields.name.value.trim() &&
      fields.code.value.trim() &&
      fields.servicingFeeRate.value > 0
    ) {
      return true;
    }
    return false;
  }

  handleSubmitUserAction() {
    const { createAgency, fields, viewer } = this.props;
    createAgency({ agency: fields.$values() }, viewer);
    this.dismissDialog();
  }

  renderDialogContent() {
    const { intl, fields } = this.props;
    return (
      <div>
        <TextField
          floatingLabelText={intl.formatMessage(agencyMessages.name)}
          {...fields.name}
        /><br />
        <TextField
          floatingLabelText={intl.formatMessage(agencyMessages.code)}
          {...fields.code}
        /><br />
        <TextField
          floatingLabelText={intl.formatMessage(agencyMessages.servicingFeeRate)}
          type="number"
          {...fields.servicingFeeRate}
        /><br />
      </div>
    );
  }

  render() {
    const {
      intl,
      isAddAgencyDialogOpen,
    } = this.props;

    const actions = [
      <FlatButton
        label={intl.formatMessage(agencyMessages.cancel)}
        secondary
        onTouchTap={() => this.dismissDialog()}
      />,
      <FlatButton
        label={intl.formatMessage(agencyMessages.submit)}
        primary
        keyboardFocused
        disabled={!this.validateFormInput()}
        onTouchTap={() => this.handleSubmitUserAction()}
      />,
    ];

    const title = `${intl.formatMessage(agencyMessages.addAgency)}`;

    return (
      <div>
        <Helmet title={title} />
        <Dialog
          title={title}
          actions={actions}
          modal
          open={isAddAgencyDialogOpen}
          onRequestClose={() => this.dismissDialog()}
        >
          {this.renderDialogContent()}
        </Dialog>
      </div>
    );
  }
}

AddAgencyDialog = fields(AddAgencyDialog, {
  path: 'agency',
  fields: ['name', 'code', 'servicingFeeRate']
});

AddAgencyDialog = injectIntl(AddAgencyDialog);

export default connect(state => ({
  isAddAgencyDialogOpen: state.ui.isAddAgencyDialogOpen,
  viewer: state.users.viewer,
}), {
  setField,
  createAgency,
  toggleAddAgencyDialog,
})(AddAgencyDialog);
