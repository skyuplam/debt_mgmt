import * as debtorsActions from '../../common/debtors/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
// import Todo from './Todo.react';
import { connect } from 'react-redux';

// Container component.
class Debtors extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    debtors: PropTypes.object.isRequired
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
    const { msg, debtors } = this.props;

    if (!debtors.size) {
      return <p>{msg.empty}</p>;
    }

    // Big lists should be sorted in reducer.
    const list = debtors.toList().sortBy(item => item.createdAt);

    return (
      <ol className="debtors">
        {list.map(debtor =>
          <li key={debtor.id}>
            {debtor.name}
          </li>
        )}
      </ol>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.todos,
  debtors: state.debtors.map
}), debtorsActions)(Debtors);
