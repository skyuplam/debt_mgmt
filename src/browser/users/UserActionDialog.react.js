import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import userMessage from '../../common/users/userMessages';
import { isEmail } from 'validator';
import Dialog from 'material-ui/lib/dialog';
import { toggleUserActionDialog } from '../../common/ui/actions';
import TextField from 'material-ui/lib/text-field';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import { userAction, updateUser, createUser } from '../../common/users/actions';
import FlatButton from 'material-ui/lib/flat-button';


class UserActionDialog extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    user: PropTypes.object,
    fields: PropTypes.object.isRequired,
    userActionType: PropTypes.string,
    isUserActionPopupOpen: PropTypes.bool.isRequired,
    isUserActionDialogOpen: PropTypes.bool.isRequired,
    setField: PropTypes.func.isRequired,
    toggleUserActionDialog: PropTypes.func.isRequired,
    updateUser: PropTypes.func.isRequired,
    createUser: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();
    this.handleSubmitUserAction = this.handleSubmitUserAction.bind(this);
    this.renderDialogContent = this.renderDialogContent.bind(this);
    this.handleSelectRole = this.handleSelectRole.bind(this);
    this.validateFormInput = this.validateFormInput.bind(this);
    this.dismissDialog = this.dismissDialog.bind(this);
  }

  dismissDialog() {
    const { toggleUserActionDialog, fields } = this.props;

    fields.$reset();
    toggleUserActionDialog();
  }

  validateFormInput() {
    const { fields, userActionType } = this.props;

    const username = fields.username.value.trim();
    const email = fields.email.value.trim();
    const password = fields.password.value.trim();
    const oldPassword = fields.oldPassword.value.trim();
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
      case userAction.changeSelfPassword: {
        return oldPassword &&
          password &&
          confirmPassword &&
          oldPassword !== password &&
          password === confirmPassword;
      }
      case userAction.changePassword: {
        return password && confirmPassword && password === confirmPassword;
      }
      case userAction.deactivate:
      case userAction.activate: {
        return true;
      }
      default:
        return false;
    }
  }

  handleSelectRole(e, index, value) {
    const { setField } = this.props;
    setField(['userMgmt', 'role'], value);
  }

  handleSubmitUserAction() {
    const {
      userActionType,
      updateUser,
      createUser,
      viewer,
      user,
      fields,
    } = this.props;
    const username = fields.username.value.trim();
    const email = fields.email.value.trim();
    const password = fields.password.value.trim();
    const oldPassword = fields.oldPassword.value.trim();
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
      case userAction.changeSelfPassword: {
        updateUser({
          user: {
            id: user.id,
            oldPassword,
            password,
          }
        }, viewer);
        break;
      }
      case userAction.changePassword: {
        updateUser({
          user: {
            id: user.id,
            password,
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

  renderDialogContent() {
    const { intl, fields, userActionType, user } = this.props;

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

    const oldPasswordField = (
        <div>
          <TextField
            hintText={intl.formatMessage(userMessage.oldPassword)}
            type="password"
            {...fields.oldPassword}
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
      case userAction.changeSelfPassword: {
        content = (
          <div>
            {oldPasswordField}
            {passwordField}
            {confirmPasswordField}
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
      isUserActionDialogOpen,
      user,
    } = this.props;

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
    let username = '';
    if (user) {
      username = ` - ${user.username}`;
    }
    const title = `${intl.formatMessage(userMessage.userAction)}${username}`;

    return (
      <div>
        <Helmet title={title} />
        <Dialog
          title={title}
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

UserActionDialog = fields(UserActionDialog, {
  path: 'userMgmt',
  fields: ['username', 'email', 'oldPassword', 'password', 'confirmPassword', 'role']
});

UserActionDialog = injectIntl(UserActionDialog);

export default connect(state => ({
  isUserActionPopupOpen: state.ui.isUserActionPopupOpen,
  isUserActionDialogOpen: state.ui.isUserActionDialogOpen,
  userActionType: state.ui.userActionType,
  viewer: state.users.viewer,
  user: state.users.targetUser,
}), {
  updateUser,
  createUser,
  toggleUserActionDialog,
  setField,
})(UserActionDialog);
