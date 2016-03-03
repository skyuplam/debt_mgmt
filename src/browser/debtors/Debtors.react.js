import * as debtorsActions from '../../common/debtors/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DebtorList from './DebtorList.react';


// Container component.
class Debtors extends Component {

  static propTypes = {
    children: PropTypes.object,
    msg: PropTypes.object.isRequired,
    debtors: PropTypes.object.isRequired,
  };

  // Example how to measure component update.
  // componentWillUpdate() {
  //   this.start = Date.now();
  // }

  // componentDidUpdate() {
  //   const total = Date.now() - this.start;
  //   console.log(`[ESTE] Todos updated in ${total}ms`);
  // }

  render() {
    const { children, msg, debtors } = this.props;

    return (
      <div>
        <DebtorList />
      </div>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.debtors,
  debtors: state.debtors.map
}), debtorsActions)(Debtors);
