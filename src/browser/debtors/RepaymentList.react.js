// import './RepaymentList.scss';
import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import { FormattedDate } from 'react-intl';
import { updateRepayment } from '../../common/repaymentPlans/actions';
import TextField from 'material-ui/TextField';
import { toFloat } from 'validator';
import { injectIntl, intlShape } from 'react-intl';
import repaymentsMessages from '../../common/repayments/repaymentsMessages';
import moment from 'moment';

class RepaymentList extends Component {
  static propTypes = {
    intl: intlShape.isRequired,
    repayments: PropTypes.object.isRequired,
    viewer: PropTypes.object.isRequired,
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
    return (
      <p>
        {moment(cellData).isValid() ? (
          <FormattedDate
            value={moment(cellData)}
          />
        ) : ''}
      </p>
    );
  }

  _onChangeRepayAmt({ rowData, cellDataKey, value, viewer }) {
    const { updateRepayment } = this.props;
    const repayment = rowData.toJS();
    repayment[cellDataKey] = value;
    updateRepayment(repayment, viewer);
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
    const { intl, repayments } = this.props;

    return (
      <AutoSizer disableHeight>
          {({ width }) => (
            <FlexTable
              width={width}
              height={200}
              headerHeight={36}
              rowHeight={48}
              rowsCount={repayments.size || 0}
              rowGetter={index => repayments.get(index + 1)}
            >
              <FlexColumn
                label={intl.formatMessage(repaymentsMessages.term)}
                dataKey="term"
                width={50}
              />
              <FlexColumn
                label={intl.formatMessage(repaymentsMessages.repaymentAmt)}
                dataKey="principal"
                width={120}
                cellRenderer={this._randerNumberCell}
              />
              <FlexColumn
                label={intl.formatMessage(repaymentsMessages.expectedRepaidAt)}
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

RepaymentList = injectIntl(RepaymentList);

export default connect(state => ({
  repayments: state.repaymentPlans.newRepaymentPlan.repayments,
  viewer: state.users.viewer,
}), {
  updateRepayment
})(RepaymentList);
