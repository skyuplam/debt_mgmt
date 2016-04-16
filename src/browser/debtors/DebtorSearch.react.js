import Component from 'react-pure-render/component';
import TextField from 'material-ui/TextField';
import React, { PropTypes } from 'react';
import { fields } from '../../common/lib/redux-fields';
import { connect } from 'react-redux';
import * as debtorsActions from '../../common/debtors/actions';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import { injectIntl, intlShape } from 'react-intl';
import debtorsMessages from '../../common/debtors/debtorsMessages';

const styles = {
  button: {
    margin: 12,
  },
  padding: {
    padding: 8
  }
};

class DebtorSearch extends Component {
  static propTypes = {
    searchDebtors: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
    fields: PropTypes.object.isRequired,
    debtors: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.onPressedSearch = this.onPressedSearch.bind(this);
  }

  onPressedSearch() {
    // if (e.key !== 'Enter') return;
    const { searchDebtors, fields, viewer } = this.props;
    if (!(fields.idCard.value.trim() ||
        fields.name.value.trim() ||
        fields.originatedAgreementNo.value.trim())) return;

    searchDebtors({
      idCard: fields.idCard.value,
      name: fields.name.value,
      originatedAgreementNo: fields.originatedAgreementNo.value
    }, {
      token: viewer.token
    });

    fields.$reset();
  }

  render() {
    const { fields, intl } = this.props;
    return (
      <div style={styles.padding}>
        <TextField
          floatingLabelText={intl.formatMessage(debtorsMessages.idCard)}
          hintText={intl.formatMessage(debtorsMessages.idCard)}
          {...fields.idCard}
        />
        <TextField
          floatingLabelText={intl.formatMessage(debtorsMessages.name)}
          hintText={intl.formatMessage(debtorsMessages.name)}
          {...fields.name}
        />
        <TextField
          floatingLabelText={intl.formatMessage(debtorsMessages.originatedAgreementNo)}
          hintText={intl.formatMessage(debtorsMessages.originatedAgreementNo)}
          {...fields.originatedAgreementNo}
        />
        <RaisedButton
          label={intl.formatMessage(debtorsMessages.search)}
          onMouseUp={this.onPressedSearch}
          onTouchEnd={this.onPressedSearch}
          secondary
          style={styles.button}
          icon={<FontIcon className="muidocs-icon-search" />}
        />
      </div>
    );
  }

}

DebtorSearch = fields(DebtorSearch, {
  path: 'debtorSearch',
  fields: ['idCard', 'name', 'originatedAgreementNo']
});

DebtorSearch = injectIntl(DebtorSearch);

export default connect(state => ({
  debtors: state.debtors.map,
  viewer: state.users.viewer,
}), debtorsActions)(DebtorSearch);
