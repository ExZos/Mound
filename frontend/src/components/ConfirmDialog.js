import React from "react";
import { Button } from "reactstrap";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

import GeneralComponent from './GeneralComponent';
import '../styles/confirmDialog.css';

class ConfirmDialog extends GeneralComponent {
  confirm = () => {
    this.props.toggleModal();

    this.props.confirm();
  }

  render() {
    return (
      <Dialog id="confirmDialog" open={this.props.showModal}>
        <DialogTitle onClose={this.props.toggleModal}>
          {this.props.mHeader}

          <IconButton className="closeDialog" aria-label="close" onClick={this.props.toggleModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {this.props.mBody}
        </DialogContent>

        <DialogActions>
          <Button className="modalConfirm" color="primary" onClick={this.confirm}>Confirm</Button>
          <Button className="modalCancel" color="secondary" onClick={this.props.toggleModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmDialog;
