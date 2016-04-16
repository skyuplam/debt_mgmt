import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GridList from 'material-ui/GridList/GridList';
import Card from 'material-ui/Card/Card';
import CardActions from 'material-ui/Card/CardActions';
import CardTitle from 'material-ui/Card/CardTitle';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { FormattedDate } from 'react-intl';
import { fetchRepaments } from '../../common/repayments/actions';
import RaisedButton from 'material-ui/RaisedButton';
import RepaymentDialog from './RepaymentDialog.react';
import { openRepaymentDialog } from '../../common/ui/actions';
import { injectIntl, intlShape } from 'react-intl';
import repaymentsMessages from '../../common/repayments/repaymentsMessages';
import moment from 'moment';

class Repayments extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    repaymentPlans: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    debtorId: PropTypes.number,
    fetchRepaments: PropTypes.func.isRequired,
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
    return (
      <div>
        {moment(date).isValid() ? (
          <FormattedDate
            value={moment(date)}
          />
        ) : ''}
      </div>
    );
  }

  _handleRepayAction(rowData) {
    const { openRepaymentDialog } = this.props;
    const repayment = rowData;
    openRepaymentDialog(repayment);
  }

  _cellRenderer(cellData) {
    return (
      <div>
        {moment(cellData).isValid() ? (
          <FormattedDate
            value={moment(cellData)}
          />
        ) : ''}
      </div>
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
    const { intl } = this.props;
    let repaymentbtnLb;
    const repay = intl.formatMessage(repaymentsMessages.repay);
    if (this._checkIfPaid(rowData.repaymentStatusId)) {
      repaymentbtnLb = intl.formatDate(rowData.repaidAt);
    } else {
      repaymentbtnLb = repay;
    }
    return (
      <div>
        <RaisedButton
          label={repaymentbtnLb}
          primary
          fullWidth
          onTouchEnd={() => this._handleRepayAction(rowData)}
          onMouseUp={() => this._handleRepayAction(rowData)}
          disabled={this._checkIfPaid(rowData.repaymentStatusId) ||
            this._isRepaymentPlanCanceledOrCompleted(rowData.repaymentPlanStatus)}
        />
      </div>
    );
  }

  _handleRepaymentPlanRowClick(rowIndex) {
    const { repaymentPlans, fetchRepaments, viewer } = this.props;
    const repaymentPlanList = repaymentPlans ? repaymentPlans.toArray() : [];
    if (repaymentPlanList) {
      const selectedRepaymentPlan = repaymentPlanList[rowIndex];
      fetchRepaments(selectedRepaymentPlan.id, selectedRepaymentPlan.debtorId, viewer);
    }
  }

  render() {
    const { intl, repaymentPlans, repayments, debtorId } = this.props;
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
            <CardTitle title={intl.formatMessage(repaymentsMessages.repaymentPlan)} />
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
                      label={intl.formatMessage(repaymentsMessages.principal)}
                      dataKey="principal"
                      cellRenderer={cellData => intl.formatNumber(cellData)}
                      width={100}
                    />
                    <FlexColumn
                      label={intl.formatMessage(repaymentsMessages.repaidAmount)}
                      dataKey="repaidAmount"
                      cellRenderer={cellData => intl.formatNumber(cellData)}
                      width={100}
                    />
                    <FlexColumn
                      label={intl.formatMessage(repaymentsMessages.terms)}
                      dataKey="terms"
                      width={60}
                    />
                    <FlexColumn
                      label={intl.formatMessage(repaymentsMessages.startedAt)}
                      cellRenderer={this._cellRenderer}
                      dataKey="startedAt"
                      width={100}
                    />
                    <FlexColumn
                      label={intl.formatMessage(repaymentsMessages.status)}
                      cellRenderer={this._cellRenderer}
                      dataKey="repaymentPlanStatusId"
                      cellRenderer={(cellData) =>
                        `${intl.formatMessage(repaymentsMessages['repaymentPlanStatus'+cellData])}`
                      }
                      width={100}
                    />
                  </FlexTable>
                )}
              </AutoSizer>
            </CardActions>
          </Card>
          <Card>
            <CardTitle title={intl.formatMessage(repaymentsMessages.repayments)} />
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
                      label={intl.formatMessage(repaymentsMessages.term)}
                      dataKey="term"
                      width={50}
                    />
                    <FlexColumn
                      label={intl.formatMessage(repaymentsMessages.repaymentAmt)}
                      dataKey="principal"
                      cellRenderer={cellData => intl.formatNumber(cellData)}
                      width={100}
                    />
                    <FlexColumn
                      label={intl.formatMessage(repaymentsMessages.repaidAmount)}
                      dataKey="paidAmount"
                      cellRenderer={cellData => intl.formatNumber(cellData)}
                      width={100}
                    />
                    <FlexColumn
                      label={intl.formatMessage(repaymentsMessages.expectedRepaidAt)}
                      dataKey="expectedRepaidAt"
                      cellRenderer={this._cellRenderer}
                      width={100}
                    />
                    <FlexColumn
                      label={intl.formatMessage(repaymentsMessages.repay)}
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


Repayments = injectIntl(Repayments);

export default connect(state => ({
  repayments: state.repayments.map,
  viewer: state.users.viewer,
}), {
  fetchRepaments,
  openRepaymentDialog,
})(Repayments);
