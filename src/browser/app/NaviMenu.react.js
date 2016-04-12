import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { toggleSideMenu } from '../../common/ui/actions';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';


class NaviMenu extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    toggleSideMenu: PropTypes.func.isRequired,
    viewer: PropTypes.object,
    push: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.goToDebtors = this.goToDebtors.bind(this);
    this.goToUsers = this.goToUsers.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  goToDebtors() {
    const { toggleSideMenu, push } = this.props;
    push('/debtors');

    // Close SideMenu
    toggleSideMenu();
  }

  goToUsers() {
    const { toggleSideMenu, push } = this.props;
    push('/users');

    // Close SideMenu
    toggleSideMenu();
  }

  goHome() {
    const { toggleSideMenu, push } = this.props;
    push('/');

    // Close SideMenu
    toggleSideMenu();
  }

  render() {
    const { open, viewer } = this.props;

    return (
      <div>
        <LeftNav open={open}>
          <MenuItem onTouchTap={this.goHome}>
            <FormattedMessage
              {...linksMessages.home}
            />
          </MenuItem>
          {
            viewer ?
            <div>
              <MenuItem onTouchTap={this.goToDebtors}>
                <FormattedMessage
                  {...linksMessages.debtors}
                />
              </MenuItem>
              <MenuItem onTouchTap={this.goToUsers}>
                <FormattedMessage
                  {...linksMessages.users}
                />
              </MenuItem>
            </div>
            : null
          }
        </LeftNav>
      </div>
    );
  }

}

export default connect(state => ({
  viewer: state.users.viewer,
}), {
  toggleSideMenu,
  push,
})(NaviMenu);
