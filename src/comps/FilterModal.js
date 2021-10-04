import React from 'react';
import {
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  TableContainer, 
  Paper, 
  Modal, 
  Backdrop, 
  Fade
} from '@material-ui/core';

const FilterModal = (props) => {

    const {open, handleClose} = props;

    return (
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        // className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
        timeout: 500,
        }}
        >
            <Fade in={open}>
                <Paper style={{
                    padding: "20px"
                }}>
                    hey!
                </Paper>
            </Fade>
        </Modal>
    );
}

export default FilterModal;