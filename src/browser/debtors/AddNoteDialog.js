import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { closeAddNoteDialog } from '../../common/ui/actions';
import TextField from 'material-ui/TextField';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { addNewNote } from '../../common/notes/actions';
import { injectIntl, intlShape } from 'react-intl';
import notesMessages from '../../common/notes/notesMessages';
import ReactMarkdown from 'react-markdown';

class AddNoteDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isAddNoteDialogOpen: PropTypes.bool.isRequired,
    closeAddNoteDialog: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
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
    const { closeAddNoteDialog, debtorId, fields, addNewNote, viewer } = this.props;
    addNewNote({
      note: fields.note.value.trim(),
      debtorId,
    }, viewer);

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
    const { intl, isAddNoteDialogOpen, fields } = this.props;

    const actions = [
      <FlatButton
        label={intl.formatMessage(notesMessages.cancel)}
        secondary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label={intl.formatMessage(notesMessages.add)}
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
        width: 600,
      },
      h4: {
        color: 'rgba(0, 0, 0, 0.27)'
      }
    };
    return (
      <Dialog
        title={intl.formatMessage(notesMessages.newNote)}
        actions={actions}
        modal
        open={isAddNoteDialogOpen}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
        contentStyle={styles.contentStyle}
      >
        <h4
          style={styles.h4}
        >
          {intl.formatMessage(notesMessages.preview)}
        </h4>
        <ReactMarkdown
          source={fields.note.value}
          skipHtml
        />
        <TextField
          floatingLabelText={intl.formatMessage(notesMessages.note)}
          multiLine
          rows={2}
          fullWidth
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

AddNoteDialog = injectIntl(AddNoteDialog);

export default connect(state => ({
  isAddNoteDialogOpen: state.ui.isAddNoteDialogOpen,
  viewer: state.users.viewer,
}), {
  closeAddNoteDialog,
  setField,
  addNewNote,
})(AddNoteDialog);
