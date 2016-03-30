import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GridList from 'material-ui/lib/grid-list/grid-list';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardTitle from 'material-ui/lib/card/card-title';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { FormattedDate } from 'react-intl';
import { fetchRepaments, payRepayment } from '../../common/repayments/actions';
import RaisedButton from 'material-ui/lib/raised-button';
import RepaymentDialog from './RepaymentDialog.react';
import { openRepaymentDialog } from '../../common/ui/actions';


class Repayments extends Component {
  static propTypes = {
    msg: PropTypes.object.isRequired,
    repaymentPlans: PropTypes.object.isRequired,
    debtorId: PropTypes.number,
    fetchRepaments: PropTypes.func.isRequired,
    payRepayment: PropTypes.func.isRequired,
    openRepaymentDialog: PropTypes.func.isRequired,
    repayments: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._cellRenderer = this._cellRenderer.bind(this);
    this._handleRepaymentPlanRowClick = this._handleRepaymentPlanRowClick.bind(this);
    this._handleRepaymentCellRender = this._handleRepaymentCellRender.bind(this);
    this._handleRepayAction = this._handleRepayAction.bind(this);
    this._checkIfPaid = this._checkIfPaid.bind(this);
    this._isRepaymentPlanCanceledOrCompleted = this._isRepaymentPlanCanceledOrCompleted.bind(this);
    this.formatdate = this.formatdate.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  formatdate(date) {
    const theDate = date ? new Date(date) : null;
    return (
      <p>
        <FormattedDate
          value={theDate}
        />
      </p>
    );
  }

  _handleRepayAction(rowData) {
    const { openRepaymentDialog } = this.props;
    const repayment = rowData;
    openRepaymentDialog(repayment);
  }

  _cellRenderer(cellData) {
    const date = cellData ? new Date(cellData) : null;
    return (
      <FormattedDate
        value={date}
      />
    );
  }

  _checkIfPaid(status) {
    // Repayment Status ID 3: Paid
    return [3, 4, 5, 6].indexOf(status) !== -1;
  }

  _isRepaymentPlanCanceledOrCompleted(repaymentPlanStatus) {
    return repaymentPlanStatus === 'Canceled' || repaymentPlanStatus === 'Completed';
  }

  _handleRepaymentCellRender(cellData, cellDataKey, rowData) {
    const { msg } = this.props;
    let repaymentbtnLb;

    if (this._checkIfPaid(rowData.repaymentStatusId)) {
      repaymentbtnLb = this.formatdate(rowData.repaidAt);
    } else {
      repaymentbtnLb = msg.repay;
    }
    return (
      <div>
        <RaisedButton
          label={repaymentbtnLb}
          primary
          fullWidth
          onTouchEnd={e => this._handleRepayAction(rowData)}
          onMouseUp={e => this._handleRepayAction(rowData)}
          disabled={this._checkIfPaid(rowData.repaymentStatusId) ||
            this._isRepaymentPlanCanceledOrCompleted(rowData.repaymentPlanStatus)}
        />
      </div>
    );
  }

  _handleRepaymentPlanRowClick(rowIndex) {
    const { repaymentPlans, fetchRepaments } = this.props;
    const repaymentPlanList = repaymentPlans ? repaymentPlans.toArray() : [];
    if (repaymentPlanList) {
      const selectedRepaymentPlan = repaymentPlanList[rowIndex];
      fetchRepaments(selectedRepaymentPlan.id, selectedRepaymentPlan.debtorId);
    }
  }

  render() {
    const { msg, repaymentPlans, repayments, debtorId } = this.props;
    const repaymentPlanList = repaymentPlans ? repaymentPlans.toArray() : [];
    const repaymentList = repayments ? repayments.filter(repayment =>
      repaymentPlans.find(repaymentPlan =>
        repaymentPlan.id === repayment.repaymentPlanId
      )
    ).toArray() : [];
    return (
      <div className="repayment">
        <GridList
          cellHeight={386}
          padding={1}
        >
          <Card>
            <CardTitle title={msg.repaymentPlan} />
            <CardActions>
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
                      dataKey="id"
                      width={100}
                    />
                    <FlexColumn
                      label={msg.principal}
                      dataKey="principal"
                      width={100}
                    />
                    <FlexColumn
                      label={msg.terms}
                      dataKey="terms"
                      width={60}
                    />
                    <FlexColumn
                      label={msg.startedAt}
                      cellRenderer={this._cellRenderer}
                      dataKey="startedAt"
                      width={100}
                    />
                    <FlexColumn
                      label={msg.status}
                      cellRenderer={this._cellRenderer}
                      dataKey="repaymentPlanStatusId"
                      cellRenderer={(cellData) => `${msg['repaymentPlanStatus'+cellData]}`}
                      width={100}
                    />
                  </FlexTable>
                )}
              </AutoSizer>
            </CardActions>
          </Card>
          <Card>
            <CardTitle title={msg.repayments} />
            <CardActions>
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
                      dataKey="term"
                      width={50}
                    />
                    <FlexColumn
                      label={msg.repaymentAmt}
                      dataKey="principal"
                      width={100}
                    />
                    <FlexColumn
                      label={msg.expectedRepaidAt}
                      dataKey="expectedRepaidAt"
                      cellRenderer={this._cellRenderer}
                      width={100}
                    />
                    <FlexColumn
                      label={msg.repaymentStatus}
                      dataKey="repaymentStatusId"
                      cellRenderer={(cellData) => `${msg['repaymentStatus'+cellData]}`}
                      width={80}
                    />
                    <FlexColumn
                      label={msg.repay}
                      dataKey="id"
                      cellRenderer={this._handleRepaymentCellRender}
                      width={100}
                    />
                  </FlexTable>
                )}
              </AutoSizer>
            </CardActions>
          </Card>
        </GridList>
        <RepaymentDialog debtorId={parseInt(debtorId, 10)} />
      </div>
    );
  }

}


export default connect(state => ({
  msg: state.intl.msg.repayments,
  repayments: state.repayments.map,
}), {
  fetchRepaments,
  payRepayment,
  openRepaymentDialog,
})(Repayments);
