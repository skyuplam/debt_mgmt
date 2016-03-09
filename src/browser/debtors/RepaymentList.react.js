// import './RepaymentList.scss';
import Component from 'react-pure-render/component';
import Helmet from 'react-helmet';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import { FormattedNumber, FormattedDate, IntlMixin } from 'react-intl';

class RepaymentList extends Component {
  shouldComponentUpdate = shouldPureComponentUpdate;
  mixins = [IntlMixin];

  static propTypes = {
    msg: PropTypes.object.isRequired,
    repayments: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._randerDateCell = this._randerDateCell.bind(this);
    this._randerNumberCell = this._randerNumberCell.bind(this);
    this._handleRowClick = this._handleRowClick.bind(this);
  }

  _randerDateCell(cellData, cellDataKey, rowData, rowIndex, columnData) {
    return (
      <FormattedDate
        value={cellData}
      />
    );
  }

  _randerNumberCell(cellData, cellDataKey, rowData, rowIndex, columnData) {
    return (
      <FormattedNumber
        value={cellData}
      />
    );
  }

  _handleRowClick(rowIdx) {
    
  }

  render() {
    const { msg, repayments } = this.props;

    return (
      <AutoSizer disableHeight>
          {({ width }) => (
            <FlexTable
              width={width}
              height={130}
              headerHeight={36}
              rowHeight={30}
              rowsCount={repayments.size}
              rowGetter={index => repayments.get(index+1)}
              onRowClick={this._handleRowClick}
            >
              <FlexColumn
                label={msg.term}
                dataKey='term'
                width={100}
              />
              <FlexColumn
                label={msg.repaymentAmt}
                dataKey='principal'
                width={100}
                cellRenderer={this._randerNumberCell}
              />
              <FlexColumn
                label={msg.expectedRepaidAt}
                dataKey='expectedRepaidAt'
                width={100}
                cellRenderer={this._randerDateCell}
              />
            </FlexTable>
          )}
      </AutoSizer>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.newRepaymentPlanDialog,
  repayments: state.repaymentPlans.newRepaymentPlan.repayments,
}))(RepaymentList);
