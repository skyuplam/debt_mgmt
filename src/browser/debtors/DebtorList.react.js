import * as debtorsActions from '../../common/debtors/actions';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui/Table';
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import DebtorSearch from './DebtorSearch.react';
import { push } from 'react-router-redux';
import { injectIntl, intlShape } from 'react-intl';
import debtorsMessages from '../../common/debtors/debtorsMessages';


// Container component.
class Debtors extends Component {

  static propTypes = {
    intl: intlShape.isRequired,
    debtors: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
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
    if (!!!selectedRow.length) return;
    const { debtors, push } = this.props;
    const debtorId = debtors.toArray()[selectedRow[0]].id;
    push(`/debtors/${debtorId}`);
  }

  render() {
    const { intl, debtors } = this.props;
    // Big lists should be sorted in reducer.
    const list = debtors.toList();

    return (
      <Card>
        <CardHeader title={intl.formatMessage(debtorsMessages.headerTitle)} />
        <CardActions>
          <DebtorSearch />
        </CardActions>
        <CardText>
          <Table
            onRowSelection={this.onRowSelected}
          >
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>{intl.formatMessage(debtorsMessages.idCard)}</TableHeaderColumn>
                <TableHeaderColumn>{intl.formatMessage(debtorsMessages.name)}</TableHeaderColumn>
                <TableHeaderColumn>
                  {intl.formatMessage(debtorsMessages.originatedAgreementNo)}
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.map(debtor =>
                <TableRow
                  key={debtor.id}
                >
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

Debtors = injectIntl(Debtors);

export default connect(state => ({
  debtors: state.debtors.map
}), {
  ...debtorsActions,
  push
})(Debtors);
