import * as debtorsActions from '../../common/debtors/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
// import Todo from './Todo.react';
import { connect } from 'react-redux';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';


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
    // Big lists should be sorted in reducer.
    const list = debtors.toList().sortBy(item => item.createdAt).toJS();
    const debtorModel = {
      name: { type: String },
      idNumber: { type: String }
    };
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableRowColumn>1</TableRowColumn>
            <TableRowColumn>John Smith</TableRowColumn>
            <TableRowColumn>Employed</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.todos,
  debtors: state.debtors.map
}), debtorsActions)(Debtors);
