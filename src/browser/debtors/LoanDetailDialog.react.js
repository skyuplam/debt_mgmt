import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import shouldPureComponentUpdate from 'react-pure-render/function';
import {
  closeLoanDetailDialog,
  togglePostponeRecallDialoag,
} from '../../common/ui/actions';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import GridList from 'material-ui/GridList/GridList';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { postponePlacementRecall } from '../../common/loans/actions';
import { FormattedNumber, FormattedDate, injectIntl, intlShape } from 'react-intl';
import loansMessages from '../../common/loans/loansMessages';
import {
  getInterestAfterCutoff,
  getLateFeeAfterCutoff,
  getServicingFee,
  getTotalAmount,
  getOriginator,
  getAgencyName,
  getServicingFeeRate,
  getPlacement,
} from '../../common/loans/loan';
import moment from 'moment';

class LoanDetailDialog extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    closeLoanDetailDialog: PropTypes.func.isRequired,
    togglePostponeRecallDialoag: PropTypes.func.isRequired,
    postponePlacementRecall: PropTypes.func.isRequired,
    setField: PropTypes.func.isRequired,
    isLoanDetailDialogOpen: PropTypes.bool.isRequired,
    loan: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    isPostponeRecallDialogOpen: PropTypes.bool.isRequired,
    debtorId: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props);

    this._formatNumber = this._formatNumber.bind(this);
    this._formatPercentage = this._formatPercentage.bind(this);
    this._formatDate = this._formatDate.bind(this);
    this.isValidRecallDate = this.isValidRecallDate.bind(this);
    this.sendPostponeRecallRequest = this.sendPostponeRecallRequest.bind(this);
    this._handleOnChange = this._handleOnChange.bind(this);
    this.shouldDisableDateForRecall = this.shouldDisableDateForRecall.bind(this);
    this.handlePostponeRecall = this.handlePostponeRecall.bind(this);
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

  handlePostponeRecall() {
    const { togglePostponeRecallDialoag } = this.props;
    togglePostponeRecallDialoag();
  }

  isValidRecallDate() {
    const { fields, loan } = this.props;
    const postponedTo = moment(fields.postponedRecallDate.value);
    return postponedTo.isValid() && postponedTo.isAfter(loan.expectedRecalledAt);
  }

  sendPostponeRecallRequest() {
    const {
      togglePostponeRecallDialoag,
      fields,
      debtorId,
      viewer,
      loan,
      postponePlacementRecall
    } = this.props;
    const postponedRecallDate = fields.postponedRecallDate.value;
    postponePlacementRecall({
      loanPlacementId: loan.loanPlacementId,
      postponedRecallDate,
      debtorId
    }, viewer);
    togglePostponeRecallDialoag();
    fields.$reset();
  }

  _handleOnChange(e, date) {
    const { setField } = this.props;
    setField(['loanDetailDialog', 'postponedRecallDate'], date);
    return date;
  }

  shouldDisableDateForRecall(date) {
    const { loan } = this.props;
    return moment(loan.expectedRecalledAt).isAfter(date);
  }

  render() {
    const {
      intl,
      loan,
      isLoanDetailDialogOpen,
      closeLoanDetailDialog,
      isPostponeRecallDialogOpen,
      togglePostponeRecallDialoag,
      fields
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
      popup: {
        padding: 12
      }
    };

    const daysOfDelinq = Math.round((Date.now() - new Date(loan.delinquentAt)) /
    (1000 * 60 * 60 * 24 * 1));

    const interestAfterCutoff = getInterestAfterCutoff(loan);
    const lateFeeAfterCutoff = getLateFeeAfterCutoff(loan);

    const title = `${intl.formatMessage(loansMessages.loanDetail)} - ${loan.originatedAgreementNo}`;
    const totalAmount = intl.formatNumber(
      Math.round((getTotalAmount(loan) + getServicingFee(loan)) * 100) / 100);
    const totalAmountStr = ` | ${intl.formatMessage(loansMessages.totalAmount)} ${totalAmount}`;
    const actions = [
      <FlatButton
        label={intl.formatMessage(loansMessages.cancel)}
        onTouchTap={togglePostponeRecallDialoag}
      />,
      <FlatButton
        label={intl.formatMessage(loansMessages.postpone)}
        primary
        disabled={!this.isValidRecallDate()}
        onTouchTap={this.sendPostponeRecallRequest}
      />
    ];

    let defaultRecallDate;

    if (moment(fields.postponedRecallDate.value).isValid()) {
      defaultRecallDate = new Date(fields.postponedRecallDate.value);
    } else if (moment(loan.expectedRecalledAt).isValid()) {
      defaultRecallDate = new Date(loan.expectedRecalledAt);
    }

    return (
      <Dialog
        title={`${title}${totalAmountStr}`}
        open={isLoanDetailDialogOpen}
        onRequestClose={closeLoanDetailDialog}
      >
        <GridList cellHeight={400} style={styles.gridList} className="grid-list">
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
              primaryText={intl.formatMessage(loansMessages.originator)}
              secondaryText={getOriginator(loan)}
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
              secondaryText={getAgencyName(loan)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.placementServicingFeeRate)}
              secondaryText={this._formatPercentage(getServicingFeeRate(loan))}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.servicingFee)}
              secondaryText={this._formatNumber(getServicingFee(loan))}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.placedAt)}
              secondaryText={getPlacement(loan) ?
                this._formatDate(getPlacement(loan).placedAt)
                : null
              }
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
              primaryText={intl.formatMessage(loansMessages.interestAfterCutoff)}
              secondaryText={this._formatNumber(interestAfterCutoff)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.collectableLateFee)}
              secondaryText={this._formatNumber(loan.collectableLateFee)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.lateFeeAfterCutoff)}
              secondaryText={this._formatNumber(lateFeeAfterCutoff)}
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
              primaryText={intl.formatMessage(loansMessages.collectablePenaltyFee)}
              secondaryText={this._formatNumber(loan.collectablePenaltyFee)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.cutoffAt)}
              secondaryText={this._formatDate(loan.cutoffAt)}
            />
            <ListItem
              primaryText={intl.formatMessage(loansMessages.expectedRecalledAt)}
              secondaryText={getPlacement(loan) ?
                this._formatDate(getPlacement(loan).expectedRecalledAt)
                : null
              }
              onTouchTap={this.handlePostponeRecall}
            />
          </List>
        </GridList>
        <Dialog
          title={intl.formatMessage(loansMessages.postponeRecall)}
          actions={actions}
          modal
          open={isPostponeRecallDialogOpen}
        >
          <DatePicker
            hintText={intl.formatMessage(loansMessages.postponeTo)}
            floatingLabelText={intl.formatMessage(loansMessages.postponeTo)}
            locale="zh"
            defaultDate={defaultRecallDate}
            shouldDisableDate={this.shouldDisableDateForRecall}
            DateTimeFormat={global.Intl.DateTimeFormat}
            onChange={this._handleOnChange}
            cancelLabel={intl.formatMessage(loansMessages.cancel)}
            okLabel={intl.formatMessage(loansMessages.ok)}
          />
        </Dialog>
      </Dialog>
    );
  }
}

LoanDetailDialog = fields(LoanDetailDialog, {
  path: 'loanDetailDialog',
  fields: [
    'postponedRecallDate',
  ]
});

LoanDetailDialog = injectIntl(LoanDetailDialog);

export default connect(state => ({
  isLoanDetailDialogOpen: state.ui.isLoanDetailDialogOpen,
  loan: state.ui.currentLoan,
  viewer: state.users.viewer,
  isPostponeRecallDialogOpen: state.ui.isPostponeRecallDialogOpen,
}), {
  closeLoanDetailDialog,
  togglePostponeRecallDialoag,
  setField,
  postponePlacementRecall,
})(LoanDetailDialog);
