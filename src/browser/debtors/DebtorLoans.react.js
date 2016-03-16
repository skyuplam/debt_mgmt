// import './DebtorInfo.scss';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardTitle from 'material-ui/lib/card/card-title';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import 'react-virtualized/styles.css';
import RaisedButton from 'material-ui/lib/raised-button';
import ConfirmDialog from '../common/confirmDialog.react';
import NewRepaymentPlan from './NewRepaymentPlan.react';
import { openNewRepyamnetPlanDialog } from '../../common/ui/actions';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { fetchLoans } from '../../common/loans/actions';
import { FormattedNumber, FormattedDate, IntlMixin } from 'react-intl';


class DebtorLoans extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;
  mixins = [IntlMixin];

  static propTypes = {
    msg: PropTypes.object,
    loans: PropTypes.object.isRequired,
    currentLoanId: PropTypes.number,
    openNewRepyamnetPlanDialog: PropTypes.func.isRequired,
    debtorId: PropTypes.number,
  };

  constructor(props, context) {
    super(props, context);

    this._onBtnClick = this._onBtnClick.bind(this);
    this._cellRenderer = this._cellRenderer.bind(this);
    this._handleNewRepayment = this._handleNewRepayment.bind(this);
    this._formatNumberCell = this._formatNumberCell.bind(this);
    this._formatDateCell = this._formatDateCell.bind(this);
    this._formatPercentageCell = this._formatPercentageCell.bind(this);
    this._handleTotalFeeRender = this._handleTotalFeeRender.bind(this);
  }

  _onBtnClick(loanId) {
    const { openNewRepyamnetPlanDialog } = this.props;
    const { loans } = this.props;
    const loan = loans.get(loanId);
    openNewRepyamnetPlanDialog({ loanId: loan.id });
  }

  _cellRenderer(cellData, cellDataKey, rowData, rowIndex, columnData) {
    const { msg } = this.props;
    return (
      <RaisedButton
        label={msg.add}
        secondary={true}
        fullWidth={true}
        onMouseDown={e => this._onBtnClick(rowData.id)}
        disabled={[1, 2, 3].indexOf(cellData)!=-1?false:true}
      />
    );
  }

  _handleNewRepayment() {

  }

  _handleTotalFeeRender(cellData, cellDataKey, rowData, rowIndex, columnData) {
    const totalFee = rowData.collectableMgmtFee+
      rowData.collectableHandlingFee+
      rowData.collectableLateFee+
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
    return (
      <FormattedDate
        value={new Date(cellData)}
      />
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

  render() {
    const { msg, loans, currentLoanId, debtorId } = this.props;
    const loanList = loans.toArray();

    return (
      <Card>
        <CardTitle
          title={`${msg.headerTitle}`}
        />
        <div >
          <AutoSizer disableHeight>
            {({ width }) =>
              <FlexTable
                width={width}
                height={200}
                headerHeight={20}
                rowHeight={36}
                rowsCount={loanList.length}
                rowGetter={index => loanList[index]}
                >
                <FlexColumn
                  label={msg.originatedAgreementNo}
                  dataKey='originatedAgreementNo'
                  width={100}
                  />
                <FlexColumn
                  label={msg.collectablePrincipal}
                  dataKey='collectablePrincipal'
                  cellRenderer={(cellData) => this._formatNumberCell(cellData)}
                  width={80}
                  />
                <FlexColumn
                  label={msg.collectableInterest}
                  dataKey='collectableInterest'
                  cellRenderer={(cellData) => this._formatNumberCell(cellData)}
                  width={80}
                  />
                <FlexColumn
                  label={msg.totalCollectableFee}
                  dataKey='totalCollectableFee'
                  cellRenderer={this._handleTotalFeeRender}
                  width={100}
                  />
                <FlexColumn
                  label={msg.agency}
                  dataKey='agency'
                  width={100}
                  />
                <FlexColumn
                  label={msg.placementServicingFeeRate}
                  dataKey='placementServicingFeeRate'
                  cellRenderer={this._formatPercentageCell}
                  width={100}
                  />
                <FlexColumn
                  label={msg.placedAt}
                  dataKey='placedAt'
                  cellRenderer={this._formatDateCell}
                  width={100}
                  />
                <FlexColumn
                  label={msg.expectedRecalledAt}
                  dataKey='expectedRecalledAt'
                  cellRenderer={this._formatDateCell}
                  width={100}
                  />
                <FlexColumn
                  label={msg.repaymentPlan}
                  dataKey='loanStatusId'
                  cellRenderer={this._cellRenderer}
                  width={100}
                />
              </FlexTable>
            }
          </AutoSizer>
          <NewRepaymentPlan
            debtorId={debtorId}
            onSubmitNewRepayment={this._handleNewRepayment}
          />
        </div>
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
  fetchLoans,
})(DebtorLoans);
