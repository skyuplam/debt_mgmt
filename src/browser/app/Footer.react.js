import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class Footer extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired
  };

  render() {
    return (
      <footer>
      </footer>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.app.footer
}))(Footer);
