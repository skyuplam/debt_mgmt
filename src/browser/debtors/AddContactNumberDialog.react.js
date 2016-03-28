import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import { closeAddContactNumberDialog } from '../../common/ui/actions';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import TextField from 'material-ui/lib/text-field';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { addNewContactNumber } from '../../common/contactNumbers/actions';


class AddContactNumberDialog extends Component {
  static propTypes = {
    msg: PropTypes.object.isRequired,
    isAddContactNumberDialogOpen: PropTypes.bool.isRequired,
    closeAddContactNumberDialog: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    debtorId: PropTypes.number.isRequired,
    setField: PropTypes.func.isRequired,
    addNewContactNumber: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleSelectedType = this.handleSelectedType.bind(this);
    this.handleSelectedSource = this.handleSelectedSource.bind(this);
    this.isValid = this.isValid.bind(this);
    this.showingAreaCode = this.showingAreaCode.bind(this);
    this.showingExt = this.showingExt.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleClose() {
    const { closeAddContactNumberDialog } = this.props;
    closeAddContactNumberDialog();
  }

  handleNew() {
    const { closeAddContactNumberDialog, debtorId, fields, addNewContactNumber } = this.props;

    addNewContactNumber({
      contactNumber: fields.contactNumber.value.trim(),
      contactNumberType: fields.contactNumberType.value,
      countryCode: fields.countryCode.value.trim(),
      areaCode: fields.areaCode.value.trim(),
      ext: fields.ext.value.trim(),
      source: fields.source.value,
      debtorId,
    });

    fields.$reset();
    closeAddContactNumberDialog();
  }

  handleSelectedType(event, index, value) {
    const { setField } = this.props;
    setField(['AddContactNumberDialog', 'contactNumberType'], value);
  }

  handleSelectedSource(event, index, value) {
    const { setField } = this.props;
    setField(['AddContactNumberDialog', 'source'], value);
  }

  isValid() {
    const { fields } = this.props;
    const contactNumber = fields.contactNumber.value.trim();
    const source = fields.source.value;
    const contactNumberType = fields.contactNumberType.value;
    if (contactNumber && contactNumber.length >= 8 &&
      source > 0 &&
      contactNumberType > 0) {
      return true;
    }

    return false;
  }

  showingAreaCode() {
    const { msg, fields } = this.props;
    if (fields.contactNumberType.value !== 1) {
      return (
        <TextField
          hintText={'755'}
          floatingLabelText={msg.areaCode}
          {...fields.areaCode}
        />
      );
    }

    return (<div></div>);
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
    const { msg, isAddContactNumberDialogOpen, fields } = this.props;
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
        title={msg.addNewContact}
        actions={actions}
        modal
        open={isAddContactNumberDialogOpen}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
        contentStyle={styles.contentStyle}
      >
        <SelectField
          hintText={msg.contactNumberType1}
          floatingLabelText={msg.contactNumberType}
          onChange={this.handleSelectedType}
          value={fields.contactNumberType.value}
        >
          <MenuItem
            value={1}
            label={msg.contactNumberType1}
            primaryText={msg.contactNumberType1}
          />
          <MenuItem
            value={2}
            label={msg.contactNumberType2}
            primaryText={msg.contactNumberType2}
          />
          <MenuItem
            value={3}
            label={msg.contactNumberType3}
            primaryText={msg.contactNumberType3}
          />
        </SelectField><br />
        <TextField
          hintText={'+86'}
          floatingLabelText={msg.countryCode}
          {...fields.countryCode}
        /><br />
        {this.showingAreaCode()}
        <TextField
          hintText={'13723456789'}
          floatingLabelText={msg.contactNumber}
          {...fields.contactNumber}
        /><br />
        {this.showingExt()}
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
  path: 'AddContactNumberDialog',
  fields: [
    'countryCode',
    'areaCode',
    'contactNumber',
    'ext',
    'source',
    'contactNumberType',
  ]
});


export default connect(state => ({
  msg: state.intl.msg.contacts,
  isAddContactNumberDialogOpen: state.ui.isAddContactNumberDialogOpen,
}), {
  closeAddContactNumberDialog,
  setField,
  addNewContactNumber,
})(AddContactNumberDialog);
