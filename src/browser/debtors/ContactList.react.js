import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import GridList from 'material-ui/GridList/GridList';
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
        height: '100%',
      },
    };
    return (
      <GridList
        style={styles.gridList}
        padding={1}
        className="grid-list"
      >
        <ContactNumbers debtorId={debtorId} />
        <Addresses debtorId={debtorId} />
      </GridList>
    );
  }
}

export default ContactList;
