import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { dateFormat } from '../../common/intl/format';
import { FormattedNumber, IntlMixin } from 'react-intl';
import GridList from 'material-ui/lib/grid-list/grid-list';
import ContactNumbers from './ContactNumbers.react';
import Addresses from './Addresses.react';

class ContactList extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static propTypes = {
    msg: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { msg } = this.props;
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
        <ContactNumbers />
        <Addresses />
      </GridList>
    );
  }
}

export default connect(state => ({
  msg: state.intl.msg.contacts,
}))(ContactList);
