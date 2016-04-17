import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { injectIntl, intlShape, FormattedDate } from 'react-intl';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import fetch from '../../common/components/fetch';
import { fetchPortfolios } from '../../common/portfolios/actions';
import portfolioMessages from '../../common/portfolios/portfolioMessages';
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
import AddPortfolioDialog from './AddPortfolioDialog.react';
import { toggleAddPortfolioDialog } from '../../common/ui/actions';

class Users extends Component {

  static propTypes = {
    portfolios: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
    toggleAddPortfolioDialog: PropTypes.func.isRequired,
    intl: intlShape.isRequired,
  };

  constructor() {
    super();
    this.showAddPortfolioDialog = this.showAddPortfolioDialog.bind(this);
    this.popupTarget = null;
  }

  showAddPortfolioDialog() {
    const { toggleAddPortfolioDialog } = this.props;
    toggleAddPortfolioDialog();
  }


  render() {
    const {
      intl,
      portfolios,
    } = this.props;

    const title = intl.formatMessage(portfolioMessages.portfoliosTitle);
    const portfolioList = portfolios ? portfolios.toList() : null;

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
      <div className="portfolios">
        <Helmet title={title} />
        <Card style={styles.card}>
          <CardHeader
            title={intl.formatMessage(portfolioMessages.portfoliosTitle)}
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
                    {intl.formatMessage(portfolioMessages.referenceCode)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(portfolioMessages.name)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(portfolioMessages.code)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(portfolioMessages.biddedAt)}
                  </TableHeaderColumn>
                  <TableHeaderColumn>
                    {intl.formatMessage(portfolioMessages.cutoffAt)}
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioList ? portfolioList.map(portfolio =>
                  (
                    <TableRow key={portfolio.id} style={{
                      color: portfolio.active ? cyan500 : grey900,
                    }}
                    >
                      <TableRowColumn>{portfolio.id}</TableRowColumn>
                      <TableRowColumn>{portfolio.referenceCode}</TableRowColumn>
                      <TableRowColumn>{portfolio.company.name}</TableRowColumn>
                      <TableRowColumn>{portfolio.company.code}</TableRowColumn>
                      <TableRowColumn>
                        <FormattedDate
                          value={portfolio.biddedAt}
                        />
                      </TableRowColumn>
                      <TableRowColumn>
                        <FormattedDate
                          value={portfolio.cutoffAt}
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
              onTouchTap={() => this.showAddPortfolioDialog()}
            >
              <ContentAdd />
            </FloatingActionButton>
          </CardActions>
        </Card>
        <AddPortfolioDialog />
      </div>
    );
  }

}

Users = fetch(
  fetchPortfolios,
)(Users);


Users = injectIntl(Users);

export default connect(state => ({
  portfolios: state.portfolios.map,
  viewer: state.users.viewer,
}), {
  toggleAddPortfolioDialog,
})(Users);
