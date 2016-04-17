import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import portfolioMessages from '../../common/portfolios/portfolioMessages';
import Dialog from 'material-ui/Dialog';
import { toggleAddPortfolioDialog } from '../../common/ui/actions';
import TextField from 'material-ui/TextField';
import { fields } from '../../common/lib/redux-fields';
import { setField } from '../../common/lib/redux-fields/actions';
import { createPortfolio } from '../../common/portfolios/actions';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class AddPortfolioDialog extends Component {
  static propTypes = {
    viewer: PropTypes.object,
    fields: PropTypes.object.isRequired,
    isAddPortfolioDialogOpen: PropTypes.bool.isRequired,
    toggleAddPortfolioDialog: PropTypes.func.isRequired,
    setField: PropTypes.func.isRequired,
    createPortfolio: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();
    this.renderDialogContent = this.renderDialogContent.bind(this);
    this.validateFormInput = this.validateFormInput.bind(this);
    this.dismissDialog = this.dismissDialog.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleSelectedCompanyType = this.handleSelectedCompanyType.bind(this);
  }

  handleSelectedCompanyType(event, index, value) {
    const { setField } = this.props;
    setField(['portfolio', 'companyType'], value);
  }

  dismissDialog() {
    const { toggleAddPortfolioDialog, fields } = this.props;

    fields.$reset();
    toggleAddPortfolioDialog();
  }

  handleDateChange(date, field) {
    const { setField } = this.props;
    setField(['portfolio', field], date);
    return date;
  }

  validateFormInput() {
    const { fields } = this.props;
    if (fields.name.value.trim() &&
      fields.code.value.trim() &&
      fields.biddedAt.value &&
      fields.cutoffAt.value &&
      fields.referenceCode.value.trim() &&
      fields.companyType.value
    ) {
      return true;
    }
    return false;
  }

  handleSubmitUserAction() {
    const { createPortfolio, fields, viewer } = this.props;
    createPortfolio({ portfolio: fields.$values() }, viewer);
    this.dismissDialog();
  }

  renderDialogContent() {
    const { intl, fields } = this.props;
    return (
      <div>
        <TextField
          floatingLabelText={intl.formatMessage(portfolioMessages.name)}
          {...fields.name}
        /><br />
        <TextField
          floatingLabelText={intl.formatMessage(portfolioMessages.code)}
          {...fields.code}
        /><br />
        <SelectField
          floatingLabelText={intl.formatMessage(portfolioMessages.companyType)}
          onChange={this.handleSelectedCompanyType}
          value={fields.companyType.value}
          maxHeight={300}
        >
          <MenuItem
            value={portfolioMessages.Bank}
            label={intl.formatMessage(portfolioMessages.Bank)}
            primaryText={
              intl.formatMessage(portfolioMessages.Bank)
            }
          />
          <MenuItem
            value={portfolioMessages.MoneyLender}
            label={intl.formatMessage(portfolioMessages.MoneyLender)}
            primaryText={
              intl.formatMessage(portfolioMessages.MoneyLender)
            }
          />
          <MenuItem
            value={portfolioMessages.DCA}
            label={intl.formatMessage(portfolioMessages.DCA)}
            primaryText={
              intl.formatMessage(portfolioMessages.DCA)
            }
          />
          <MenuItem
            value={portfolioMessages.General}
            label={intl.formatMessage(portfolioMessages.General)}
            primaryText={
              intl.formatMessage(portfolioMessages.General)
            }
          />
        </SelectField><br />
        <TextField
          floatingLabelText={intl.formatMessage(portfolioMessages.referenceCode)}
          {...fields.referenceCode}
        /><br />
        <DatePicker
          hintText={intl.formatMessage(portfolioMessages.biddedAt)}
          locale="zh"
          DateTimeFormat={global.Intl.DateTimeFormat}
          onChange={(e, date) => this.handleDateChange(date, 'biddedAt')}
          maxDate={new Date()}
          cancelLabel={intl.formatMessage(portfolioMessages.cancel)}
          okLabel={intl.formatMessage(portfolioMessages.ok)}
          autoOk
        />
        <DatePicker
          hintText={intl.formatMessage(portfolioMessages.cutoffAt)}
          locale="zh"
          DateTimeFormat={global.Intl.DateTimeFormat}
          onChange={(e, date) => this.handleDateChange(date, 'cutoffAt')}
          maxDate={new Date()}
          cancelLabel={intl.formatMessage(portfolioMessages.cancel)}
          okLabel={intl.formatMessage(portfolioMessages.ok)}
          autoOk
        />
      </div>
    );
  }

  render() {
    const {
      intl,
      isAddPortfolioDialogOpen,
    } = this.props;

    const actions = [
      <FlatButton
        label={intl.formatMessage(portfolioMessages.cancel)}
        secondary
        onTouchTap={() => this.dismissDialog()}
      />,
      <FlatButton
        label={intl.formatMessage(portfolioMessages.submit)}
        primary
        keyboardFocused
        disabled={!this.validateFormInput()}
        onTouchTap={() => this.handleSubmitUserAction()}
      />,
    ];

    const title = `${intl.formatMessage(portfolioMessages.addPortfolio)}`;

    return (
      <div>
        <Helmet title={title} />
        <Dialog
          title={title}
          actions={actions}
          modal
          open={isAddPortfolioDialogOpen}
          onRequestClose={() => this.dismissDialog()}
        >
          {this.renderDialogContent()}
        </Dialog>
      </div>
    );
  }
}

AddPortfolioDialog = fields(AddPortfolioDialog, {
  path: 'portfolio',
  fields: ['name', 'code', 'biddedAt', 'cutoffAt', 'referenceCode', 'companyType']
});

AddPortfolioDialog = injectIntl(AddPortfolioDialog);

export default connect(state => ({
  isAddPortfolioDialogOpen: state.ui.isAddPortfolioDialogOpen,
  viewer: state.users.viewer,
}), {
  setField,
  createPortfolio,
  toggleAddPortfolioDialog,
})(AddPortfolioDialog);
