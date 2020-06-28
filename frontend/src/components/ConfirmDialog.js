import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from '@material-ui/core';

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
          <Button className="modalConfirm" variant="contained" onClick={this.confirm}>Confirm</Button>
          <Button className="modalCancel" variant="contained" onClick={this.props.toggleModal}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default ConfirmDialog;
