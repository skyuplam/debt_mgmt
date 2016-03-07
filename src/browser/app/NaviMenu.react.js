import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import * as uiActions from '../../common/ui/actions';
import { browserHistory } from 'react-router';


class Header extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    toggleSideMenu: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.goToDebtors = this.goToDebtors.bind(this);
  }

  goToDebtors() {
    const { toggleSideMenu } = this.props;
    browserHistory.push(`/debtorList`);

    // Close SideMenu
    toggleSideMenu()
  }

  render() {
    const { msg, open, toggleSideMenu } = this.props;

    return (
      <div>
        <LeftNav open={open}>
          <MenuItem onTouchTap={this.goToDebtors}>{msg.debtors}</MenuItem>
        </LeftNav>
      </div>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.app.links,
}), uiActions)(Header);
