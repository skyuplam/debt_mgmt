import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import fetch from '../../common/components/fetch';
import { fetchUsers, updateUser, createUser } from '../../common/users/actions';
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
import Dialog from 'material-ui/lib/dialog';
import Popover from 'material-ui/lib/popover/popover';
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top';
import FlatButton from 'material-ui/lib/flat-button';
import { toggleUserActionPopup, toggleUserActionDialog } from '../../common/ui/actions';
import TextField from 'material-ui/lib/text-field';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { isEmail } from 'validator';


const userAction = {
  newUser: 'newUser',
  changePassword: 'changePassword',
  deactivate: 'deactivate',
  activate: 'activate',
};


class Users extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    selectedUserId: PropTypes.number,
    userActionType: PropTypes.string,
    isUserActionPopupOpen: PropTypes.bool.isRequired,
    isUserActionDialogOpen: PropTypes.bool.isRequired,
    toggleUserActionPopup: PropTypes.func.isRequired,
    setField: PropTypes.func.isRequired,
    toggleUserActionDialog: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();
    this.roleCellDataGetter = this.roleCellDataGetter.bind(this);
    this.actionCellRenderer = this.actionCellRenderer.bind(this);
    this.userActionBtnTapped = this.userActionBtnTapped.bind(this);
    this.handleUserAction = this.handleUserAction.bind(this);
    this.handleSubmitUserAction = this.handleSubmitUserAction.bind(this);
    this.renderDialogContent = this.renderDialogContent.bind(this);
    this.handleClosePopover = this.handleClosePopover.bind(this);
    this.handleSelectRole = this.handleSelectRole.bind(this);
    this.validateFormInput = this.validateFormInput.bind(this);
    this.dismissDialog = this.dismissDialog.bind(this);
    this.isUserActive = this.isUserActive.bind(this);
    this.popupTarget = null;
  }

  userActionBtnTapped(e, rowData) {
    const { toggleUserActionPopup } = this.props;
    this.popupTarget = e.target;
    toggleUserActionPopup(rowData.id);
  }

  dismissDialog() {
    const { toggleUserActionDialog, fields } = this.props;

    fields.$reset();
    toggleUserActionDialog();
  }

  handleSelectRole(e, index, value) {
    const { setField } = this.props;
    setField(['userMgmt', 'role'], value);
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

  handleSubmitUserAction() {
    const {
      userActionType,
      users,
      selectedUserId,
      updateUser,
      createUser,
      viewer,
      fields,
    } = this.props;
    const user = users.get(selectedUserId);
    const username = fields.username.value.trim();
    const email = fields.email.value.trim();
    const password = fields.password.value.trim();
    const role = fields.role.value;

    switch (userActionType) {
      case userAction.newUser: {
        createUser({
          user: {
            username,
            email,
            password,
            role
          }
        }, viewer);
        break;
      }
      case userAction.changePassword: {
        updateUser({
          user: {
            id: user.id,
            newPassword: password,
          }
        }, viewer);
        break;
      }
      case userAction.deactivate: {
        updateUser({
          user: {
            id: user.id,
            active: false
          }
        }, viewer);
        break;
      }
      case userAction.activate: {
        updateUser({
          user: {
            id: user.id,
            active: true
          }
        }, viewer);
        break;
      }
    }

    this.dismissDialog();
  }

  isUserActive() {
    const { users, selectedUserId } = this.props;
    if (users && selectedUserId && users.get(selectedUserId)) {
      return users.get(selectedUserId).active;
    }
    return false;
  }

  validateFormInput() {
    const { fields, userActionType } = this.props;

    const username = fields.username.value.trim();
    const email = fields.email.value.trim();
    const password = fields.password.value.trim();
    const confirmPassword = fields.confirmPassword.value.trim();
    const role = fields.role.value;

    switch (userActionType) {
      case userAction.newUser: {
        return (username &&
          email &&
          password &&
          role &&
          confirmPassword &&
          password === confirmPassword &&
          isEmail(email)
        );
      }
      case userAction.changePassword: {
        return username && password && confirmPassword && password === confirmPassword;
      }
      case userAction.deactivate:
      case userAction.activate: {
        return true;
      }
      default:
        return false;
    }
  }

  renderDialogContent() {
    const { intl, fields, userActionType, selectedUserId, users } = this.props;
    const user = users.get(selectedUserId);
    let content = (<div></div>);

    const passwordField = (
        <div>
          <TextField
            hintText={intl.formatMessage(userMessage.password)}
            type="password"
            {...fields.password}
          /><br />
        </div>
      );

    const confirmPasswordField = (
        <div>
          <TextField
            hintText={intl.formatMessage(userMessage.confirmPassword)}
            type="password"
            {...fields.confirmPassword}
          /><br />
        </div>
      );

    switch (userActionType) {
      case userAction.newUser: {
        content = (
          <div>
            <TextField
              hintText={intl.formatMessage(userMessage.username)}
              {...fields.username}
            /><br />
            <TextField
              hintText={intl.formatMessage(userMessage.email)}
              {...fields.email}
            /><br />
            {passwordField}
            {confirmPasswordField}
            <SelectField
              hintText={intl.formatMessage(userMessage.role)}
              value={fields.role.value}
              onChange={this.handleSelectRole}
            >
              <MenuItem
                value={'user'}
                primaryText={intl.formatMessage(userMessage.user)}
              />
              <MenuItem
                value={'manager'}
                primaryText={intl.formatMessage(userMessage.manager)}
              />
              <MenuItem
                value={'admin'}
                primaryText={intl.formatMessage(userMessage.admin)}
              />
            </SelectField>
          </div>
        );
        break;
      }
      case userAction.changePassword: {
        content = (
          <div>
            {passwordField}
            {confirmPasswordField}
          </div>
        );
        break;
      }
      case userAction.deactivate: {
        content = (
          <div>
            {intl.formatMessage(userMessage.confirmUser, {
              act: intl.formatMessage(userMessage.deactivate),
              username: user.username
            })}
          </div>
        );
        break;
      }
      case userAction.activate: {
        content = (
          <div>
            <div>
              {intl.formatMessage(userMessage.confirmUser, {
                act: intl.formatMessage(userMessage.activate),
                username: user.username
              })}
            </div>
          </div>
        );
        break;
      }
    }
    return content;
  }

  render() {
    const {
      intl,
      isUserActionPopupOpen,
      users,
      isUserActionDialogOpen,
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

    const actions = [
      <FlatButton
        label={intl.formatMessage(userMessage.cancel)}
        secondary
        onTouchTap={() => this.dismissDialog()}
      />,
      <FlatButton
        label={intl.formatMessage(userMessage.submit)}
        primary
        keyboardFocused
        disabled={!this.validateFormInput()}
        onTouchTap={() => this.handleSubmitUserAction()}
      />,
    ];

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
        <Dialog
          title={intl.formatMessage(userMessage.userAction)}
          actions={actions}
          modal
          open={isUserActionDialogOpen}
          onRequestClose={() => this.dismissDialog()}
        >
          {this.renderDialogContent()}
        </Dialog>
      </div>
    );
  }

}

Users = fetch(
  fetchUsers,
)(Users);

Users = fields(Users, {
  path: 'userMgmt',
  fields: ['username', 'email', 'password', 'confirmPassword', 'role']
});

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
  updateUser,
  createUser,
  toggleUserActionDialog,
  setField,
})(Users);
