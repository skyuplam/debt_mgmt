import Component from 'react-pure-render/component';
import TextField from 'material-ui/lib/text-field';
import React, { PropTypes } from 'react';
import { fields } from '../../common/lib/redux-fields';
import { connect } from 'react-redux';
import * as debtorsActions from '../../common/debtors/actions';
import RaisedButton from 'material-ui/lib/raised-button';
import FontIcon from 'material-ui/lib/font-icon';

const styles = {
  button: {
    margin: 12,
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  padding: {
    padding: 8
  }
};

class DebtorSearch extends Component {
  static propTypes = {
    searchDebtors: PropTypes.func.isRequired,
    msg: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.onPressedSearch = this.onPressedSearch.bind(this);
  }

  onPressedSearch(e) {
    // if (e.key !== 'Enter') return;
    const { searchDebtors, fields, debtors } = this.props;
    if (!(fields.idCard.value.trim() ||
        fields.name.value.trim() ||
        fields.originatedAgreementNo.value.trim())) return;
    searchDebtors({
      idCard: fields.idCard.value,
      name: fields.name.value,
      originatedAgreementNo: fields.originatedAgreementNo.value
    });
    // fields.$reset();
  }

  render() {
    const { msg, fields } = this.props;
    return (
      <div style={styles.padding}>
        <TextField
          floatingLabelText={msg.idCard}
          hintText={msg.idCard}
          {...fields.idCard}
        />
        <TextField
          floatingLabelText={msg.name}
          hintText={msg.name}
          {...fields.name}
        />
        <TextField
          floatingLabelText={msg.originatedAgreementNo}
          hintText={msg.originatedAgreementNo}
          {...fields.originatedAgreementNo}
        />
        <RaisedButton
          label={msg.search}
          onMouseUp={this.onPressedSearch}
          onTouchEnd={this.onPressedSearch}
          secondary={true}
          style={styles.button}
          icon={<FontIcon className="muidocs-icon-search"/>}
        />
      </div>
    );
  }

}

DebtorSearch = fields(DebtorSearch, {
  path: 'debtorSearch',
  fields: ['idCard', 'name', 'originatedAgreementNo']
});

export default connect(state => ({
  msg: state.intl.msg.debtors,
  debtors: state.debtors.map
}), debtorsActions)(DebtorSearch);
