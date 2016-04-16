import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape, FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import fetch from '../../common/components/fetch';
import { fetchAgencies } from '../../common/agencies/actions';
import agencyMessages from '../../common/agencies/agencyMessages';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import CardHeader from 'material-ui/Card/CardHeader';
import {
  Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn
} from 'material-ui/Table';
import { cyan500, grey900 } from 'material-ui/styles/colors';
import AddAgencyDialog from './AddAgencyDialog.react';
import { toggleAddAgencyDialog } from '../../common/ui/actions';

class Users extends Component {

  static propTypes = {
    agencies: PropTypes.object.isRequired,
    targetAgency: PropTypes.object,
    viewer: PropTypes.object.isRequired,
    toggleAddAgencyDialog: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();
    this.roleCellDataGetter = this.roleCellDataGetter.bind(this);
    this.actionCellRenderer = this.actionCellRenderer.bind(this);
    this.showAddAgencyDialog = this.showAddAgencyDialog.bind(this);
    this.popupTarget = null;
  }

  showAddAgencyDialog() {
    const { toggleAddAgencyDialog } = this.props;
    toggleAddAgencyDialog();
  }

  actionCellRenderer(rowData) {
    return (
      <IconButton
        onTouchTap={e => this.userActionBtnTapped(e, rowData)}
      >
        <MoreVertIcon />
      </IconButton>
    );
  }

  roleCellDataGetter(rowData) {
    const { intl } = this.props;
    return rowData.roles.reduce((prev, curr) =>
      prev.concat(intl.formatMessage(agencyMessages[curr.role])), []).join();
  }

  render() {
    const {
      intl,
      agencies,
    } = this.props;

    const title = intl.formatMessage(agencyMessages.agenciesTitle);
    const agencyList = agencies ? agencies.toList() : null;

    const styles = {
      card: {
        width: '100%',
      },
      floatingActionBtn: {
        width: 40,
        height: 40,
      }
    };

    return (
      <div className="users">
        <Helmet title={title} />
        <Card style={styles.card}>
          <CardHeader
            title={intl.formatMessage(agencyMessages.agenciesTitle)}
          />
          <CardText>
            <Table
              fixedHeader
              height="300px"
              selectable={false}
            >
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>
                    ID
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(agencyMessages.name)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(agencyMessages.code)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(agencyMessages.servicingFeeRate)}
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agencyList ? agencyList.map(agency =>
                  (
                    <TableRow key={agency.id} style={{
                      color: agency.active ? cyan500 : grey900,
                    }}
                    >
                      <TableRowColumn>{agency.id}</TableRowColumn>
                      <TableRowColumn>{agency.company.name}</TableRowColumn>
                      <TableRowColumn>{agency.company.code}</TableRowColumn>
                      <TableRowColumn>
                        <FormattedNumber
                          style="percent"
                          value={agency.servicingFeeRate}
                        />
                      </TableRowColumn>
                    </TableRow>
                  )
                ) : null}
              </TableBody>
            </Table>
          </CardText>
          <CardActions style={{ textAlign: 'right' }}>
            <FloatingActionButton
              mini
              style={styles.floatingActionBtn}
              onTouchTap={() => this.showAddAgencyDialog()}
            >
              <ContentAdd />
            </FloatingActionButton>
          </CardActions>
        </Card>
        <AddAgencyDialog />
      </div>
    );
  }

}

Users = fetch(
  fetchAgencies,
)(Users);


Users = injectIntl(Users);

export default connect(state => ({
  agencies: state.agencies.map,
  targetAgency: state.agencies.targetAgency,
  viewer: state.users.viewer,
}), {
  toggleAddAgencyDialog,
})(Users);
