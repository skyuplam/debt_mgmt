import './App.scss';
import Component from 'react-pure-render/component';
import Footer from './Footer.react';
import Header from './Header.react';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import start from '../../common/app/start';
import { connect } from 'react-redux';
// import { onAppComponentDidMount } from '../../common/app/actions';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import { cyan500 } from 'material-ui/lib/styles/colors';
import NotificationSystem from 'react-notification-system';
import { EE } from '../../common/eventEmitter/eventEmitter';

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
  };

  constructor() {
    super();

    this.addNotification = this.addNotification.bind(this);
  }

  componentDidMount() {
    this._notificationSystem = this.refs.notificationSystem;
    EE.on('add/notification', this.addNotification);
  }

  componentWillUnmount() {
    EE.removeListener('add/notification');
  }

  addNotification(notification) {
    this._notificationSystem.addNotification(notification);
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

App = start(App);

export default connect(state => ({
  currentLocale: state.intl.currentLocale
}))(App);
