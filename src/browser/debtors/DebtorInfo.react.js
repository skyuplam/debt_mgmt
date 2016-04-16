import './DebtorInfo.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import GridList from 'material-ui/GridList/GridList';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AddNoteDialog from './AddNoteDialog';
import { openAddNoteDialog, toggleNoteDialog } from '../../common/ui/actions';
import { FormattedDate } from 'react-intl';
import { injectIntl, intlShape } from 'react-intl';
import debtorsMessages from '../../common/debtors/debtorsMessages';
import moment from 'moment';
import NoteDialog from './NoteDialog.react';


class DebtorInfo extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    notes: PropTypes.object.isRequired,
    debtor: PropTypes.object.isRequired,
    openAddNoteDialog: PropTypes.func.isRequired,
    toggleNoteDialog: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.handleAddNote = this.handleAddNote.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.handleOpenNote = this.handleOpenNote.bind(this);
  }

  formatDate(date) {
    return (
      <p>
        {moment(date).isValid() ? (
          <FormattedDate
            value={moment(date)}
          />
        ) : ''}
      </p>
    );
  }

  handleAddNote() {
    const { openAddNoteDialog } = this.props;
    openAddNoteDialog();
  }

  handleOpenNote(note) {
    const { toggleNoteDialog } = this.props;
    toggleNoteDialog(note);
  }

  render() {
    const { intl, debtor, notes } = this.props;
    const theNotes = notes ? notes.filter(note =>
      note.personId === debtor.id
    ) : [];
    const styles = {
      gridList: {
        width: '100%',
        height: 236,
      },
      card: {
        height: 234,
      },
      list: {
        height: 130,
        overflowY: 'auto',
      },
      listItem: {
        width: '100%',
      },
      floatingActionBtn: {
        width: 40,
        height: 40,
        marginLeft: 8,
      }
    };
    return (
      <GridList
        style={styles.gridList}
        padding={1}
      >
        <Card
          style={styles.card}
        >
          <CardHeader
            title={
              `${intl.formatMessage(debtorsMessages.debtorDetail)} - ${debtor ? debtor.name : ''}`
            }
          />
          <div className="debtor-info">
            <TextField
              floatingLabelText={intl.formatMessage(debtorsMessages.idCard)}
              disabled
              value={debtor ? debtor.idNumber : ''}
            />
            <TextField
              floatingLabelText={intl.formatMessage(debtorsMessages.maritalStatus)}
              disabled
              value={debtor ? debtor.maritalStatus : ''}
            />
          </div>
        </Card>
        <Card
          style={styles.card}
        >
          <CardHeader
            title={`${intl.formatMessage(debtorsMessages.note)}`}
          />
          <List
            style={styles.list}
          >
            {
              theNotes.map(note => (
                <ListItem
                  primaryText={this.formatDate(note.createdAt)}
                  secondaryText={note.note}
                  secondaryTextLines={2}
                  onTouchTap={() => this.handleOpenNote(note)}
                />
              ))
            }
          </List>
          <FloatingActionButton
            mini
            style={styles.floatingActionBtn}
            onTouchEnd={this.handleAddNote}
            onMouseDown={this.handleAddNote}
          >
            <ContentAdd />
          </FloatingActionButton>
          <AddNoteDialog debtorId={debtor ? debtor.id : 0} />
          <NoteDialog />
        </Card>
      </GridList>
    );
  }

}

DebtorInfo = injectIntl(DebtorInfo);

export default connect(state => ({
  notes: state.notes.map,
}), {
  openAddNoteDialog,
  toggleNoteDialog
})(DebtorInfo);
