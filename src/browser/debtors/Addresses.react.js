import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { dateFormat } from '../../common/intl/format';
import { FormattedNumber, IntlMixin } from 'react-intl';
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardActions from 'material-ui/lib/card/card-actions';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import HomeIcon from 'material-ui/lib/svg-icons/action/home';


class ContactList extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;

  static propTypes = {
    msg: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { msg } = this.props;
    const styles = {
      container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      list: {
        width: '100%',
        height: 214,
        overflowY: 'auto',
      }
    };
    return (
      <Card>
        <CardHeader
          title={msg.addresses}
        />
      <CardActions style={styles.container}>
          <List style={styles.list}>
            <ListItem
              leftIcon={<HomeIcon />}
              primaryText="(650) 555 - 1234"
              secondaryText="Mobile"
            />
            <ListItem
              insetChildren={true}
              primaryText="(323) 555 - 6789"
              secondaryText="Work"
            />
            <ListItem
              insetChildren={true}
              primaryText="(323) 555 - 6789"
              secondaryText="Work"
            />
            <ListItem
              insetChildren={true}
              primaryText="(323) 555 - 6789"
              secondaryText="Work"
            />
          </List>
        </CardActions>
      </Card>
    );
  }
}

export default connect(state => ({
  msg: state.intl.msg.contacts,
}))(ContactList);
