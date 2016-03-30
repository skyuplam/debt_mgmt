// import './RepaymentList.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import { FormattedDate } from 'react-intl';
import { updateRepayment } from '../../common/repaymentPlans/actions';
import TextField from 'material-ui/lib/text-field';
import { toFloat } from 'validator';

class RepaymentList extends Component {
  static propTypes = {
    msg: PropTypes.object.isRequired,
    repayments: PropTypes.object.isRequired,
    updateRepayment: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._randerDateCell = this._randerDateCell.bind(this);
    this._randerNumberCell = this._randerNumberCell.bind(this);
    this._onChangeRepayAmt = this._onChangeRepayAmt.bind(this);
  }
  shouldComponentUpdate = shouldPureComponentUpdate;

  _randerDateCell(cellData) {
    const theDate = cellData ? new Date(cellData) : '';
    return (
      <FormattedDate
        value={theDate}
      />
    );
  }

  _onChangeRepayAmt({ rowData, cellDataKey, value }) {
    const { updateRepayment } = this.props;
    const repayment = rowData.toJS();
    repayment[cellDataKey] = value;
    updateRepayment(repayment);
  }

  _randerNumberCell(cellData, cellDataKey, rowData) {
    return (
      <TextField
        defaultValue={cellData}
        hintText={cellData}
        value={cellData}
        onChange={e => this._onChangeRepayAmt({
          rowData,
          cellDataKey,
          value: toFloat(e.target.value)
        })}
        fullWidth
      />
    );
  }

  render() {
    const { msg, repayments } = this.props;

    return (
      <AutoSizer disableHeight>
          {({ width }) => (
            <FlexTable
              width={width}
              height={200}
              headerHeight={36}
              rowHeight={48}
              rowsCount={repayments.size}
              rowGetter={index => repayments.get(index + 1)}
            >
              <FlexColumn
                label={msg.term}
                dataKey="term"
                width={50}
              />
              <FlexColumn
                label={msg.repaymentAmt}
                dataKey="principal"
                width={120}
                cellRenderer={this._randerNumberCell}
              />
              <FlexColumn
                label={msg.expectedRepaidAt}
                dataKey="expectedRepaidAt"
                width={120}
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
}), {
  updateRepayment
})(RepaymentList);
