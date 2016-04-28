import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import agencyMessages from '../../common/agencies/agencyMessages';
import Dialog from 'material-ui/Dialog';
import { toggleAddPlacementDialog } from '../../common/ui/actions';
import TextField from 'material-ui/TextField';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { createPlacement } from '../../common/agencies/actions';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';


class AddPlacementDialog extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    fields: PropTypes.object.isRequired,
    agencies: PropTypes.object.isRequired,
    isAddPlacementDialogOpen: PropTypes.bool.isRequired,
    toggleAddPlacementDialog: PropTypes.func.isRequired,
    createPlacement: PropTypes.func.isRequired,
    setField: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();
    this.renderDialogContent = this.renderDialogContent.bind(this);
    this.validateFormInput = this.validateFormInput.bind(this);
    this.dismissDialog = this.dismissDialog.bind(this);
    this.handleSelectedAgency = this.handleSelectedAgency.bind(this);
    this.handlePlacedAtOnChange = this.handlePlacedAtOnChange.bind(this);
    this.handleExpectedRecalledAtOnChange = this.handleExpectedRecalledAtOnChange.bind(this);
  }

  dismissDialog() {
    const { toggleAddPlacementDialog, fields } = this.props;

    fields.$reset();
    toggleAddPlacementDialog();
  }

  validateFormInput() {
    const { fields } = this.props;

    if (fields.placementCode.value.trim() &&
      fields.placedAt.value &&
      fields.expectedRecalledAt.value &&
      fields.companyId.value &&
      fields.servicingFeeRate.value > 0
    ) {
      return true;
    }
    return false;
  }

  handleSelectedAgency(event, index, value) {
    const { setField } = this.props;
    setField(['placement', 'companyId'], value);
  }

  handleSubmitUserAction() {
    const { createPlacement, fields, viewer } = this.props;
    createPlacement({ placement: fields.$values() }, viewer);
    this.dismissDialog();
  }

  handlePlacedAtOnChange(e, date) {
    const { setField } = this.props;
    setField(['placement', 'placedAt'], date);
    return date;
  }

  handleExpectedRecalledAtOnChange(e, date) {
    const { setField } = this.props;
    setField(['placement', 'expectedRecalledAt'], date);
    return date;
  }

  renderDialogContent() {
    const {
      intl,
      fields,
      agencies,
    } = this.props;
    return (
      <div>
        <SelectField
          floatingLabelText={intl.formatMessage(agencyMessages.name)}
          onChange={this.handleSelectedAgency}
          value={fields.companyId.value}
          maxHeight={300}
        >
          {
            agencies.toArray().map(agency => (
              <MenuItem
                key={agency.company.id}
                value={agency.company.id}
                label={agency.company.name}
                primaryText={agency.company.name}
              />
            ))
          }
        </SelectField><br />
        <TextField
          floatingLabelText={intl.formatMessage(agencyMessages.placementCode)}
          {...fields.placementCode}
        /><br />
        <TextField
          floatingLabelText={intl.formatMessage(agencyMessages.servicingFeeRate)}
          type="number"
          {...fields.servicingFeeRate}
        /><br />
        <DatePicker
          hintText={intl.formatMessage(agencyMessages.placedAt)}
          floatingLabelText={intl.formatMessage(agencyMessages.placedAt)}
          locale="zh"
          DateTimeFormat={global.Intl.DateTimeFormat}
          onChange={this.handlePlacedAtOnChange}
          cancelLabel={intl.formatMessage(agencyMessages.cancel)}
          okLabel={intl.formatMessage(agencyMessages.submit)}
          autoOk
        />
        <DatePicker
          hintText={intl.formatMessage(agencyMessages.expectedRecalledAt)}
          floatingLabelText={intl.formatMessage(agencyMessages.expectedRecalledAt)}
          locale="zh"
          DateTimeFormat={global.Intl.DateTimeFormat}
          onChange={this.handleExpectedRecalledAtOnChange}
          cancelLabel={intl.formatMessage(agencyMessages.cancel)}
          okLabel={intl.formatMessage(agencyMessages.submit)}
          autoOk
        />
      </div>
    );
  }

  render() {
    const {
      intl,
      isAddPlacementDialogOpen,
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

    const title = `${intl.formatMessage(agencyMessages.addPlacement)}`;

    return (
      <div>
        <Helmet title={title} />
        <Dialog
          title={title}
          actions={actions}
          modal
          open={isAddPlacementDialogOpen}
          onRequestClose={() => this.dismissDialog()}
        >
          {this.renderDialogContent()}
        </Dialog>
      </div>
    );
  }
}

AddPlacementDialog = fields(AddPlacementDialog, {
  path: 'placement',
  fields: [
    'placementCode',
    'placedAt',
    'expectedRecalledAt',
    'servicingFeeRate',
    'companyId',
  ]
});

AddPlacementDialog = injectIntl(AddPlacementDialog);

export default connect(state => ({
  isAddPlacementDialogOpen: state.ui.isAddPlacementDialogOpen,
  viewer: state.users.viewer,
  agencies: state.agencies.map,
}), {
  setField,
  createPlacement,
  toggleAddPlacementDialog,
})(AddPlacementDialog);
