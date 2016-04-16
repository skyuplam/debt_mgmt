import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Dialog from 'material-ui/Dialog';
import { toggleNoteDialog } from '../../common/ui/actions';
import { injectIntl, intlShape } from 'react-intl';
import notesMessages from '../../common/notes/notesMessages';
import ReactMarkdown from 'react-markdown';

class NoteDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    isNoteDialogOpen: PropTypes.bool.isRequired,
    toggleNoteDialog: PropTypes.func.isRequired,
    note: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.handleClose = this.handleClose.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleClose() {
    const { toggleNoteDialog } = this.props;
    toggleNoteDialog();
  }


  render() {
    const { intl, isNoteDialogOpen, note } = this.props;

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
        title={intl.formatMessage(notesMessages.note)}
        open={isNoteDialogOpen}
        onRequestClose={this.handleClose}
        autoScrollBodyContent
        contentStyle={styles.contentStyle}
      >
        <ReactMarkdown
          source={note.note}
          skipHtml
        />
        <p style={styles.h4} >
          {intl.formatDate(note.createdAt)}
        </p>
      </Dialog>
    );
  }
}


NoteDialog = injectIntl(NoteDialog);

export default connect(state => ({
  isNoteDialogOpen: state.ui.isNoteDialogOpen,
  note: state.ui.selectedNote,
}), {
  toggleNoteDialog,
})(NoteDialog);
