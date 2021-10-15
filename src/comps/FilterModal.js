import React from 'react';
import {
  Paper, 
  Modal, 
  Backdrop, 
  Fade
} from '@material-ui/core';
import BigBox from './search/BigBox';
import Filters from './search/Filters';

const FilterModal = (props) => {

    const {open, handleClose, courses, setCourses, setQuery, filteredCourseList, handleOpenSectionModal, requirementList, setRequirements, instructorList, setInstructor, modalWidth} = props;

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
                    { Filters({requirementList, setRequirements, instructorList, setInstructor}) }
                    { BigBox({courses, setCourses, setQuery, filteredCourseList, handleOpenSectionModal, noFilterIcon: true}) }
                    </div>
                </Paper>
            </Fade>
        </Modal>
    );
}

export default FilterModal;