import Component from 'react-pure-render/component';
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import * as uiActions from '../../common/ui/actions';
import FlatButton from 'material-ui/lib/flat-button';
import Dialog from 'material-ui/lib/dialog';
import shouldPureComponentUpdate from 'react-pure-render/function'

class ConfirmDialog extends Component {
  shouldPureComponentUpdate = shouldPureComponentUpdate

  static propTypes = {
    msg: PropTypes.object.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isConfirmDialogOpen: PropTypes.bool.isRequired,
    closeConfirmDialog: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleConfirm = this.handleConfirm.bind(this);
  }

  handleConfirm(confirmHandler) {
    const { onConfirm, closeConfirmDialog } = this.props;
    onConfirm();
    closeConfirmDialog();
  }

  render() {
    const { msg, title, isConfirmDialogOpen, content, closeConfirmDialog } = this.props;
    const actions = [
      <FlatButton
        label={msg.cancel}
        secondary={true}
        onTouchTap={closeConfirmDialog}
      />,
      <FlatButton
        label={msg.confirm}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleConfirm}
      />,
    ];
    return (
      <div className="confirm-dialog">
        <Dialog
          title={title}
          actions={actions}
          modal={false}
          open={isConfirmDialogOpen}
        >
          {content}
        </Dialog>
      </div>
    );
  }

}

export default connect(state => ({
  msg: state.intl.msg.confirmDialog,
  isConfirmDialogOpen: state.ui.isConfirmDialogOpen
}), uiActions)(ConfirmDialog);
