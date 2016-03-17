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


class ContactList extends Component {
  static propTypes = {
    msg: PropTypes.object.isRequired,
    addresses: PropTypes.object.isRequired,
    debtorId: PropTypes.number.isRequired,
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { msg, addresses, debtorId } = this.props;
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
      }
    };
    return (
      <Card>
        <CardHeader
          title={msg.addresses}
        />
      <CardActions style={styles.container}>
          <List style={styles.list}>
            {
              addressList.map(address => (
                <ListItem
                  leftIcon={<HomeIcon />}
                  primaryText={address.address}
                  secondaryText={address.addressType}
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
  addresses: state.addresses.map,
}))(ContactList);
