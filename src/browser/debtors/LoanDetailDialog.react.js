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
import { injectIntl, intlShape } from 'react-intl';
import loansMessages from '../../common/loans/loansMessages';
import moment from 'moment';

class LoanDetailDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
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
    return (
      <p>
        {moment(date).isValid() ? (
          <FormattedDate
            value={moment(date)}
          />
        ) : ''}
      </p>
    );
  }

  render() {
    const {
      intl,
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
        title={`${intl.formatMessage(loansMessages.loanDetail)}-${loan.originatedAgreementNo}`}
        open={isLoanDetailDialogOpen}
        onRequestClose={closeLoanDetailDialog}
      >
        <GridList cellHeight={400} style={styles.gridList}>
          <List>
            <ListItem
              primaryText={intl.formatMessage(loansMessages.amount)}
              secondaryText={this._formatNumber(loan.amount)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.issuedAt)}
              secondaryText={this._formatDate(loan.issuedAt)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.terms)}
              secondaryText={loan.terms}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.repaidTerms)}
              secondaryText={loan.repaidTerms}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.transferredAt)}
              secondaryText={
                this._formatDate(loan.transferredAt)
              }
            />
            <ListItem
              primaryText={
                // eslint-disable-next-line no-alert, max-len
                `${intl.formatMessage(loansMessages.delinquentAt)} - ${daysOfDelinq}${intl.formatMessage(loansMessages.days)}`
              }
              secondaryText={
                this._formatDate(loan.delinquentAt)
              }
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.agency)}
              secondaryText={loan.agency}
            />
          </List>
          <List>
            <ListItem
              primaryText={intl.formatMessage(loansMessages.collectablePrincipal)}
              secondaryText={this._formatNumber(loan.collectablePrincipal)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.collectableInterest)}
              secondaryText={this._formatNumber(loan.collectableInterest)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.collectableMgmtFee)}
              secondaryText={this._formatNumber(loan.collectableMgmtFee)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.collectableHandlingFee)}
              secondaryText={this._formatNumber(loan.collectableHandlingFee)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.collectableLateFee)}
              secondaryText={this._formatNumber(loan.collectableLateFee)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.collectablePenaltyFee)}
              secondaryText={this._formatNumber(loan.collectablePenaltyFee)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.placementServicingFeeRate)}
              secondaryText={this._formatPercentage(loan.placementServicingFeeRate)}
            />
          </List>
        </GridList>
      </Dialog>
    );
  }
}

LoanDetailDialog = injectIntl(LoanDetailDialog);

export default connect(state => ({
  isLoanDetailDialogOpen: state.ui.isLoanDetailDialogOpen,
  loan: state.ui.currentLoan,
}), {
  closeLoanDetailDialog,
})(LoanDetailDialog);
