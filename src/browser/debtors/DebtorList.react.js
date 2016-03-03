import * as debtorsActions from '../../common/debtors/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import FlatButton from 'material-ui/lib/flat-button';
import CardActions from 'material-ui/lib/card/card-actions';
import DebtorSearch from './DebtorSearch.react';
import { browserHistory } from 'react-router';


// Container component.
class Debtors extends Component {

  static propTypes = {
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

  constructor(props) {
    super(props);
    this.onRowSelected = this.onRowSelected.bind(this);
  }

  onRowSelected(selectedRow) {
    if(!!!selectedRow.length) return;
    const { debtors } = this.props;
    const debtorId = debtors.toArray()[selectedRow[0]].id;
    browserHistory.push(`/debtors/${debtorId}`);
  }

  render() {
    const { msg, debtors } = this.props;
    // Big lists should be sorted in reducer.
    const list = debtors.toList();

    return (
      <Card>
        <CardHeader title={msg.headerTitle} />
        <CardActions>
          <DebtorSearch />
        </CardActions>
        <CardText>
          <Table
            onRowSelection={this.onRowSelected}>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>{msg.idCard}</TableHeaderColumn>
                <TableHeaderColumn>{msg.name}</TableHeaderColumn>
                <TableHeaderColumn>{msg.originatedAgreementNo}</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(debtor =>
                <TableRow
                  key={debtor.id}>
                  <TableRowColumn>{debtor.idNumber}</TableRowColumn>
                  <TableRowColumn>{debtor.name}</TableRowColumn>
                  <TableRowColumn>{debtor.originatedAgreementNo}</TableRowColumn>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.debtors,
  debtors: state.debtors.map
}), debtorsActions)(Debtors);
