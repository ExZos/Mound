import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Button } from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';
import '../styles/confirmDialog.scss';

function ConfirmDialog(props) {
  const confirm = () => {
    props.setShowDialog(!props.showDialog);
    props.confirm();
  }

  return (
    <Dialog id="confirmDialog" open={props.showDialog}>
      <DialogTitle onClose={() => props.setShowDialog(!props.showDialog)}>
        {props.mHeader}

        <IconButton className="closeDialog" aria-label="close" onClick={() => props.setShowDialog(!props.showDialog)}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {props.mBody}
      </DialogContent>

      <DialogActions>
        <Button className="modalConfirm" variant="contained" onClick={confirm}>Confirm</Button>
        <Button className="modalCancel" variant="contained" onClick={() => props.setShowDialog(!props.showDialog)}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
