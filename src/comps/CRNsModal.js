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

const CRNsModal = (props) => {

    const {open, handleClose, rows, columns, CRNs, classes, modalWidth} = props;

    return (
      <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      >
        <Fade in={open}>
          <TableContainer 
            className={classes.container} 
            component={Paper} 
            style={{
              margin: 'auto', 
              width: modalWidth,
            }}
          >
            <Table stickyHeader size="small" aria-label="sticky table">
              <TableHead>
                <TableRow hover >
                  <TableCell>
                    Course Title
                  </TableCell>
                  <TableCell>
                    Section
                  </TableCell>
                  <TableCell>
                    CRN
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {CRNs}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      </Modal>
    )
}

export default CRNsModal;