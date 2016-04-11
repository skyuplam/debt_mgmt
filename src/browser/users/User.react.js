import * as authActions from '../../common/auth/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';


class Users extends Component {

  static propTypes = {
    users: PropTypes.object.isRequired,
    intl: intlShape.isRequired,
  };

  render() {
    const { auth, fields } = this.props;
    const { intl } = this.props;

    return (
      <div>
      </div>
    );
  }

}

Users = injectIntl(Users);

export default connect(state => ({
  auth: state.auth
}), { ...authActions, replace })(Users);
