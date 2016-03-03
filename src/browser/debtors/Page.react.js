// import Buttons from './Buttons.react';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
// import NewTodo from './NewTodo.react';
import React, { PropTypes } from 'react';
import Debtors from './Debtors.react';
import fetch from '../../common/components/fetch';
import { connect } from 'react-redux';
import { fetchDebtors } from '../../common/debtors/actions';

class Page extends Component {

  static propTypes = {
    msg: PropTypes.object,
    children: PropTypes.object
  };

  render() {
    const { msg, children } = this.props;

    return (
      <div className="debtors-page">
        <Helmet title={msg.title} />
        {children || <Debtors />}
      </div>
    );
  }

}

// Truly universal (not only isomorphic) data fetching.
// One higher order component for browser, server, and mobile.
Page = fetch(fetchDebtors)(Page);

export default connect(state => ({
  msg: state.intl.msg.todos
}))(Page);
