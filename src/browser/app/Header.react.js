import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/lib/app-bar';
import NaviMenu from './NaviMenu.react';
import * as uiActions from '../../common/ui/actions';
import linksMessages from '../../common/app/linksMessages';
import { injectIntl, intlShape } from 'react-intl';
import { push } from 'react-router-redux';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import FlatButton from 'material-ui/lib/flat-button';
import { logout } from '../../common/auth/actions';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';
import { toggleAppBarActions } from '../../common/ui/actions';
import UserActionDialog from '../users/UserActionDialog.react';
import { toggleUserActionDialog } from '../../common/ui/actions';

const appBarAction = {
  logout: 'logout',
  changePassword: 'changePassword',
};


class Header extends Component {

  static propTypes = {
    viewer: PropTypes.object,
    intl: intlShape.isRequired,
    onSideMenuChange: PropTypes.func.isRequired,
    toggleSideMenu: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    toggleAppBarActions: PropTypes.func.isRequired,
    toggleUserActionDialog: PropTypes.func.isRequired,
    isSideMenuOpen: PropTypes.bool.isRequired,
    isAppBarPopupUp: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);
    this.onSideMenuChange = this.onSideMenuChange.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAppBarActions = this.handleAppBarActions.bind(this);
    this.showPopover = this.showPopover.bind(this);
    this.closePopover = this.closePopover.bind(this);

    this.popupTarget = null;
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

  changePassword() {
    const { toggleUserActionDialog, viewer } = this.props;
    toggleUserActionDialog({
      actionType: appBarAction.changePassword,
      user: viewer,
    });
  }

  closePopover() {
    const { toggleAppBarActions } = this.props;
    this.popupTarget = null;
    toggleAppBarActions();
  }

  showPopover(e) {
    const { toggleAppBarActions } = this.props;
    this.popupTarget = e.target;
    toggleAppBarActions();
  }

  handleAppBarActions(e, actionType) {
    if (this[appBarAction[actionType]]) {
      this[appBarAction[actionType]]();
    }

    this.closePopover();
  }

  render() {
    const {
      isSideMenuOpen,
      toggleSideMenu,
      intl,
      isAppBarPopupUp,
      viewer
    } = this.props;
    const actionBtn = viewer ? (
      <IconButton
        onTouchTap={this.showPopover}
      >
        <MoreVertIcon />
      </IconButton>
    ) : null;
    const appBarTitle = intl.formatMessage(linksMessages.home);
    return (
      <header>
        <AppBar
          title={appBarTitle}
          className="app-bar"
          iconElementRight={actionBtn}
          onLeftIconButtonTouchTap={toggleSideMenu}
        />
        <NaviMenu open={isSideMenuOpen} />
        <Popover
          open={isAppBarPopupUp}
          anchorEl={this.popupTarget}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.closePopover}
          animation={PopoverAnimationFromTop}
        >
          <div>
            {
              viewer ? (
                <div>
                  <FlatButton
                    label={intl.formatMessage(linksMessages.changePassword)}
                    onTouchTap={e => this.handleAppBarActions(e, appBarAction.changePassword)}
                    primary
                  /><br />
                  <FlatButton
                    label={intl.formatMessage(linksMessages.logout)}
                    onTouchTap={e => this.handleAppBarActions(e, appBarAction.logout)}
                    secondary
                  />
                </div>
              ) : null
            }
          </div>
        </Popover>
        <UserActionDialog />
      </header>
    );
  }

}

Header = injectIntl(Header);

export default connect(state => ({
  isSideMenuOpen: state.ui.isSideMenuOpen,
  viewer: state.users.viewer,
  isAppBarPopupUp: state.ui.isAppBarPopupUp,
}), {
  ...uiActions,
  push,
  logout,
  toggleAppBarActions,
  toggleUserActionDialog,
})(Header);
