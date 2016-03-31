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
import { injectIntl, intlShape } from 'react-intl';
import contactsMessages from '../../common/contactNumbers/contactsMessages';

class AddContactNumberDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isAddContactNumberDialogOpen: PropTypes.bool.isRequired,
    closeAddContactNumberDialog: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    relationships: PropTypes.object.isRequired,
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
    this.handleSelectedRelationship = this.handleSelectedRelationship.bind(this);
    this.isValid = this.isValid.bind(this);
    this.showingAreaCode = this.showingAreaCode.bind(this);
    this.showingExt = this.showingExt.bind(this);
    this.showingContactPersonField = this.showingContactPersonField.bind(this);
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
      contactPerson: fields.contactPerson.value.trim(),
      relationship: fields.relationship.value,
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

  handleSelectedRelationship(event, index, value) {
    const { setField } = this.props;
    setField(['AddContactNumberDialog', 'relationship'], value);
  }

  handleSelectedSource(event, index, value) {
    const { setField } = this.props;
    setField(['AddContactNumberDialog', 'source'], value);
  }

  isValid() {
    const { fields } = this.props;
    const contactNumber = fields.contactNumber.value.trim();
    const contactPerson = fields.contactPerson.value.trim();
    const relationship = fields.relationship.value;
    const source = fields.source.value;
    const contactNumberType = fields.contactNumberType.value;
    if (contactNumber && contactNumber.length >= 8 &&
      relationship > 0 &&
      source > 0 &&
      contactNumberType > 0) {
      if (relationship !== 1 &&
        !contactPerson
      ) {
        return false;
      }
      return true;
    }

    return false;
  }

  showingContactPersonField() {
    const { intl, fields } = this.props;

    if (fields.relationship.value !== 1) {
      return (
        <TextField
          floatingLabelText={intl.formatMessage(contactsMessages.contactPerson)}
          {...fields.contactPerson}
        />
      );
    }

    return (<div></div>);
  }

  showingAreaCode() {
    const { intl, fields } = this.props;
    const areaCode = intl.formatMessage(contactsMessages.areaCode);
    if (fields.contactNumberType.value !== 1) {
      return (
        <TextField
          hintText={'755'}
          floatingLabelText={areaCode}
          {...fields.areaCode}
        />
      );
    }

    return (<div></div>);
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
    const {
      intl,
      isAddContactNumberDialogOpen,
      fields,
      relationships
    } = this.props;
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
        title={intl.formatMessage(contactsMessages.addNewContact)}
        actions={actions}
        modal
        open={isAddContactNumberDialogOpen}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
        contentStyle={styles.contentStyle}
      >
        <SelectField
          floatingLabelText={intl.formatMessage(contactsMessages.relationship)}
          onChange={this.handleSelectedRelationship}
          value={fields.relationship.value}
          maxHeight={300}
        >
          {
            relationships.map(relationship => (
              <MenuItem
                value={relationship.id}
                label={intl.formatMessage(contactsMessages[relationship.relationship])}
                primaryText={
                  intl.formatMessage(contactsMessages[relationship.relationship])
                }
              />
            ))
          }
        </SelectField><br />
        {this.showingContactPersonField()}
        <SelectField
          hintText={intl.formatMessage(contactsMessages.contactNumberType1)}
          floatingLabelText={intl.formatMessage(contactsMessages.contactNumberType)}
          onChange={this.handleSelectedType}
          value={fields.contactNumberType.value}
        >
          <MenuItem
            value={1}
            label={intl.formatMessage(contactsMessages.contactNumberType1)}
            primaryText={intl.formatMessage(contactsMessages.contactNumberType1)}
          />
          <MenuItem
            value={2}
            label={intl.formatMessage(contactsMessages.contactNumberType2)}
            primaryText={intl.formatMessage(contactsMessages.contactNumberType2)}
          />
          <MenuItem
            value={3}
            label={intl.formatMessage(contactsMessages.contactNumberType3)}
            primaryText={intl.formatMessage(contactsMessages.contactNumberType3)}
          />
        </SelectField><br />
        <TextField
          hintText={'+86'}
          floatingLabelText={intl.formatMessage(contactsMessages.countryCode)}
          {...fields.countryCode}
        /><br />
        {this.showingAreaCode()}
        <TextField
          hintText={'13723456789'}
          floatingLabelText={intl.formatMessage(contactsMessages.contactNumber)}
          {...fields.contactNumber}
        /><br />
        {this.showingExt()}
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

AddContactNumberDialog = fields(AddContactNumberDialog, {
  path: 'AddContactNumberDialog',
  fields: [
    'countryCode',
    'contactPerson',
    'relationship',
    'areaCode',
    'contactNumber',
    'ext',
    'source',
    'contactNumberType',
  ]
});

AddContactNumberDialog = injectIntl(AddContactNumberDialog);

export default connect(state => ({
  isAddContactNumberDialogOpen: state.ui.isAddContactNumberDialogOpen,
  relationships: state.categories.relationships,
}), {
  closeAddContactNumberDialog,
  setField,
  addNewContactNumber,
})(AddContactNumberDialog);
