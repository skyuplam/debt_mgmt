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


class AddContactNumberDialog extends Component {
  static propTypes = {
    msg: PropTypes.object.isRequired,
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
    const source = fields.source.value;
    const addressType = fields.addressType.value;
    if (address && address.length >= 4 &&
      source > 0 &&
      addressType > 0) {
      return true;
    }

    return false;
  }

  showingExt() {
    const { msg, fields } = this.props;
    if (fields.contactNumberType.value !== 1) {
      return (
        <TextField
          hintText={'001'}
          floatingLabelText={msg.ext}
          {...fields.ext}
        />
      );
    }

    return (<div></div>);
  }

  render() {
    const { msg, isAddAddressDialogOpen, fields } = this.props;
    const actions = [
      <FlatButton
        label={msg.cancel}
        secondary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={msg.add}
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
        title={msg.addNewAddress}
        actions={actions}
        modal
        open={isAddAddressDialogOpen}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
        contentStyle={styles.contentStyle}
      >
        <TextField
          hintText={'中路南光大厦2517'}
          floatingLabelText={msg.address}
          {...fields.address}
        /><br />
        <TextField
          hintText={'福田区'}
          floatingLabelText={msg.county}
          {...fields.county}
        /><br />
        <TextField
          hintText={'深圳市'}
          floatingLabelText={msg.city}
          {...fields.city}
        /><br />
        <TextField
          hintText={'广东省'}
          floatingLabelText={msg.province}
          {...fields.province}
        /><br />
        <TextField
          hintText={'中国'}
          floatingLabelText={msg.country}
          {...fields.country}
        /><br />
        <SelectField
          hintText={msg.contactNumberType1}
          floatingLabelText={msg.addressType}
          onChange={this.handleSelectedType}
          value={fields.addressType.value}
        >
          <MenuItem
            value={1}
            label={msg.Home}
            primaryText={msg.Home}
          />
          <MenuItem
            value={2}
            label={msg.Work}
            primaryText={msg.Work}
          />
        </SelectField><br />
        <SelectField
          hintText={msg.source}
          floatingLabelText={msg.source}
          onChange={this.handleSelectedSource}
          value={fields.source.value}
        >
          <MenuItem
            value={1}
            label={msg.Originator}
            primaryText={msg.Originator}
          />
          <MenuItem
            value={2}
            label={msg.DCA}
            primaryText={msg.DCA}
          />
          <MenuItem
            value={3}
            label={msg.Debtor}
            primaryText={msg.Debtor}
          />
          <MenuItem
            value={4}
            label={msg.DebtorRelatives}
            primaryText={msg.DebtorRelatives}
          />
          <MenuItem
            value={5}
            label={msg.DebtorFriends}
            primaryText={msg.DebtorFriends}
          />
        </SelectField><br />
      </Dialog>
    );
  }
}

AddContactNumberDialog = fields(AddContactNumberDialog, {
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


export default connect(state => ({
  msg: state.intl.msg.contacts,
  isAddAddressDialogOpen: state.ui.isAddAddressDialogOpen,
}), {
  closeAddAddressDialog,
  setField,
  addNewAddress,
})(AddContactNumberDialog);
