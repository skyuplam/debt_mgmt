import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  required: {
    defaultMessage: `请输入 {prop, select,
      电邮地址 {username}
      密码 {password}
    }.`,
    id: 'auth.login.error.required'
  },
  email: {
    defaultMessage: '电邮地址不正确',
    id: 'auth.login.error.email'
  },
  simplePassword: {
    defaultMessage: '密码长度不能少于 {minLength} 字符.',
    id: 'auth.login.error.simplePassword'
  },
  wrongPassword: {
    defaultMessage: '密码不正确',
    id: 'auth.login.error.wrongPassword'
  }
});

export default class LoginError extends Component {

  static propTypes = {
    error: PropTypes.object
  };

  render() {
    const { error } = this.props;
    if (!error) return null;
    const message = messages[error.name];

    return (
      <p className="error-message">
        {message ?
          <FormattedMessage {...message} values={error.params} />
        :
          error.toString()
        }
      </p>
    );
  }

}
