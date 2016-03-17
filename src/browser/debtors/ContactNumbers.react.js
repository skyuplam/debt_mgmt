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


class ContactList extends Component {
  static propTypes = {
    msg: PropTypes.object.isRequired,
    debtorId: PropTypes.number.isRequired,
    contactNumbers: PropTypes.object.isRequired,
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { msg, contactNumbers, debtorId } = this.props;
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
      }
    };
    return (
      <Card>
        <CardHeader
          title={msg.contacts}
        />
      <CardActions style={styles.container}>
          <List style={styles.list}>
            {
              theContacts.map(contact => (
                <ListItem
                  leftIcon={<CommunicationCall />}
                  primaryText={contact.contactNumber}
                  secondaryText={contact.contactNumberType}
                />
              ))
            }
          </List>
        </CardActions>
      </Card>
    );
  }
}

export default connect(state => ({
  msg: state.intl.msg.contacts,
  contactNumbers: state.contactNumbers.map,
}))(ContactList);
