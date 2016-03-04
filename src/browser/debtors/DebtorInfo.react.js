import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';


class DebtorInfo extends Component {

  static propTypes = {
    msg: PropTypes.object,
    debtorId: PropTypes.object,
    debtors: PropTypes.object
  };

  render() {
    const { msg, debtors, debtorId } = this.props;
    const debtor = debtors.get(parseInt(debtorId));
    return (
      <Card>
        <CardHeader
          title={`${msg.debtorDetail} - ${debtor.name}`}
        />
      <TextField
        floatingLabelText={msg.idCard}
        disabled={true}
        value={debtor.idNumber}
      />
      <TextField
        floatingLabelText={msg.originatedAgreementNo}
        disabled={true}
        value={debtor.originatedAgreementNo}
      />
      <TextField
        floatingLabelText={msg.maritalStatus}
        disabled={true}
        value={debtor.maritalStatus}
      />
      </Card>
    );
  }

}


export default connect(state => ({
  msg: state.intl.msg.debtors,
  debtors: state.debtors.map
}))(DebtorInfo);
