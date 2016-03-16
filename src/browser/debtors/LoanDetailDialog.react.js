import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { closeLoanDetailDialog } from '../../common/ui/actions';
import { dateFormat } from '../../common/intl/format';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import GridList from 'material-ui/lib/grid-list/grid-list';
import GridTile from 'material-ui/lib/grid-list/grid-tile';
import { FormattedNumber, IntlMixin } from 'react-intl';


class LoanDetailDialog extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static propTypes = {
    msg: PropTypes.object.isRequired,
    closeLoanDetailDialog: PropTypes.func.isRequired,
    loan: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this._formatNumber = this._formatNumber.bind(this);
    this._formatPercentage = this._formatPercentage.bind(this);
  }

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
          style='percent'
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
              secondaryText={loan.amount}/>
            <ListItem
              primaryText={msg.issuedAt}
              secondaryText={dateFormat(new Date(loan.issuedAt), ['zh'])}/>
            <ListItem
              primaryText={msg.terms}
              secondaryText={loan.terms}/>
            <ListItem
              primaryText={msg.repaidTerms}
              secondaryText={loan.repaidTerms}/>
            <ListItem
              primaryText={msg.transferredAt}
              secondaryText={dateFormat(new Date(loan.transferredAt), ['zh'])}/>
            <ListItem
              primaryText={msg.delinquentAt}
              secondaryText={dateFormat(new Date(loan.delinquentAt), ['zh'])}
              />
            <ListItem
              primaryText={msg.agency}
              secondaryText={loan.agency}/>
          </List>
          <List>
            <ListItem
              primaryText={msg.collectablePrincipal}
              secondaryText={this._formatNumber(loan.collectablePrincipal)}/>
            <ListItem
              primaryText={msg.collectableInterest}
              secondaryText={this._formatNumber(loan.collectableInterest)}
              />
            <ListItem
              primaryText={msg.collectableMgmtFee}
              secondaryText={this._formatNumber(loan.collectableMgmtFee)}/>
            <ListItem
              primaryText={msg.collectableHandlingFee}
              secondaryText={this._formatNumber(loan.collectableHandlingFee)}/>
            <ListItem
              primaryText={msg.collectableLateFee}
              secondaryText={this._formatNumber(loan.collectableLateFee)}/>
            <ListItem
              primaryText={msg.collectablePenaltyFee}
              secondaryText={this._formatNumber(loan.collectablePenaltyFee)}/>
            <ListItem
              primaryText={msg.placementServicingFeeRate}
              secondaryText={this._formatPercentage(loan.placementServicingFeeRate)}/>
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
