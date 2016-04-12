import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/lib/app-bar';
import NaviMenu from './NaviMenu.react';
import * as uiActions from '../../common/ui/actions';
import linksMessages from '../../common/app/linksMessages';
import { injectIntl, intlShape } from 'react-intl';
import { push } from 'react-router-redux';
import FlatButton from 'material-ui/lib/flat-button';
import { logout } from '../../common/auth/actions';

class Header extends Component {

  static propTypes = {
    viewer: PropTypes.object,
    intl: intlShape.isRequired,
    onSideMenuChange: PropTypes.func.isRequired,
    toggleSideMenu: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    isSideMenuOpen: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.onSideMenuChange = this.onSideMenuChange.bind(this);
    this.logout = this.logout.bind(this);
  }

  onSideMenuChange(isOpen) {
    const { onSideMenuChange } = this.props;
    onSideMenuChange(isOpen);
  }

  goToDebtors() {
    const { push } = this.props;
    push('/debtors');
  }

  logout() {
    const { logout } = this.props;
    logout();
  }

  render() {
    const { isSideMenuOpen, toggleSideMenu, intl, viewer } = this.props;
    const logoutBtn = viewer ? (
      <FlatButton
        label="Logout"
        onTouchTap={this.logout}
      />
    ) : null;
    const appBarTitle = intl.formatMessage(linksMessages.home);
    return (
      <header>
        <AppBar
          title={appBarTitle}
          className="app-bar"
          iconElementRight={logoutBtn}
          onLeftIconButtonTouchTap={toggleSideMenu}
        />
        <NaviMenu open={isSideMenuOpen} />
      </header>
    );
  }

}

Header = injectIntl(Header);

export default connect(state => ({
  isSideMenuOpen: state.ui.isSideMenuOpen,
  viewer: state.users.viewer,
}), {
  ...uiActions,
  push,
  logout,
})(Header);
