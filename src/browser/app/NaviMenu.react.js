import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import LeftNav from 'material-ui/lib/left-nav';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { toggleSideMenu } from '../../common/ui/actions';
import { browserHistory } from 'react-router';
import linksMessages from '../../common/app/linksMessages';
import { FormattedMessage } from 'react-intl';

class NaviMenu extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    toggleSideMenu: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.goToDebtors = this.goToDebtors.bind(this);
    this.goHome = this.goHome.bind(this);
  }

  goToDebtors() {
    const { toggleSideMenu } = this.props;
    browserHistory.push('/debtors');

    // Close SideMenu
    toggleSideMenu();
  }

  goHome() {
    const { toggleSideMenu } = this.props;
    browserHistory.push('/');

    // Close SideMenu
    toggleSideMenu();
  }

  render() {
    const { open } = this.props;

    return (
      <div>
        <LeftNav open={open}>
          <MenuItem onTouchTap={this.goHome}>
            <FormattedMessage
              {...linksMessages.home}
            />
          </MenuItem>
          <MenuItem onTouchTap={this.goToDebtors}>
            <FormattedMessage
              {...linksMessages.debtors}
            />
          </MenuItem>
        </LeftNav>
      </div>
    );
  }

}

export default connect(null, {
  toggleSideMenu
})(NaviMenu);
