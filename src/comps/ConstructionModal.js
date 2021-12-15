import React from 'react';
import {
  Paper, 
  Modal, 
  Backdrop, 
  Fade
} from '@material-ui/core';
import BigBox from './search/BigBox';
import Filters from './search/Filters';

const ConstructionModal = (props) => {

    const {open, handleClose, modalWidth} = props;

    return (
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        style={{width: modalWidth}}
        BackdropProps={{
        timeout: 500,
        }}
        >
            <Fade in={open}>
                <Paper style={{
                    padding: "20px"
                }}> 
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        flexDirection: "column",
                    }}>
                        <h1>We're working on it!</h1>
                        <p>This site will be under construction during Bucknell's 2021-22 winter break. Feel free to use it, but it won't be receiving any updates until closer to advising season!</p>
                        <p>Questions? Email me at <a href="mailto:hi@rayschedule.com">hi@rayschedule.com</a>.</p>
                    </div>
                </Paper>
            </Fade>
        </Modal>
    );
}

export default ConstructionModal;