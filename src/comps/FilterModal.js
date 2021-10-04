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

    const {open, handleClose, courses, setCourses, setQuery, filteredCourseList, handleOpenSectionModal, requirementList, setRequirements, instructorList, setInstructor} = props;

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
                    { BigBox({courses, setCourses, setQuery, filteredCourseList, handleOpenSectionModal}) }
                    { Filters({requirementList, setRequirements, instructorList, setInstructor}) }
                </Paper>
            </Fade>
        </Modal>
    );
}

export default FilterModal;