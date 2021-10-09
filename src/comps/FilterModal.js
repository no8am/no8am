import React from 'react';
import {
  Paper, 
  Modal, 
  Backdrop, 
  Fade
} from '@mui/material';
import BigBox from './search/BigBox';
import Filters from './search/Filters';

const FilterModal = (props) => {

    const {open, handleClose, courses, setCourses, setQuery, filteredCourseList, handleOpenSectionModal, requirementList, setRequirements, instructorList, setInstructor, bottomText} = props;

    return (
        <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        // className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        style={{width: "40%"}}
        BackdropProps={{
        timeout: 500,
        }}
        >
            <Fade in={open}>
                <Paper style={{
                    padding: "20px"
                }}> 
                    { BigBox({courses, setCourses, setQuery, filteredCourseList, handleOpenSectionModal, noFilterIcon: true}) }
                    { Filters({requirementList, setRequirements, instructorList, setInstructor}) }
                </Paper>
            </Fade>
        </Modal>
    );
}

export default FilterModal;