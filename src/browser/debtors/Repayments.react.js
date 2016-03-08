import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import GridList from 'material-ui/lib/grid-list/grid-list';
import Card from 'material-ui/lib/card/card';
import CardText from 'material-ui/lib/card/card-text';
import CardTitle from 'material-ui/lib/card/card-title';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';


class Repayments extends Component {

  static propTypes = {
    msg: PropTypes.object.isRequired,
    repaymentPlans: PropTypes.object.isRequired,
    repayments: PropTypes.object.isRequired,
  };

  render() {
    const { msg, repaymentPlans } = this.props;
    const repaymentPlanList = repaymentPlans.toArray();
    return (
      <div className="repayment">
        <GridList
          cellHeight={400}
          padding={0}
        >
          <Card>
            <CardTitle title={msg.repaymentPlan} />
            <div>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <FlexTable
                    width={width}
                    height={300}
                    headerHeight={36}
                    rowHeight={36}
                    rowsCount={repaymentPlanList.length}
                    rowGetter={index => repaymentPlanList[index]}
                  >
                    <FlexColumn
                      label={'ID'}
                      dataKey='id'
                      width={100}
                    />
                    <FlexColumn
                      label={msg.principal}
                      dataKey='principal'
                      width={100}
                    />
                    <FlexColumn
                      label={msg.terms}
                      dataKey='terms'
                      width={100}
                    />
                    <FlexColumn
                      label={msg.startedAt}
                      dataKey='startedAt'
                      width={100}
                    />
                  </FlexTable>
                )}
              </AutoSizer>
            </div>
          </Card>
          <Card>
            <CardTitle title={msg.repayments} />
            <div>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <FlexTable
                    width={width}
                    height={300}
                    headerHeight={36}
                    rowHeight={36}
                    rowsCount={repaymentPlanList.length}
                    rowGetter={index => repaymentPlanList[index]}
                  >
                    <FlexColumn
                      label={msg.term}
                      dataKey='id'
                      width={100}
                    />
                    <FlexColumn
                      label={msg.principal}
                      dataKey='principal'
                      width={100}
                    />
                    <FlexColumn
                      label={msg.interest}
                      dataKey='terms'
                      width={100}
                    />
                    <FlexColumn
                      label={msg.expectedRepaidAt}
                      dataKey='startedAt'
                      width={100}
                    />
                    <FlexColumn
                      label={msg.repaymentStatus}
                      dataKey='startedAt'
                      width={100}
                    />
                  </FlexTable>
                )}
              </AutoSizer>
            </div>
          </Card>
        </GridList>
      </div>
    );
  }

}


export default connect(state => ({
  msg: state.intl.msg.repayments,
  repaymentPlans: state.repaymentPlans.map,
  repayments: state.repayments.map
}))(Repayments);
