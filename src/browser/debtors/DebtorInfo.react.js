import './DebtorInfo.scss';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/lib/text-field';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';


class DebtorInfo extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    debtorId: PropTypes.string.isRequired,
    debtors: PropTypes.object.isRequired
  };

  render() {
    const { msg, debtors, debtorId } = this.props;
    const debtor = debtors.get(parseInt(debtorId));
    return (
      <Card>
        <CardHeader
          title={`${msg.debtorDetail} - ${debtor?debtor.name:''}`}
        />
      <div className='debtor-info'>
        <TextField
          floatingLabelText={msg.idCard}
          disabled={true}
          value={debtor?debtor.idNumber:''}
        />
        <TextField
          floatingLabelText={msg.maritalStatus}
          disabled={true}
          value={debtor?debtor.maritalStatus:''}
        />
      </div>
      </Card>
    );
  }

}


export default connect(state => ({
  msg: state.intl.msg.debtors,
  debtors: state.debtors.map
}))(DebtorInfo);
