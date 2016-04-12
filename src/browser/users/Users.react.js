import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import fetch from '../../common/components/fetch';
import { userAction, fetchUsers } from '../../common/users/actions';
import userMessage from '../../common/users/userMessages';
import IconButton from 'material-ui/lib/icon-button';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import Table from 'material-ui/lib/table/table';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import TableHeader from 'material-ui/lib/table/table-header';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';
import FlatButton from 'material-ui/lib/flat-button';
import { toggleUserActionPopup, toggleUserActionDialog } from '../../common/ui/actions';
import UserActionDialog from './UserActionDialog.react';


class Users extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    selectedUserId: PropTypes.number,
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
    toggleUserActionPopup(rowData.id);
  }

  handleClosePopover() {
    const { toggleUserActionPopup } = this.props;
    this.popupTarget = null;
    toggleUserActionPopup();
  }

  handleUserAction(e, actionType) {
    const { toggleUserActionDialog } = this.props;

    switch (actionType) {
      case userAction.newUser: {
        return toggleUserActionDialog(userAction.newUser);
      }
      case userAction.changePassword: {
        toggleUserActionDialog(userAction.changePassword);
        break;
      }
      case userAction.deactivate: {
        toggleUserActionDialog(userAction.deactivate);
        break;
      }
      case userAction.activate: {
        toggleUserActionDialog(userAction.activate);
        break;
      }
    }
    return this.handleClosePopover();
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
    const { users, selectedUserId } = this.props;
    if (users && selectedUserId && users.get(selectedUserId)) {
      return users.get(selectedUserId).active;
    }
    return false;
  }

  render() {
    const {
      intl,
      isUserActionPopupOpen,
      users,
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
                      textDecoration: user.active ? 'initial' : 'line-through'
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
  isUserActionPopupOpen: state.ui.isUserActionPopupOpen,
  isUserActionDialogOpen: state.ui.isUserActionDialogOpen,
  userActionType: state.ui.userActionType,
  selectedUserId: state.ui.selectedUserId,
  viewer: state.users.viewer,
}), {
  toggleUserActionPopup,
  toggleUserActionDialog,
})(Users);
