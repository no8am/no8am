import React from 'react';

import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Backdrop, Fade } from '@material-ui/core';
import { Info } from '@material-ui/icons';

import { parseMeetingTimes } from '../utils';

const SectionModal = (props) => {

  const {
    openSectionModal,
    classes,
    course,
    CCCs,
    rows,
    columns,
    modalWidth,
    setTempIntervals,
    handleCloseSectionModal,
    handleSectionChange,
  } = props;

  // Add current selection for schedule preview
  const handleMouseOver = row => {
    const { section_obj } = row;
    let newTempIntervals = [];
    parseMeetingTimes(section_obj, newTempIntervals);
    newTempIntervals = newTempIntervals.map(i => {
        return {...i, temp: true};
      }
    )
    setTempIntervals(newTempIntervals);
  }
  
  // Clear out schedule preview
  const handleMouseLeave = () => {
    setTempIntervals([]);
  }
  
  return (
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openSectionModal}
        onClose={handleCloseSectionModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        >
        <Fade in={openSectionModal}>
          <Paper style={{width: modalWidth, margin: 'auto'}}>
            <div style={{display: 'flex', flexDirection: 'row',     justifyContent: 'flex-start', alignItems: 'baseline'}}>
              <h2 className={classes.modalTitle}>{course.title}</h2>
              <Info 
                onClick={() => {
                  if (course.sections) {
                    window.open(`https://coursecatalog.bucknell.edu/search/?P=${course?.department}%20${course.sections[0].Number}`,'_blank')
                  }
                }} 
                style={{cursor: 'pointer', display: 'inline-block', padding: '0px 20px'}}
              />
            </div>
            {course.sections && course.sections[0].Footnote && 
              <p className={classes.modalCCC}>
                <span style={{fontWeight: "bold"}}>Footnote: </span>{course?.sections[0].Footnote}
              </p>
            }
            {CCCs && <p className={classes.modalCCC}>
                      <span style={{fontWeight: "bold"}}>{"CCC: "}</span>{CCCs}
                     </p>}
              <TableContainer 
                className={classes.container} 
                component={Paper} 
                style={{
                  margin: 'auto', 
                  width: modalWidth,
                }}
              >             
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map(column => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map(row => {
                    return (
                      <TableRow style={{cursor: "pointer"}} 
                        onMouseOver={()=>handleMouseOver(row)}
                        onMouseLeave={()=>handleMouseLeave()}
                        onClick={()=>handleSectionChange(row)} 
                        hover
                        tabIndex={-1} 
                        key={row.key}>
                        {columns.map(column => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format ? column.format(value) : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Fade>
      </Modal>
    );
}

export default SectionModal