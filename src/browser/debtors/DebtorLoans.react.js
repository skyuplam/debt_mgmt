// import './DebtorInfo.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import CardActions from 'material-ui/lib/card/card-actions';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import 'react-virtualized/styles.css';
import RaisedButton from 'material-ui/lib/raised-button';
import NewRepaymentPlan from './NewRepaymentPlan.react';
import { openNewRepyamnetPlanDialog, openLoanDetailDialog } from '../../common/ui/actions';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { fetchLoans } from '../../common/loans/actions';
import { FormattedNumber, FormattedDate } from 'react-intl';
import LoanDetailDialog from './LoanDetailDialog.react';
import { isDate } from 'validator';


class DebtorLoans extends Component {
  static propTypes = {
    msg: PropTypes.object,
    loans: PropTypes.object.isRequired,
    currentLoanId: PropTypes.number,
    openNewRepyamnetPlanDialog: PropTypes.func.isRequired,
    openLoanDetailDialog: PropTypes.func.isRequired,
    debtorId: PropTypes.number.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._onBtnClick = this._onBtnClick.bind(this);
    this._cellRenderer = this._cellRenderer.bind(this);
    this._formatNumberCell = this._formatNumberCell.bind(this);
    this._formatDateCell = this._formatDateCell.bind(this);
    this._formatPercentageCell = this._formatPercentageCell.bind(this);
    this._handleTotalFeeRender = this._handleTotalFeeRender.bind(this);
    this._handleRowClicked = this._handleRowClicked.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  _onBtnClick(loanId) {
    const { openNewRepyamnetPlanDialog } = this.props;
    const { loans } = this.props;
    const loan = loans.get(loanId);
    openNewRepyamnetPlanDialog({ loanId: loan.id });
  }

  _cellRenderer(cellData, cellDataKey, rowData) {
    const { msg } = this.props;
    return (
      <RaisedButton
        label={msg.add}
        secondary
        fullWidth
        onMouseDown={() => this._onBtnClick(rowData.id)}
        disabled={[1, 2, 3].indexOf(cellData) === -1}
      />
    );
  }

  _handleTotalFeeRender(cellData, cellDataKey, rowData) {
    const totalFee = rowData.collectableMgmtFee +
      rowData.collectableHandlingFee +
      rowData.collectableLateFee +
      rowData.collectablePenaltyFee;
    return this._formatNumberCell(totalFee);
  }

  _formatNumberCell(cellData) {
    return (
      <FormattedNumber
        value={cellData}
      />
    );
  }

  _formatDateCell(cellData) {
    const theDate = cellData ? new Date(cellData) : null;
    return (
      <div>
        <FormattedDate
          value={theDate}
        />
      </div>
    );
  }

  _formatPercentageCell(cellData) {
    return (
      <FormattedNumber
        value={cellData}
        style="percent"
      />
    );
  }

  _handleRowClicked(loan) {
    const { openLoanDetailDialog } = this.props;
    openLoanDetailDialog(loan);
  }

  render() {
    const { msg, loans, debtorId } = this.props;
    const loanList = loans.toArray();

    return (
      <Card>
        <CardTitle
          title={`${msg.headerTitle}`}
        />
        <CardActions>
          <AutoSizer disableHeight>
            {({ width }) =>
              <FlexTable
                width={width}
                height={200}
                headerHeight={20}
                rowHeight={36}
                rowsCount={loanList.length}
                rowGetter={index => loanList[index]}
                onRowClick={(rowIdx) => this._handleRowClicked(loanList[rowIdx])}
              >
                <FlexColumn
                  label={msg.originatedAgreementNo}
                  dataKey="originatedAgreementNo"
                  width={100}
                />
                <FlexColumn
                  label={msg.collectablePrincipal}
                  dataKey="collectablePrincipal"
                  cellRenderer={(cellData) => this._formatNumberCell(cellData)}
                  width={80}
                />
                <FlexColumn
                  label={msg.collectableInterest}
                  dataKey="collectableInterest"
                  cellRenderer={(cellData) => this._formatNumberCell(cellData)}
                  width={80}
                />
                <FlexColumn
                  label={msg.totalCollectableFee}
                  dataKey="totalCollectableFee"
                  cellRenderer={this._handleTotalFeeRender}
                  width={100}
                />
                <FlexColumn
                  label={msg.agency}
                  dataKey="agency"
                  width={100}
                />
                <FlexColumn
                  label={msg.placementServicingFeeRate}
                  dataKey="placementServicingFeeRate"
                  cellRenderer={this._formatPercentageCell}
                  width={100}
                />
                <FlexColumn
                  label={msg.placedAt}
                  dataKey="placedAt"
                  cellRenderer={this._formatDateCell}
                  width={100}
                />
                <FlexColumn
                  label={msg.expectedRecalledAt}
                  dataKey="expectedRecalledAt"
                  cellRenderer={this._formatDateCell}
                  width={100}
                />
                <FlexColumn
                  label={msg.repaymentPlan}
                  dataKey="loanStatusId"
                  cellRenderer={this._cellRenderer}
                  width={100}
                />
              </FlexTable>
            }
          </AutoSizer>
          <NewRepaymentPlan
            debtorId={debtorId}
          />
          <LoanDetailDialog />
        </CardActions>
      </Card>
    );
  }

}


export default connect(state => ({
  msg: state.intl.msg.loans,
  currentLoanId: state.ui.currentLoanId,
  loans: state.loans.map,
}), {
  openNewRepyamnetPlanDialog,
  openLoanDetailDialog,
  fetchLoans,
})(DebtorLoans);
