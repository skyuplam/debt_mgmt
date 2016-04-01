// import Buttons from './Buttons.react';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
// import NewTodo from './NewTodo.react';
import React, { PropTypes } from 'react';
import Debtors from './Debtors.react';
// import { fetchDebtors } from '../../common/debtors/actions';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
// import fetch from '../../common/components/fetch';

const messages = defineMessages({
  title: {
    id: 'debtors.page.title',
    defaultMessage: '借款人管理'
  }
});

class Page extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    children: PropTypes.object
  };


  render() {
    const { children, intl } = this.props;
    const title = intl.formatMessage(messages.title);
    return (
      <div className="debtors-page">
        <Helmet title={title} />
        {children || <Debtors />}
      </div>
    );
  }

}

// Page = fetch(fetchDebtors)(Page);

export default injectIntl(Page);
