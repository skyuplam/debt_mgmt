import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import { closeAddAddressDialog } from '../../common/ui/actions';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { addNewAddress } from '../../common/addresses/actions';
import { injectIntl, intlShape } from 'react-intl';
import contactsMessages from '../../common/contactNumbers/contactsMessages';

class AddAddressDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isAddAddressDialogOpen: PropTypes.bool.isRequired,
    closeAddAddressDialog: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    debtorId: PropTypes.number.isRequired,
    setField: PropTypes.func.isRequired,
    addNewAddress: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleSelectedType = this.handleSelectedType.bind(this);
    this.handleSelectedSource = this.handleSelectedSource.bind(this);
    this.isValid = this.isValid.bind(this);
    this.showingExt = this.showingExt.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleClose() {
    const { closeAddAddressDialog } = this.props;
    closeAddAddressDialog();
  }

  handleNew() {
    const { closeAddAddressDialog, debtorId, fields, addNewAddress } = this.props;
    addNewAddress({
      address: fields.address.value.trim(),
      county: fields.county.value.trim(),
      city: fields.city.value.trim(),
      province: fields.province.value.trim(),
      addressType: fields.addressType.value,
      country: fields.country.value.trim(),
      source: fields.source.value,
      debtorId,
    });

    fields.$reset();
    closeAddAddressDialog();
  }

  handleSelectedType(event, index, value) {
    const { setField } = this.props;
    setField(['AddAddressDialog', 'addressType'], value);
  }

  handleSelectedSource(event, index, value) {
    const { setField } = this.props;
    setField(['AddAddressDialog', 'source'], value);
  }

  isValid() {
    const { fields } = this.props;
    const address = fields.address.value.trim();
    const county = fields.county.value.trim();
    const city = fields.city.value.trim();
    const province = fields.province.value.trim();
    const country = fields.country.value.trim();
    const source = fields.source.value;
    const addressType = fields.addressType.value;
    if (address &&
      county &&
      city &&
      province &&
      country &&
      address.length >= 4 &&
      source > 0 &&
      addressType > 0) {
      return true;
    }

    return false;
  }

  showingExt() {
    const { intl, fields } = this.props;
    if (fields.contactNumberType.value !== 1) {
      return (
        <TextField
          hintText={'001'}
          floatingLabelText={intl.formatMessage(contactsMessages.ext)}
          {...fields.ext}
        />
      );
    }

    return (<div></div>);
  }

  render() {
    const { intl, isAddAddressDialogOpen, fields } = this.props;
    const actions = [
      <FlatButton
        label={intl.formatMessage(contactsMessages.cancel)}
        secondary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={intl.formatMessage(contactsMessages.add)}
        primary
        keyboardFocused
        onTouchTap={this.handleNew}
        disabled={!this.isValid()}
      />,
    ];

    const styles = {
      containerStyle: {
        overflowY: 'auto'
      },
      contentStyle: {
        width: 400,
      }
    };
    return (
      <Dialog
        title={intl.formatMessage(contactsMessages.addNewAddress)}
        actions={actions}
        modal
        open={isAddAddressDialogOpen}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
        contentStyle={styles.contentStyle}
      >
        <TextField
          hintText={'中路南光大厦2517'}
          floatingLabelText={intl.formatMessage(contactsMessages.address)}
          {...fields.address}
        /><br />
        <TextField
          hintText={'福田区'}
          floatingLabelText={intl.formatMessage(contactsMessages.county)}
          {...fields.county}
        /><br />
        <TextField
          hintText={'深圳市'}
          floatingLabelText={intl.formatMessage(contactsMessages.city)}
          {...fields.city}
        /><br />
        <TextField
          hintText={'广东省'}
          floatingLabelText={intl.formatMessage(contactsMessages.province)}
          {...fields.province}
        /><br />
        <TextField
          hintText={'中国'}
          floatingLabelText={intl.formatMessage(contactsMessages.country)}
          {...fields.country}
        /><br />
        <SelectField
          hintText={intl.formatMessage(contactsMessages.contactNumberType1)}
          floatingLabelText={intl.formatMessage(contactsMessages.addressType)}
          onChange={this.handleSelectedType}
          value={fields.addressType.value}
        >
          <MenuItem
            value={1}
            label={intl.formatMessage(contactsMessages.Home)}
            primaryText={intl.formatMessage(contactsMessages.Home)}
          />
          <MenuItem
            value={2}
            label={intl.formatMessage(contactsMessages.Work)}
            primaryText={intl.formatMessage(contactsMessages.Work)}
          />
        </SelectField><br />
        <SelectField
          hintText={intl.formatMessage(contactsMessages.source)}
          floatingLabelText={intl.formatMessage(contactsMessages.source)}
          onChange={this.handleSelectedSource}
          value={fields.source.value}
        >
          <MenuItem
            value={1}
            label={intl.formatMessage(contactsMessages.Originator)}
            primaryText={intl.formatMessage(contactsMessages.Originator)}
          />
          <MenuItem
            value={2}
            label={intl.formatMessage(contactsMessages.DCA)}
            primaryText={intl.formatMessage(contactsMessages.DCA)}
          />
          <MenuItem
            value={3}
            label={intl.formatMessage(contactsMessages.Debtor)}
            primaryText={intl.formatMessage(contactsMessages.Debtor)}
          />
          <MenuItem
            value={4}
            label={intl.formatMessage(contactsMessages.DebtorRelatives)}
            primaryText={intl.formatMessage(contactsMessages.DebtorRelatives)}
          />
          <MenuItem
            value={5}
            label={intl.formatMessage(contactsMessages.DebtorFriends)}
            primaryText={intl.formatMessage(contactsMessages.DebtorFriends)}
          />
        </SelectField><br />
      </Dialog>
    );
  }
}

AddAddressDialog = fields(AddAddressDialog, {
  path: 'AddAddressDialog',
  fields: [
    'address',
    'county',
    'city',
    'province',
    'addressType',
    'country',
    'source'
  ]
});


AddAddressDialog = injectIntl(AddAddressDialog);

export default connect(state => ({
  isAddAddressDialogOpen: state.ui.isAddAddressDialogOpen,
}), {
  closeAddAddressDialog,
  setField,
  addNewAddress,
})(AddAddressDialog);
