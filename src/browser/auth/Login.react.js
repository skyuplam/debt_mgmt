import './Login.scss';
import * as authActions from '../../common/auth/actions';
import Component from 'react-pure-render/component';
import LoginError from './LoginError.react';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { fields } from '../../common/lib/redux-fields';
import { browserHistory } from 'react-router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { EE } from '../../common/eventEmitter/eventEmitter';
import { focusInvalidField } from '../../common/lib/validation';

const messages = defineMessages({
  formLegend: {
    defaultMessage: '用户登录',
    id: 'auth.login.formLegend'
  },
  usernamePlaceholder: {
    defaultMessage: '用户名',
    id: 'auth.login.usernamePlaceholder'
  },
  passwordPlaceholder: {
    defaultMessage: '密码',
    id: 'auth.login.passwordPlaceholder'
  },
  loginButton: {
    defaultMessage: '登录',
    id: 'auth.login.loginButton'
  },
});

class Login extends Component {

  static propTypes = {
    auth: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
    location: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.redirectAfterLogin = this.redirectAfterLogin.bind(this);
  }

  componentDidMount() {
    EE.on('auth/loginSuccess', this.redirectAfterLogin);
  }

  componentWillUnmount() {
    EE.removeListener('auth/loginSuccess');
  }

  async onFormSubmit(e) {
    e.preventDefault();
    const { login, fields } = this.props;
    try {
      await login(fields.$values());
    } catch (error) {
      focusInvalidField(this, error.reason);
      return;
    }
    this.redirectAfterLogin();
  }

  redirectAfterLogin() {
    const { location } = this.props;
    const nextPathname = location.state && location.state.nextPathname || '/';
    browserHistory.replace(nextPathname);
  }

  render() {
    const { auth, fields } = this.props;
    const { intl } = this.props;
    const usernamePlaceholder = intl.formatMessage(messages.usernamePlaceholder);
    const passwordPlaceholder = intl.formatMessage(messages.passwordPlaceholder);

    return (
      <div className="login">
        <form onSubmit={this.onFormSubmit}>
          <fieldset disabled={auth.formDisabled}>
            <legend>
              <FormattedMessage {...messages.formLegend} />
            </legend>
            <TextField
              maxLength="100"
              floatingLabelText={usernamePlaceholder}
              {...fields.username}
            />
            <br />
            <TextField
              maxLength="300"
              floatingLabelText={passwordPlaceholder}
              type="password"
              {...fields.password}
            />
            <br />
            <RaisedButton
              label={intl.formatMessage(messages.loginButton)}
              type="submit"
              primary
            />
            <LoginError error={auth.formError} />
          </fieldset>
        </form>
      </div>
    );
  }

}

Login = fields(Login, {
  path: 'auth',
  fields: ['username', 'password']
});

Login = injectIntl(Login);

export default connect(state => ({
  auth: state.auth
}), { ...authActions })(Login);
