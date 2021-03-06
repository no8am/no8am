import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    window.location.href = "http://coursicle.com/bucknell";

  };

//   handleClickOpen()

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Our service is temporarily down. "}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            I really wish there was an easy fix on this, but it'll take a little while to get everything back. Use Coursicle for the time being, sorry!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Coursicle
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Also Coursicle
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}