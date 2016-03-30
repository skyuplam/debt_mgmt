import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import { closeAddNoteDialog } from '../../common/ui/actions';
import TextField from 'material-ui/lib/text-field';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { addNewNote } from '../../common/notes/actions';


class AddNoteDialog extends Component {
  static propTypes = {
    msg: PropTypes.object.isRequired,
    isAddNoteDialogOpen: PropTypes.bool.isRequired,
    closeAddNoteDialog: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    debtorId: PropTypes.number.isRequired,
    setField: PropTypes.func.isRequired,
    addNewNote: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.isValid = this.isValid.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleClose() {
    const { closeAddNoteDialog } = this.props;
    closeAddNoteDialog();
  }

  handleNew() {
    const { closeAddNoteDialog, debtorId, fields, addNewNote } = this.props;
    addNewNote({
      note: fields.note.value.trim(),
      debtorId,
    });

    fields.$reset();
    closeAddNoteDialog();
  }

  isValid() {
    const { fields } = this.props;
    const note = fields.note.value.trim();
    if (note && note.length >= 4) {
      return true;
    }

    return false;
  }

  render() {
    const { msg, isAddNoteDialogOpen, fields } = this.props;
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
        title={msg.newNote}
        actions={actions}
        modal
        open={isAddNoteDialogOpen}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
        contentStyle={styles.contentStyle}
      >
        <TextField
          floatingLabelText={msg.note}
          multiLine
          rows={2}
          rowsMax={4}
          {...fields.note}
        /><br />
      </Dialog>
    );
  }
}

AddNoteDialog = fields(AddNoteDialog, {
  path: 'AddNewNote',
  fields: [
    'note'
  ]
});


export default connect(state => ({
  msg: state.intl.msg.notes,
  isAddNoteDialogOpen: state.ui.isAddNoteDialogOpen,
}), {
  closeAddNoteDialog,
  setField,
  addNewNote,
})(AddNoteDialog);
