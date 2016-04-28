import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape, FormattedNumber, FormattedDate } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import fetch from '../../common/components/fetch';
import { fetchAgencies, fetchPlacements } from '../../common/agencies/actions';
import agencyMessages from '../../common/agencies/agencyMessages';
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
import AddPlacementDialog from './AddPlacementDialog.react';
import { toggleAddAgencyDialog, toggleAddPlacementDialog } from '../../common/ui/actions';

class Users extends Component {

  static propTypes = {
    agencies: PropTypes.object.isRequired,
    placements: PropTypes.object.isRequired,
    targetAgency: PropTypes.object,
    viewer: PropTypes.object.isRequired,
    toggleAddAgencyDialog: PropTypes.func.isRequired,
    toggleAddPlacementDialog: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();
    this.showAddAgencyDialog = this.showAddAgencyDialog.bind(this);
    this.showAddPlacementDialog = this.showAddPlacementDialog.bind(this);
    this.popupTarget = null;
  }

  showAddAgencyDialog() {
    const { toggleAddAgencyDialog } = this.props;
    toggleAddAgencyDialog();
  }

  showAddPlacementDialog() {
    const { toggleAddPlacementDialog } = this.props;
    toggleAddPlacementDialog();
  }


  render() {
    const {
      intl,
      agencies,
      placements,
    } = this.props;

    const title = intl.formatMessage(agencyMessages.agenciesTitle);
    const agencyList = agencies ? agencies.toList() : null;
    const placementList = placements ? placements.toList() : null;

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
        <Card style={styles.card}>
          <CardHeader
            title={intl.formatMessage(agencyMessages.placementTitle)}
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
                    {intl.formatMessage(agencyMessages.placementCode)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(agencyMessages.servicingFeeRate)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(agencyMessages.placedAt)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(agencyMessages.expectedRecalledAt)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(agencyMessages.recalledAt)}
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {placementList ? placementList.map(placement =>
                  (
                    <TableRow
                      key={placement.id}
                    >
                      <TableRowColumn>{placement.id}</TableRowColumn>
                      <TableRowColumn>{placement.company.name}</TableRowColumn>
                      <TableRowColumn>{placement.placementCode}</TableRowColumn>
                      <TableRowColumn>
                        <FormattedNumber
                          style="percent"
                          value={placement.servicingFeeRate}
                        />
                      </TableRowColumn>
                      <TableRowColumn>
                        <FormattedDate
                          value={placement.placedAt}
                        />
                      </TableRowColumn>
                      <TableRowColumn>
                        <FormattedDate
                          value={placement.expectedRecalledAt}
                        />
                      </TableRowColumn>
                      <TableRowColumn>
                        { placement.recalledAt ?
                          <FormattedDate
                            value={placement.recalledAt}
                          />
                        : ''
                        }
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
              onTouchTap={() => this.showAddPlacementDialog()}
            >
              <ContentAdd />
            </FloatingActionButton>
          </CardActions>
        </Card>
        <AddAgencyDialog />
        <AddPlacementDialog />
      </div>
    );
  }

}

Users = fetch(
  fetchAgencies,
  fetchPlacements,
)(Users);


Users = injectIntl(Users);

export default connect(state => ({
  agencies: state.agencies.map,
  placements: state.agencies.placements,
  targetAgency: state.agencies.targetAgency,
  viewer: state.users.viewer,
}), {
  toggleAddAgencyDialog,
  toggleAddPlacementDialog,
})(Users);
