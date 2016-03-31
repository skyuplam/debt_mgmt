import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardActions from 'material-ui/lib/card/card-actions';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import CommunicationCall from 'material-ui/lib/svg-icons/communication/call';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import AddContactNumberDialog from './AddContactNumberDialog.react';
import { openAddContactNumberDialog } from '../../common/ui/actions';
import { injectIntl, intlShape } from 'react-intl';
import contactsMessages from '../../common/contactNumbers/contactsMessages';

class ContactNumbers extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    debtorId: PropTypes.number.isRequired,
    contactNumbers: PropTypes.object.isRequired,
    openAddContactNumberDialog: PropTypes.func.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.handleAddContactNumber = this.handleAddContactNumber.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleAddContactNumber() {
    const { openAddContactNumberDialog } = this.props;
    // Show Dialog for adding contactNumber
    openAddContactNumberDialog();
  }

  render() {
    const { intl, contactNumbers, debtorId } = this.props;
    const theContacts = contactNumbers ? contactNumbers.filter(contactNumber =>
      contactNumber.debtorId === debtorId
    ) : [];
    const styles = {
      container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      list: {
        width: '100%',
        height: 214,
        overflowY: 'auto',
      },
      floatingActionBtn: {
        width: 40,
        height: 40,
      }
    };
    return (
      <Card>
        <CardHeader
          title={intl.formatMessage(contactsMessages.contacts)}
        />
        <CardActions style={styles.container}>
          <List style={styles.list}>
            {
              theContacts.map(contact => (
                <ListItem
                  leftIcon={<CommunicationCall />}
                  primaryText={contact.contactNumber}
                  secondaryText={
                    intl.formatMessage(contactsMessages[`contactNumberType${contact.contactNumberTypeId}`])
                  }
                />
              ))
            }
          </List>
          <FloatingActionButton
            mini
            style={styles.floatingActionBtn}
            onTouchEnd={this.handleAddContactNumber}
            onMouseDown={this.handleAddContactNumber}
          >
            <ContentAdd />
          </FloatingActionButton>
        </CardActions>
        <AddContactNumberDialog debtorId={debtorId} />
      </Card>
    );
  }
}

ContactNumbers = injectIntl(ContactNumbers);

export default connect(state => ({
  contactNumbers: state.contactNumbers.map,
}), {
  openAddContactNumberDialog
})(ContactNumbers);
