import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardActions from 'material-ui/lib/card/card-actions';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import AddAddressDialog from './AddAddressDialog.react';
import { openAddAddressDialog } from '../../common/ui/actions';
import { injectIntl, intlShape } from 'react-intl';
import contactsMessages from '../../common/contactNumbers/contactsMessages';

class Addresses extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    addresses: PropTypes.object.isRequired,
    debtorId: PropTypes.number.isRequired,
    openAddAddressDialog: PropTypes.func.isRequired,
    isAddAddressDialogOpen: PropTypes.bool.isRequired,
  }

  constructor(props, context) {
    super(props, context);

    this.handleAddAddress = this.handleAddAddress.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleAddAddress() {
    const { openAddAddressDialog } = this.props;
    // Show Dialog for adding contactNumber
    openAddAddressDialog();
  }

  render() {
    const { intl, addresses, debtorId } = this.props;
    const addressList = addresses.filter(address =>
      address.debtorId === debtorId
    );
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
          title={intl.formatMessage(contactsMessages.addresses)}
        />
      <CardActions style={styles.container}>
          <List style={styles.list}>
            {
              addressList.map(address => (
                <ListItem
                  leftIcon={<HomeIcon />}
                  primaryText={address.longAddress}
                  secondaryText={intl.formatMessage(contactsMessages[address.source])}
                />
              ))
            }
          </List>
          <FloatingActionButton
            mini
            style={styles.floatingActionBtn}
            onTouchEnd={this.handleAddAddress}
            onMouseDown={this.handleAddAddress}
          >
            <ContentAdd />
          </FloatingActionButton>
        </CardActions>
        <AddAddressDialog debtorId={debtorId} />
      </Card>
    );
  }
}

Addresses = injectIntl(Addresses);

export default connect(state => ({
  addresses: state.addresses.map,
}), {
  openAddAddressDialog
})(Addresses);
