import './DebtorInfo.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import GridList from 'material-ui/lib/grid-list/grid-list';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import AddNoteDialog from './AddNoteDialog';
import { openAddNoteDialog } from '../../common/ui/actions';
import { FormattedDate } from 'react-intl';
import { isDate } from 'validator';
import { injectIntl, intlShape } from 'react-intl';
import debtorsMessages from '../../common/debtors/debtorsMessages';

class DebtorInfo extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    notes: PropTypes.object.isRequired,
    debtor: PropTypes.object.isRequired,
    openAddNoteDialog: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.handleAddNote = this.handleAddNote.bind(this);
    this.formatDate = this.formatDate.bind(this);
  }

  formatDate(date) {
    const theDate = isDate(date) ? new Date(date) : null;
    return (
      <p>
        <FormattedDate
          value={theDate}
        />
      </p>
    );
  }

  handleAddNote() {
    const { openAddNoteDialog } = this.props;
    openAddNoteDialog();
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
                  primaryText={note.note}
                  secondaryText={this.formatDate(note.createdAt)}
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
        </Card>
      </GridList>
    );
  }

}

DebtorInfo = injectIntl(DebtorInfo);

export default connect(state => ({
  notes: state.notes.map,
}), {
  openAddNoteDialog
})(DebtorInfo);
