import React from 'react';
import './App.css';
import Schedule from './Schedule';
import { Autocomplete } from '@material-ui/lab';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Chip, Modal, Backdrop, Fade } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_API, ALGOLIA_INDEX_NAME } from './constants';
import { parseMeetingTimes, useWindowSize, createRow, columns } from './utils';
// import { ListboxComponent } from './virtualization';
import { seats, instructorList, requirementList } from './data';
import algoliasearch from 'algoliasearch/lite';
import { useFirestoreDocData, useFirestore } from 'reactfire';


const searchClient = algoliasearch(
  ALGOLIA_APP_ID, 
  ALGOLIA_SEARCH_ONLY_API
);
const algoliaIndex = searchClient.initIndex(ALGOLIA_INDEX_NAME);

const useStyles = makeStyles(theme => ({
  listbox: {
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
  bottomText: {
    position: "absolute",
    bottom: 0,
    color: "white",
    [theme.breakpoints.down('xs')]: {
        width: "100%",
      },
      [theme.breakpoints.up('sm')]: {
        width: "40%",   
      },
  },
  shamelessplug: {
    textAlign: "center",
  },
  classHour: {
    textAlign: "center",
    fontWeight: "bold",
  },
  app: {
    display: "flex",
    [theme.breakpoints.down('xs')]: {
        flexDirection: "column",
      },
      [theme.breakpoints.up('sm')]: {
        flexDirection: "row", 
      },
    background: "linear-gradient(0deg, rgba(113,140,187,1) 0%, rgba(240,137,6,0.3124613569985971) 100%);",
  },
  schedule: {
    flex: 1,
  },
  courseSelector: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  modal: {
    display: 'flex',
    alignItems: 'start',
    justifyContent: 'start',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  container: {
    maxHeight: 440,
  },
  modalTitle: {
    marginLeft: 30,
    marginTop: 30,
    fontFamily: "Roboto"
  },
  modalCCC: {
    marginLeft: 45,
    fontFamily: "Roboto"
  },
}));

// Margin of schedule
const margin = {
  'left': 50,
  'right': 50,
  'top': 50,
  'bottom': 10,
}

export default function App(props) {
  const size = useWindowSize();
  const { width, height } = size;
  const courseSelectorWidth = width < 600 ? width : width * 0.4;
  const modalWidth = width < 600 ? width : width * 0.5;
  const scheduleWidth = width < 600 ? width : width * 0.6;
  const appHeight = width < 600 ? height * 2 : height;
  const classes = useStyles();
  
  // Courses
  const [query, setQuery] = React.useState(''); // Algolia search queary
  const [course, setCourse] = React.useState({}); // for section selection of a single course
  const [courses, setCourses] = React.useState([]); // currently selected courses on schedule
  const [sections, setSections] = React.useState([]); // currently selected course sections
  const [classHour, setClassHour] = React.useState(0); // total class hours
  const [intervals, setIntervals] = React.useState([]); // a list of [start, end] periods for shcedule display
  const [tempIntervals, setTempIntervals] = React.useState([]); // same as above, but for previewing when use hovers over section
  
  // Filters
  const [instructor, setInstructor] = React.useState(null); // currently selected instructor
  const [requirements, setRequirements] = React.useState([]);  // currently selected requirements
  const [filteredCourseList, setFilteredCourseList] = React.useState([]);
  
  // Modal/ Table
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([]);
  const CCCs = course.sections && course.sections[0].Reqs.map(req => req.Code).join(", ");
  
  const handleOpen = course => {
    setCourse(course);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSectionChange = row => {
    const  { section, title } = row;
    const new_courses = courses.map(course =>  {
      if (course.title === title) {
        let sect;
        for (sect of course.sections) {
          if (sect.Section === section) {
            course.section = sect;
          }
        }
      }
      return course;
    });
    setCourses(new_courses);
    setOpen(false);
  }

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

  // Saving and loading schedule
  const [ uid, setUID ] = React.useState(' ');
  
  // Parse URL on start
  React.useEffect(() => {
    const url = window.location.href;
    const array = url.split('/');
    const uid = array[array.length - 1];
    if (uid) {
      setUID(uid);      
    }
  }, [])

  const collection = useFirestore().collection('2021spring');

  // Save schedule onClick
  const [isSaving, setIsSaving] = React.useState(false);
  const saveSchedule = React.useCallback(async () => {
    if (isSaving) {
      return
    }
    setIsSaving(true);
    const result = await collection.add({ courses });
    setUID(result.id);
    setIsSaving(false);
  }, [isSaving, courses])

  // Load schedule
  const scheduleData = useFirestoreDocData(collection.doc(uid), {
    startWithValue: {
      courses: []
    }
  }).courses;

  React.useEffect(() => {
    if (scheduleData) {
      setCourses(scheduleData);
    }
  }, [scheduleData])
    
  // Clear out schedule preview when modal is closed
  React.useEffect(() => {
    if (open) return undefined;
    setTempIntervals([]);
  }, [open])

  // Populate modal table when user clicks on a course chip
  React.useEffect(() => {
    if (!course.sections) return undefined;
    const rows = course.sections.map(section => createRow(section, seats))
    setRows(rows);
  }, [course])

  // Updates the sections to be displayed in schedule whenever selected courses/sections change
  React.useEffect(() => {
    const sections = courses.map(course => course.section || course.sections[0]);
    setSections(sections);
  }, [courses])

  React.useEffect(() => {
    let intervals = [];
    const lectureTimes = sections.map(section => parseMeetingTimes(section, intervals));
    const classHour = Math.round(lectureTimes.reduce((a,b)=>a+b, 0) / 60 * 2) / 2;
    setClassHour(classHour);
    setIntervals(intervals);
  }, [sections])
  
  React.useEffect(() => {
    (async () => {
      const CCR_codes = requirements.map(r => r.split('-')[0]);
      const CCR_filter = CCR_codes.map(c => `sections.Reqs.Code:"${c}"`).join(' AND ')
      const instructor_filter = instructor ? `sections.Instructors.Display:"${instructor}"` : '';
      // Horrid ternary conditonal but oh well
      const filters = (CCR_filter && instructor_filter) ? 
                      [CCR_filter, instructor_filter].join(' AND ') :
                      CCR_filter ? CCR_filter : instructor_filter;
      algoliaIndex
        .search(query, { filters })
        .then(({ hits }) => {
          setFilteredCourseList(hits)
        })
    })();
  }, [query, requirements, instructor]);

  const SearchBox = () => (
    <Autocomplete
      size={width < 600 ? "small" : "medium"}
      style={{marginLeft: 15, marginRight: 15, marginBottom: 15, marginTop: 45}}
      //ListboxComponent={ListboxComponent}
      // loading={loading}
      autoHighlight
      filterSelectedOptions
      multiple
      value={courses}
      onChange={(e, courses) => setCourses(courses) }
      onInputChange={(e, query) => setQuery(query) }
      id="add-course-autocomplete"
      options={filteredCourseList}
      getOptionLabel={option => option.title}
      renderInput={params => (
      <TextField
        {...params}
        label="Add Course (*click chip to select section)"
        variant="outlined"
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <React.Fragment>
              {
                //loading ? <CircularProgress color="inherit" size={20} /> : null
              }
              {params.InputProps.endAdornment}
            </React.Fragment>
              ),
            }}
          />
        )}
        renderOption={(option, { inputValue }) => {
          // Highlight parts of text that matches input
          const matches = match(option.title, inputValue);
          const parts = parse(option.title, matches);
          return (
            <div>
              {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
            </div>
          );
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              onClick={()=>handleOpen(option)}
              style={{backgroundColor:option.color}}
              label={(
                <section style={{fontFamily: "Roboto"}}>
                  <span style={{fontWeight: "bold", marginRight: 5, color: "white"}}> {option.title}</span>
                  <span style={{verticalAlign: "middle", color: "white", fontSize: 10}}> {`${option.sections.length} ` + (option.sections.length === 1 ? "Section" : "Sections")}</span>
                </section>
              )}
              {...getTagProps({ index })} />
          ))
        }
    />
  )

  return (
    <div className={classes.app} style={{ width, height: appHeight }}>
      <div className={classes.courseSelector} style={{ width: courseSelectorWidth, height}}>
        { SearchBox() }
        <Autocomplete
          size={width < 600 ? "small" : "medium"}
          autoHighlight
          multiple
          filterSelectedOptions
          onChange={(e, reqs) => setRequirements(reqs) }
          id="add-requirement-autocomplete"
          options={requirementList}
          style={{ marginLeft: 15, marginRight: 15, marginBottom: 15 }}
          renderInput={params => <TextField {...params} label="Requirements" variant="outlined" />}
          renderOption={(option, { inputValue }) => {
            // Highlight parts of text that matches input
            const matches = match(option, inputValue);
            const parts = parse(option, matches);
            return (
              <div>
                {parts.map((part, index) => (
                  <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                  </span>
                ))}
              </div>
            );
          }}
        />
        <Autocomplete
          size={width < 600 ? "small" : "medium"}
          autoHighlight
          filterSelectedOptions
          onChange={(e, instructor) => setInstructor(instructor) }
          id="add-instructor-autocomplete"
          options={instructorList}
          style={{ width: courseSelectorWidth * 0.5, marginLeft: 15, marginRight: 15, marginBottom: 15 }}
          renderInput={params => <TextField {...params} label="Insturctor" variant="outlined" />}
          renderOption={(option, { inputValue }) => {
            // Highlight parts of text that matches input
            const matches = match(option, inputValue);
            const parts = parse(option, matches);
            return (
              <div>
                {parts.map((part, index) => (
                  <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                  </span>
                ))}
              </div>
            );
          }}
        />
        <Button style={{ padding: 10, margin: 15 }} variant="outlined" onClick={saveSchedule}>Save Schedule</Button>
        <div style={{ marginLeft: 15 }}>{ window.location.origin+'/'+uid }</div>
        <div className={classes.bottomText}>
          <p className={classes.classHour}> {classHour} class hours </p>
          <p className={classes.shamelessplug}>© 2020 no8am² • <a href="https://github.com/icewing1996/no8am-2"> Github </a> • Jimmy Wei '20</p>
        </div>
      </div>
      <div/>
      <Schedule
        className={classes.schedule}
        intervals={intervals}
        tempIntervals={tempIntervals}
        margin={margin} 
        width={scheduleWidth} 
        height={height}/>
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
          <Paper style={{width: modalWidth}}>
            <h2 className={classes.modalTitle}>{course.title}</h2>
            {CCCs && <p className={classes.modalCCC}>
                      <span style={{fontWeight: "bold"}}>{"CCC: "}</span>{CCCs}
                     </p>}
            <TableContainer className={classes.container} style={{width: modalWidth}}>
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
    </div>
  )
}