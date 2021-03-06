import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import fetch from '../../common/components/fetch';
import { userAction, fetchUsers } from '../../common/users/actions';
import userMessage from '../../common/users/userMessages';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui/Table';
import { Popover, PopoverAnimationFromTop } from 'material-ui/Popover';
import FlatButton from 'material-ui/FlatButton';
import { toggleUserActionPopup, toggleUserActionDialog } from '../../common/ui/actions';
import UserActionDialog from './UserActionDialog.react';
import { cyan500, grey900 } from 'material-ui/styles/colors';


class Users extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    targetUser: PropTypes.object,
    viewer: PropTypes.object.isRequired,
    userActionType: PropTypes.string,
    isUserActionPopupOpen: PropTypes.bool.isRequired,
    toggleUserActionPopup: PropTypes.func.isRequired,
    toggleUserActionDialog: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();
    this.roleCellDataGetter = this.roleCellDataGetter.bind(this);
    this.actionCellRenderer = this.actionCellRenderer.bind(this);
    this.userActionBtnTapped = this.userActionBtnTapped.bind(this);
    this.handleClosePopover = this.handleClosePopover.bind(this);
    this.isUserActive = this.isUserActive.bind(this);
    this.popupTarget = null;
  }

  userActionBtnTapped(e, rowData) {
    const { toggleUserActionPopup } = this.props;
    this.popupTarget = e.target;
    toggleUserActionPopup({
      user: rowData
    });
  }

  handleClosePopover() {
    const { toggleUserActionPopup } = this.props;
    this.popupTarget = null;
    toggleUserActionPopup();
  }

  handleUserAction(e, actionType) {
    const { toggleUserActionDialog, targetUser } = this.props;
    if (actionType !== userAction.newUser) {
      this.handleClosePopover();
    }
    switch (actionType) {
      case userAction.newUser: {
        return toggleUserActionDialog({
          actionType: userAction.newUser,
          user: targetUser,
        });
      }
      case userAction.changePassword: {
        toggleUserActionDialog({
          actionType: userAction.changePassword,
          user: targetUser,
        });
        break;
      }
      case userAction.deactivate: {
        toggleUserActionDialog({
          actionType: userAction.deactivate,
          user: targetUser,
        });
        break;
      }
      case userAction.activate: {
        toggleUserActionDialog({
          actionType: userAction.activate,
          user: targetUser,
        });
        break;
      }
    }
    return null;
  }

  actionCellRenderer(rowData) {
    return (
      <IconButton
        onTouchTap={e => this.userActionBtnTapped(e, rowData)}
      >
        <MoreVertIcon />
      </IconButton>
    );
  }

  roleCellDataGetter(rowData) {
    const { intl } = this.props;
    return rowData.roles.reduce((prev, curr) =>
      prev.concat(intl.formatMessage(userMessage[curr.role])), []).join();
  }

  isUserActive() {
    const { targetUser } = this.props;
    if (targetUser) {
      return targetUser.active;
    }
    return false;
  }

  render() {
    const {
      intl,
      isUserActionPopupOpen,
      users,
      viewer,
    } = this.props;

    const title = intl.formatMessage(userMessage.usersTitle);
    const userList = users ? users.toList() : null;

    const styles = {
      card: {
        width: '100%',
      },
      floatingActionBtn: {
        width: 40,
        height: 40,
      }
    };

    return (
      <div className="users">
        <Helmet title={title} />
        <Card style={styles.card}>
          <CardHeader
            title={intl.formatMessage(userMessage.usersTitle)}
          />
          <CardText>
            <Table
              fixedHeader
              height="300px"
              selectable={false}
            >
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(userMessage.username)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(userMessage.role)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(userMessage.action)}
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userList ? userList.map(user =>
                  (
                    <TableRow key={user.id} style={{
                      textDecoration: user.active ? 'initial' : 'line-through',
                      color: user.username === viewer.username ? cyan500 : grey900,
                    }}
                    >
                      <TableRowColumn>{user.id}</TableRowColumn>
                      <TableRowColumn>{user.username}</TableRowColumn>
                      <TableRowColumn>{this.roleCellDataGetter(user)}</TableRowColumn>
                      <TableRowColumn>{this.actionCellRenderer(user)}</TableRowColumn>
                    </TableRow>
                  )
                ) : null}
              </TableBody>
            </Table>
          </CardText>
          <CardActions style={{ textAlign: 'right' }}>
            <FloatingActionButton
              mini
              style={styles.floatingActionBtn}
              onTouchTap={e => this.handleUserAction(e, userAction.newUser)}
            >
              <ContentAdd />
            </FloatingActionButton>
          </CardActions>
        </Card>
        <Popover
          open={isUserActionPopupOpen}
          anchorEl={this.popupTarget}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.handleClosePopover}
          animation={PopoverAnimationFromTop}
        >
          <div style={styles.popover}>
            <FlatButton
              label={intl.formatMessage(userMessage.changePassword)}
              onTouchTap={e => this.handleUserAction(e, userAction.changePassword)}
              primary
            /><br />
            {
              this.isUserActive() ? (
                <FlatButton
                  label={intl.formatMessage(userMessage.deactivate)}
                  onTouchTap={e => this.handleUserAction(e, userAction.deactivate)}
                  secondary
                />
              ) : (
                <FlatButton
                  label={intl.formatMessage(userMessage.activate)}
                  onTouchTap={e => this.handleUserAction(e, userAction.activate)}
                  primary
                />
              )
            }
          </div>
        </Popover>
        <UserActionDialog />
      </div>
    );
  }

}

Users = fetch(
  fetchUsers,
)(Users);


Users = injectIntl(Users);

export default connect(state => ({
  users: state.users.map,
  targetUser: state.users.targetUser,
  isUserActionPopupOpen: state.ui.isUserActionPopupOpen,
  isUserActionDialogOpen: state.ui.isUserActionDialogOpen,
  userActionType: state.ui.userActionType,
  viewer: state.users.viewer,
}), {
  toggleUserActionPopup,
  toggleUserActionDialog,
})(Users);
