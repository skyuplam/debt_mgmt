import './App.scss';
import Component from 'react-pure-render/component';
import Footer from './Footer.react';
import Header from './Header.react';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { onAppComponentDidMount } from '../../common/app/actions';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/lib/MuiThemeProvider';
import { cyan500 } from 'material-ui/lib/styles/colors';

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
    dispatch: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired
  };

  // Note pattern how actions related to app start are dispatched.
  // componentDidMount is not called in ReactDOMServer.renderToString, so it's
  // the right place to dispatch client only (e.g. Firebase) actions.
  // Firebase can be used on the server as well, but it's over of this example.
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(onAppComponentDidMount());
  }

  render() {
    const { children, location } = this.props;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="page">
          <Helmet/>
          {/* Pass location to ensure header active links are updated. */}
          <Header location={location} />
          {children}
          <Footer />
        </div>
      </MuiThemeProvider>
    );
  }

}

// Just inject dispatch.
export default connect()(App);
