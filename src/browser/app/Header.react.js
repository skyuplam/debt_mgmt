import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/lib/app-bar';
import NaviMenu from './NaviMenu.react';
import * as uiActions from '../../common/ui/actions';

class Header extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    viewer: PropTypes.object,
    onSideMenuChange: PropTypes.func.isRequired,
    toggleSideMenu: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onSideMenuChange = this.onSideMenuChange.bind(this);
  }

  onSideMenuChange(isOpen) {
    const { onSideMenuChange } = this.props;
    onSideMenuChange(isOpen);
  }

  goToDebtors() {
    browserHistory.push(`/debtorList`);
  }

  handleToggle = () => toggleSideMenu();

  render() {
    const { msg, ui, toggleSideMenu } = this.props;

    return (
      <header>
        <AppBar
          title={msg.home}
          className="app-bar"
          onLeftIconButtonTouchTap={toggleSideMenu}
        />
      <NaviMenu open={ui.isSideMenuOpen}/>
      </header>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.app.links,
  ui: state.ui
}), uiActions)(Header);
