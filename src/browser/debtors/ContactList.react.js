import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import GridList from 'material-ui/lib/grid-list/grid-list';
import ContactNumbers from './ContactNumbers.react';
import Addresses from './Addresses.react';

class ContactList extends Component {
  static propTypes = {
    debtorId: PropTypes.number.isRequired,
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    const { debtorId } = this.props;
    const styles = {
      gridList: {
        width: '100%',
        height: 300,
        overflowY: 'auto',
      },
    };
    return (
      <GridList
        style={styles.gridList}
        padding={1}
      >
        <ContactNumbers debtorId={debtorId} />
        <Addresses debtorId={debtorId} />
      </GridList>
    );
  }
}

export default connect(state => ({
  msg: state.intl.msg.contacts,
}))(ContactList);
