import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/lib/dialog';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { closeLoanDetailDialog } from '../../common/ui/actions';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import GridList from 'material-ui/lib/grid-list/grid-list';
import { FormattedNumber, FormattedDate } from 'react-intl';
import { isDate, isAlphanumeric } from 'validator';

class LoanDetailDialog extends Component {
  static propTypes = {
    msg: PropTypes.object.isRequired,
    closeLoanDetailDialog: PropTypes.func.isRequired,
    isLoanDetailDialogOpen: PropTypes.bool.isRequired,
    loan: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this._formatNumber = this._formatNumber.bind(this);
    this._formatPercentage = this._formatPercentage.bind(this);
    this._formatDate = this._formatDate.bind(this);
  }

  shouldComponentUpdate = shouldPureComponentUpdate;

  _formatNumber(number) {
    return (
      <p>
        <FormattedNumber
          value={number}
        />
      </p>
    );
  }

  _formatPercentage(number) {
    return (
      <p>
        <FormattedNumber
          value={number}
          style="percent"
        />
      </p>
    );
  }

  _formatDate(date) {
    const theDate = date ? Date.parse(date) : null;
    return (
      <p>
        <FormattedDate
          value={theDate}
        />
      </p>
    );
  }

  render() {
    const {
      msg,
      loan,
      isLoanDetailDialogOpen,
      closeLoanDetailDialog,
    } = this.props;

    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {
        width: '100%',
        height: 400,
        overflowY: 'auto',
        marginBottom: 24,
      },
    };

    const daysOfDelinq = Math.round((Date.now() - new Date(loan.delinquentAt)) /
    (1000 * 60 * 60 * 24 * 1));

    return (
      <Dialog
        title={`${msg.loanDetail}-${loan.originatedAgreementNo}`}
        open={isLoanDetailDialogOpen}
        onRequestClose={closeLoanDetailDialog}
      >
        <GridList cellHeight={400} style={styles.gridList}>
          <List>
            <ListItem
              primaryText={msg.amount}
              secondaryText={this._formatNumber(loan.amount)}
            />
            <ListItem
              primaryText={msg.issuedAt}
              secondaryText={this._formatDate(loan.issuedAt)}
            />
            <ListItem
              primaryText={msg.terms}
              secondaryText={loan.terms}
            />
            <ListItem
              primaryText={msg.repaidTerms}
              secondaryText={loan.repaidTerms}
            />
            <ListItem
              primaryText={msg.transferredAt}
              secondaryText={
                this._formatDate(loan.transferredAt)
              }
            />
            <ListItem
              primaryText={`${msg.delinquentAt} - ${daysOfDelinq}${msg.days}`}
              secondaryText={
                this._formatDate(loan.delinquentAt)
              }
            />
            <ListItem
              primaryText={msg.agency}
              secondaryText={loan.agency}
            />
          </List>
          <List>
            <ListItem
              primaryText={msg.collectablePrincipal}
              secondaryText={this._formatNumber(loan.collectablePrincipal)}
            />
            <ListItem
              primaryText={msg.collectableInterest}
              secondaryText={this._formatNumber(loan.collectableInterest)}
            />
            <ListItem
              primaryText={msg.collectableMgmtFee}
              secondaryText={this._formatNumber(loan.collectableMgmtFee)}
            />
            <ListItem
              primaryText={msg.collectableHandlingFee}
              secondaryText={this._formatNumber(loan.collectableHandlingFee)}
            />
            <ListItem
              primaryText={msg.collectableLateFee}
              secondaryText={this._formatNumber(loan.collectableLateFee)}
            />
            <ListItem
              primaryText={msg.collectablePenaltyFee}
              secondaryText={this._formatNumber(loan.collectablePenaltyFee)}
            />
            <ListItem
              primaryText={msg.placementServicingFeeRate}
              secondaryText={this._formatPercentage(loan.placementServicingFeeRate)}
            />
          </List>
        </GridList>
      </Dialog>
    );
  }
}

export default connect(state => ({
  msg: state.intl.msg.loans,
  isLoanDetailDialogOpen: state.ui.isLoanDetailDialogOpen,
  loan: state.ui.currentLoan,
}), {
  closeLoanDetailDialog,
})(LoanDetailDialog);
