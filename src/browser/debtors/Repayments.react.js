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
    msg: PropTypes.object,
  };

  render() {
    const { msg } = this.props;

    return (
      <div className="repayment">
        <GridList
          cellHeight={400}
          padding={0}
        >
          <Card>
            <CardTitle title={msg.repaymentPlan} />
            <CardText>
              <AutoSizer>
                {({ width, height }) => (
                  <FlexTable
                    width={width}
                    height={height}
                    rowHeight={36}
                    rowsCount={2}
                    rowGetter={index => index}
                  >
                    <FlexColumn
                      label={msg.originatedAgreementNo}
                      dataKey='originatedAgreementNo'
                      width={150}
                    />
                  </FlexTable>
                )}
              </AutoSizer>
            </CardText>
          </Card>
            <Card>
              <CardTitle title={msg.repayments} />
              <CardText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
                Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
                Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
              </CardText>
            </Card>
        </GridList>
      </div>
    );
  }

}


export default connect(state => ({
  msg: state.intl.msg.repayments
}))(Repayments);
