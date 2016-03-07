// import './DebtorInfo.scss';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import 'react-virtualized/styles.css';
import RaisedButton from 'material-ui/lib/raised-button';
import ConfirmDialog from '../common/confirmDialog.react';
import NewRepaymentPlan from './NewRepaymentPlan.react';
import * as uiActions from '../../common/ui/actions';
import shouldPureComponentUpdate from 'react-pure-render/function';


class DebtorLoans extends Component {
  shouldPureComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    msg: PropTypes.object,
    loans: PropTypes.object.isRequired,
    openConfirmDialog: PropTypes.func.isRequired,
    openNewRepyamnetPlanDialog: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._onBtnClick = this._onBtnClick.bind(this);
    this._cellRenderer = this._cellRenderer.bind(this);
    this._onConfirm = this._onConfirm.bind(this);
    this._onConfirmSubmitNewPaymentPlan = this._onConfirmSubmitNewPaymentPlan.bind(this);
  }

  _onBtnClick(rowIndex) {
    const { openConfirmDialog } = this.props;
    console.log(rowIndex);
    openConfirmDialog();
  }

  _cellRenderer(rowIndex) {
    const { msg } = this.props;
    return (
      <RaisedButton
        label={msg.add}
        secondary={true}
        fullWidth={true}
        onMouseDown={e => this._onBtnClick(rowIndex)}
      />
    );
  }

  _onConfirm() {
    const { openNewRepyamnetPlanDialog } = this.props;
    openNewRepyamnetPlanDialog();
  }

  _onConfirmSubmitNewPaymentPlan() {

  }

  render() {
    const { msg, loans } = this.props;
    const loanList = loans.toArray();

    return (
      <Card>
        <CardHeader
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
                  width={150}
                  />
                <FlexColumn
                  label={msg.amount}
                  dataKey='amount'
                  width={100}
                  />
                <FlexColumn
                  label={msg.terms}
                  dataKey='terms'
                  width={100}
                  />
                <FlexColumn
                  label={msg.repaidTerms}
                  dataKey='repaidTerms'
                  width={100}
                  />
                <FlexColumn
                  label={msg.collectablePrincipal}
                  dataKey='collectablePrincipal'
                  width={100}
                  />
                <FlexColumn
                  label={msg.collectableInterest}
                  dataKey='collectableInterest'
                  width={100}
                  />
                <FlexColumn
                  label={msg.collectableMgmtFee}
                  dataKey='collectableMgmtFee'
                  width={100}
                  />
                <FlexColumn
                  label={msg.collectableHandlingFee}
                  dataKey='collectableHandlingFee'
                  width={100}
                  />
                <FlexColumn
                  label={msg.collectableLateFee}
                  dataKey='collectableLateFee'
                  width={100}
                  />
                <FlexColumn
                  label={msg.collectablePenaltyFee}
                  dataKey='collectablePenaltyFee'
                  width={100}
                  />
                <FlexColumn
                  label={msg.repaymentPlan}
                  dataKey='id'
                  cellRenderer={this._cellRenderer}
                  width={100}
                />
              </FlexTable>
            }
          </AutoSizer>
          <ConfirmDialog
            title={msg.confirmNewRepaymentPlanTitle}
            content={msg.confirmNewRepaymentPlanContent}
            onConfirm={this._onConfirm}
          />
          <NewRepaymentPlan
            onConfirmSubmit={this._onConfirmSubmitNewPaymentPlan}
          />
        </div>
      </Card>
    );
  }

}


export default connect(state => ({
  msg: state.intl.msg.loans,
  loans: state.loans.map
}), uiActions)(DebtorLoans);
