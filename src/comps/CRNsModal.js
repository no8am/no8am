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

    const {open, handleClose, rows, columns, CRNs, classes, modalWidth, bottomText} = props;

    return (
      <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      style={{width: modalWidth}}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      >
        <Fade in={open}>
          <Paper style={{padding: "20px"}}>
            <div>
              {CRNs.length > 0  && (
                <TableContainer 
                  className={classes.container} 
                  component={Paper} 
                  style={{
                    margin: 'auto', 
                    // width: modalWidth,
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
              )}
              <div>
                {bottomText}
              </div>
            </div>
          </Paper>
        </Fade>
      </Modal>
    )
}

export default CRNsModal;