import Component from 'react-pure-render/component';
import Footer from './Footer.react';
import Header from './Header.react';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import start from '../../common/app/start';
import { connect } from 'react-redux';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { cyan500 } from 'material-ui/styles/colors';
import NotificationSystem from 'react-notification-system';
import { EE } from '../../common/eventEmitter/eventEmitter';
import { logout } from '../../common/auth/actions';
import notifyMessages from '../../common/app/notifyMessages';
import { injectIntl, intlShape } from 'react-intl';


const errorCode = {
  401: 'unauthorized'
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: cyan500,
  },
}, {
  userAgent: 'all',
});

class App extends Component {

  static propTypes = {
    children: PropTypes.object.isRequired,
    currentLocale: PropTypes.string.isRequired,
    location: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();

    this.addNotification = this.addNotification.bind(this);
    this.unauthorized = this.unauthorized.bind(this);
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
    EE.on('add/notification', this.addNotification);
  }

  componentWillUnmount() {
    EE.removeListener('add/notification');
  }

  addNotification(notification) {
    if (this[errorCode[notification.uid]]) {
      notification.onRemove = this[errorCode[notification.uid]];
    }
    const { intl } = this.props;
    const notifyMessageMap = {
      congratuation: {
        title: intl.formatMessage(notifyMessages.congratuation),
        message: intl.formatMessage(notifyMessages.success),
        level: 'success',
      },
      failure: {
        title: intl.formatMessage(notifyMessages.sorry),
        message: intl.formatMessage(notifyMessages.failure),
        level: 'error',
      }
    };

    if (notifyMessageMap[notification.message]) {
      notification = notifyMessageMap[notification.message];
    }

    this._notificationSystem.addNotification(notification);
  }

  unauthorized() {
    const { logout } = this.props;
    logout();
  }

  render() {
    const { children, currentLocale, location } = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="page">
          <Helmet
            htmlAttributes={{ lang: currentLocale }}
          />
          {/* Pass location to ensure header active links are updated. */}
          <Header location={location} />
          {children}
          <Footer />
          <NotificationSystem ref="notificationSystem" />
        </div>
      </MuiThemeProvider>
    );
  }

}

App = injectIntl(App);
App = start(App);

export default connect(state => ({
  currentLocale: state.intl.currentLocale
}), {
  logout
})(App);
