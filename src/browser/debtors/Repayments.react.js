import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GridList from 'material-ui/lib/grid-list/grid-list';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import CardTitle from 'material-ui/lib/card/card-title';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { FormattedDate, IntlMixin } from 'react-intl';
import { fetchRepaments } from '../../common/repayments/actions';
import RaisedButton from 'material-ui/lib/raised-button';

class Repayments extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;
  mixins = [IntlMixin];

  static propTypes = {
    msg: PropTypes.object.isRequired,
    repaymentPlans: PropTypes.object.isRequired,
    debtorId: PropTypes.number,
    fetchRepaments: PropTypes.func.isRequired,
    repayments: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._cellRenderer = this._cellRenderer.bind(this);
    this._handleRepaymentPlanRowClick = this._handleRepaymentPlanRowClick.bind(this);
    this._handleRepaymentCellRender = this._handleRepaymentCellRender.bind(this);
  }

  _cellRenderer(cellData, cellDataKey, rowData, rowIndex, columnData) {
    return (
      <FormattedDate
        value={cellData}
      />
    );
  }

  _handleRepaymentCellRender(cellData, cellDataKey, rowData, rowIndex, columnData) {
    const { msg } = this.props;
    return (
      <RaisedButton
        label={msg.repay}
        primary={true}
        fullWidth={true}
      />
    );
  }

  _handleRepaymentPlanRowClick(rowIndex) {
    const { repaymentPlans, fetchRepaments } = this.props;
    const repaymentPlanList = repaymentPlans?repaymentPlans.toArray():[];
    if (repaymentPlanList) {
      const selectedRepaymentPlan = repaymentPlanList[rowIndex];
      console.log(selectedRepaymentPlan);

      fetchRepaments(selectedRepaymentPlan.id, selectedRepaymentPlan.debtorId);
    }
  }

  render() {
    const { msg, repaymentPlans, repayments } = this.props;
    const repaymentPlanList = repaymentPlans?repaymentPlans.toArray():[];
    const repaymentList = repayments?repayments.filter(repayment => {
      return repaymentPlans.find(repaymentPlan =>
        repaymentPlan.id == repayment.repaymentPlanId
      );
    }).toArray():[];
    return (
      <div className="repayment">
        <GridList
          cellHeight={400}
          padding={0}
        >
          <Card>
            <CardTitle title={msg.repaymentPlan} />
            <div>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <FlexTable
                    width={width}
                    height={300}
                    headerHeight={36}
                    rowHeight={36}
                    rowsCount={repaymentPlanList.length}
                    rowGetter={index => repaymentPlanList[index]}
                    onRowClick={this._handleRepaymentPlanRowClick}
                  >
                    <FlexColumn
                      label={'ID'}
                      dataKey='id'
                      width={120}
                    />
                    <FlexColumn
                      label={msg.principal}
                      dataKey='principal'
                      width={120}
                    />
                    <FlexColumn
                      label={msg.terms}
                      dataKey='terms'
                      width={120}
                    />
                    <FlexColumn
                      label={msg.startedAt}
                      cellRenderer={this._cellRenderer}
                      dataKey='startedAt'
                      width={100}
                    />
                  </FlexTable>
                )}
              </AutoSizer>
            </div>
          </Card>
          <Card>
            <CardTitle title={msg.repayments} />
            <div>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <FlexTable
                    width={width}
                    height={300}
                    headerHeight={36}
                    rowHeight={36}
                    rowsCount={repaymentList.length}
                    rowGetter={index => repaymentList[index]}
                  >
                    <FlexColumn
                      label={msg.term}
                      dataKey='term'
                      width={50}
                    />
                    <FlexColumn
                      label={msg.repaymentAmt}
                      dataKey='principal'
                      width={100}
                    />
                    <FlexColumn
                      label={msg.expectedRepaidAt}
                      dataKey='expectedRepaidAt'
                      cellRenderer={this._cellRenderer}
                      width={100}
                    />
                    <FlexColumn
                      label={msg.repaymentStatus}
                      dataKey='status'
                      width={80}
                    />
                    <FlexColumn
                      label={msg.repay}
                      cellRenderer={this._handleRepaymentCellRender}
                      width={100}
                    />
                  </FlexTable>
                )}
              </AutoSizer>
            </div>
          </Card>
        </GridList>
      </div>
    );
  }

}


export default connect(state => ({
  msg: state.intl.msg.repayments,
  repayments: state.repayments.map,
}), {
  fetchRepaments
})(Repayments);
