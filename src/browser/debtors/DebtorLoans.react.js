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
import * as uiActions from '../../common/ui/actions';
import shouldPureComponentUpdate from 'react-pure-render/function';


class DebtorLoans extends Component {
  shouldPureComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    msg: PropTypes.object,
    loans: PropTypes.object.isRequired,
    currentLoanId: PropTypes.number,
    openNewRepyamnetPlanDialog: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this._onBtnClick = this._onBtnClick.bind(this);
    this._cellRenderer = this._cellRenderer.bind(this);
    this._onConfirmSubmitNewPaymentPlan = this._onConfirmSubmitNewPaymentPlan.bind(this);
  }

  _onBtnClick(loanId) {
    const { openNewRepyamnetPlanDialog } = this.props;
    const { loans } = this.props;
    const loan = loans.get(loanId);
    openNewRepyamnetPlanDialog({ loanId: loan.id });
  }

  _cellRenderer(loanId) {
    const { msg } = this.props;
    return (
      <RaisedButton
        label={msg.add}
        secondary={true}
        fullWidth={true}
        onMouseDown={e => this._onBtnClick(loanId)}
      />
    );
  }

  _onConfirmSubmitNewPaymentPlan() {

  }

  render() {
    const { msg, loans, currentLoanId } = this.props;
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
  currentLoanId: state.ui.currentLoanId,
  loans: state.loans.map,
}), uiActions)(DebtorLoans);
