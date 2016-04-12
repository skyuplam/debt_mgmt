import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React from 'react';
import { FormattedMessage, defineMessages, injectIntl, intlShape } from 'react-intl';
import { Link } from 'react-router';

const messages = defineMessages({
  title: {
    defaultMessage: '访问地址不存在',
    id: 'notFound.title'
  },
  h1: {
    defaultMessage: '访问页面不存在',
    id: 'notFound.h1'
  },
  p: {
    defaultMessage: '链结可能已经不存在或页面已经搬家了',
    id: 'notFound.p'
  },
  continue: {
    defaultMessage: '请按这继续',
    id: 'notFound.continue'
  }
});

class Page extends Component {

  static propTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.props;
    const title = intl.formatMessage(messages.title);

    return (
      <div className="notfound-page">
        <Helmet title={title} />
        <h1>
          <FormattedMessage {...messages.h1} />
        </h1>
        <p>
          <FormattedMessage {...messages.p} />
        </p>
        <Link to="/">
          <FormattedMessage {...messages.continue} />
        </Link>
      </div>
    );
  }

}

export default injectIntl(Page);
