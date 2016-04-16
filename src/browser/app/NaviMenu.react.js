import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { connect } from 'react-redux';
import LeftNav from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import { toggleSideMenu } from '../../common/ui/actions';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';
import { push } from 'react-router-redux';
import { LINKS } from '../../common/app/actions';


class NaviMenu extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    toggleSideMenu: PropTypes.func.isRequired,
    viewer: PropTypes.object,
    push: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.redirectTo = this.redirectTo.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  redirectTo(path) {
    const { toggleSideMenu, push } = this.props;
    push(path);
    // Close SideMenu
    toggleSideMenu();
  }

  render() {
    const { open, viewer } = this.props;

    return (
      <div>
        <LeftNav open={open}>
          <MenuItem onTouchTap={() => this.redirectTo(LINKS.home)}>
            <FormattedMessage
              {...linksMessages.home}
            />
          </MenuItem>
          {
            viewer ?
            <div>
              <MenuItem onTouchTap={() => this.redirectTo(LINKS.debtors)}>
                <FormattedMessage
                  {...linksMessages.debtors}
                />
              </MenuItem>
              <MenuItem onTouchTap={() => this.redirectTo(LINKS.users)}>
                <FormattedMessage
                  {...linksMessages.users}
                />
              </MenuItem>
              <MenuItem onTouchTap={() => this.redirectTo(LINKS.boarding)}>
                <FormattedMessage
                  {...linksMessages.boarding}
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
