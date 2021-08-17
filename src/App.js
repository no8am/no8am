import React, {useState, useEffect} from 'react';
import './App.css';
import Schedule from './Schedule';
import { Autocomplete } from '@material-ui/lab';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Chip, Modal, Backdrop, Fade, Collapse, Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_API, ALGOLIA_INDEX_NAME } from './constants';
import { parseMeetingTimes, parseCredits, useWindowSize, createRow, columns, CRNcolumns } from './utils';
import { useStyles } from './comps/styles';

import { seats, instructorList, requirementList, deliveryMethodList, deliveryMethodMap } from './data';
import CRNsModal from './comps/CRNsModal';
import SectionModal from './comps/SectionModal';
import algoliasearch from 'algoliasearch/lite';
import { useFirestoreDocData, useFirestore } from 'reactfire';
import { set } from 'lodash';


const searchClient = algoliasearch(
  ALGOLIA_APP_ID, 
  ALGOLIA_SEARCH_ONLY_API
);
const algoliaIndex = searchClient.initIndex(ALGOLIA_INDEX_NAME);

// Margin of schedule
const margin = {
  'left': 50,
  'right': 50,
  'top': 50,
  'bottom': 10,
}

export default function App(props) {
  const { width, height } = useWindowSize();
  const courseSelectorWidth = width < 600 ? width : width * 0.4;
  const modalWidth = width < 600 ? width : width * 0.5;
  const scheduleWidth = width < 600 ? width : width * 0.6;
  const appHeight = width < 600 ? height * 2 : height;
  const classes = useStyles();
  
  // Courses
  const [query, setQuery] = useState(''); // Algolia search queary
  const [course, setCourse] = useState({}); // for section selection of a single course
  const [courses, setCourses] = useState([]); // currently selected courses on schedule
  const [sections, setSections] = useState([]); // currently selected course sections
  const [classHour, setClassHour] = useState(0); // total class hours
  const [intervals, setIntervals] = useState([]); // a list of [start, end] periods for shcedule display
  const [tempIntervals, setTempIntervals] = useState([]); // same as above, but for previewing when use hovers over section
	const [credits, setCredits] = useState(0); // total credits
	const [CRNs, setCRNs] = useState([]); // currently selected CRNs
  
  // Filters
  const [instructor, setInstructor] = useState(null); // currently selected instructor
  const [requirements, setRequirements] = useState([]);  // currently selected requirements
  const [deliveryFormat, setDeliveryFormat] = useState(null); // Online or classroom instruction
  const [filteredCourseList, setFilteredCourseList] = useState([]);
  
  // Modal/ Table
  const [openSectionModal, setOpenSectionModal] = useState(false);
  const [openCRNsModal, setOpenCRNsModal] = useState(false);
  const [rows, setRows] = useState([]);
  const CCCs = course.sections && course.sections[0].Reqs.map(req => req.Code).join(", ");

  const handleOpenSectionModal = course => { setCourse(course); setOpenSectionModal(true); };
  const handleCloseSectionModal = () => { setOpenSectionModal(false); };

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
    setOpenSectionModal(false);
  }

  // Saving and loading schedule
  const [ uid, setUID ] = useState(' ');
  
  // Parse URL on start
  useEffect(() => {
    const url = window.location.href;
    const array = url.split('/');
    const uid = array[array.length - 1];
    if (uid) {
      setUID(uid);      
    }
  }, [])

  const collection = useFirestore().collection('2021spring');

  // Save schedule onClick
  const [isSaving, setIsSaving] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const saveSchedule = React.useCallback(async () => {
    if (isSaving) {
      return
    }
    setIsSaving(true);
    const result = await collection.add({ courses });
    setUID(result.id);
    setIsSaving(false);
    setHasSaved(true);
  }, [isSaving, courses, collection])

  // Load schedule
  const scheduleData = useFirestoreDocData(collection.doc(uid), {
    startWithValue: {
      courses: []
    }
  }).courses;

  useEffect(() => { if (scheduleData) { setCourses(scheduleData); } }, [scheduleData])
    
  // Clear out schedule preview when modal is closed
  useEffect(() => {
    if (openSectionModal) return undefined;
    setTempIntervals([]);
  }, [openSectionModal])

  // Populate modal table when user clicks on a course chip
  useEffect(() => {
    if (!course.sections) return undefined;
    const rows = course.sections.map(section => createRow(section, seats))
    setRows(rows);
  }, [course])

  // Updates the sections to be displayed in schedule whenever selected courses/sections change
  useEffect(() => {
    const sections = courses.map(course => course.section || course.sections[0]);
    setSections(sections);
  }, [courses])

  useEffect(() => {
  	let intervals = [];
  	const lectureTimes = sections.map(section => parseMeetingTimes(section, intervals));
  	const classHour = Math.round(lectureTimes.reduce((a,b)=>a+b, 0) / 60 * 2) / 2;	
  	const credits = courses.map(course => parseCredits(courses)) // something
  	const CRNs = sections.map(section => 
  		<TableRow width="max" height="min">
  			<TableCell width="1500px">
          {/* {section.DeptCodes[0] + section.Number + "-" + section.Section + " — " + section.Title} */}
  				{section.DeptCodes[0] + section.Number + " " + section.Title}
  			</TableCell>
        <TableCell>
          {section.Section}
        </TableCell>
  			<TableCell align="right">
  				{section.Crn}
  			</TableCell>
  		</TableRow>
  	);
  	setClassHour(classHour);
  	setCredits(credits);
  	setIntervals(intervals);
  	setCRNs(CRNs);
  }, [sections, courses])
	  
  useEffect(() => {
    (async () => {
      const CCR_codes = requirements.map(r => r.split('-')[0]);
      const CCR_filter = CCR_codes.map(c => `sections.Reqs.Code:"${c}"`).join(' AND ')
      const instructor_filter = instructor ? `sections.Instructors.Display:"${instructor}"` : '';
      const delivery_filter = deliveryFormat ? `sections.DeliveryMethods:"${deliveryMethodMap[deliveryFormat]}"` : '';
      
      let filters = [];
      if (CCR_filter) filters.push(CCR_filter);
      if (instructor_filter) filters.push(instructor_filter);
      if (delivery_filter) filters.push(delivery_filter);
      filters = filters.join(' AND ')
      
      algoliaIndex
        .search(query, { filters })
        .then(({ hits }) => {
          setFilteredCourseList(hits)
        })
    })();
  }, [query, requirements, instructor, deliveryFormat]);

  const SearchBox = () => (
    <Autocomplete
      size="small"
      style={{margin: '15px'}}
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
              onClick={()=>handleOpenSectionModal(option)}
              style={{backgroundColor:option.color}}
              label={(
                <section 
                  // style={{fontFamily: "Roboto"}}
                >
                  <span style={{fontWeight: "bold", marginRight: 5, color: "white"}}> {option.sections[0].DeptCodes[0] + " " + option.sections[0].Number}</span>
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
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '45px'}}>
          <h1 style={{margin: 0}}>&lsquo;ray schedule</h1>
          <h6 style={{margin: 0, fontWeight: 400}}><i>the student-made course scheduling solution for Bucknell University</i></h6>
        </div>
        { SearchBox() }
        <div className = "autoCompleteWrapper" style={{ display: "flex", flexDirection: "row"}}>
        <Autocomplete
          size="small"
          autoHighlight
          disableListWrap
          multiple
          filterSelectedOptions
          onChange={(e, reqs) => setRequirements(reqs) }
          id="add-requirement-autocomplete"
          options={requirementList}
          style={{ width: courseSelectorWidth * 0.45, marginLeft: 15, marginRight: 15, marginBottom: 15, float: "left"}}
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
            size="small"
            autoHighlight
            filterSelectedOptions
            onChange={(e, instructor) => setInstructor(instructor) }
            id="add-instructor-autocomplete"
            options={instructorList}
            style={{ width: courseSelectorWidth * 0.45, marginLeft: 15, marginRight: 15, marginBottom: 15, float: "right"}}
            renderInput={params => <TextField {...params} label="Instructor" variant="outlined" />}
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
        </div>
        <div className={classes.bottomText}>
          <Button style={{ padding: 10, margin: 15, width: "95%" }} variant="outlined" onClick={saveSchedule}>Save Schedule</Button>
          <div style={{ color: 'white', marginBottom: 10 }} className={classes.classHour}><p>{ hasSaved ? window.location.origin+'/'+uid : ''}</p></div>
          <p className={classes.classHour}> {credits[0] == null ? 0 : credits[0]} credits, {classHour} class hours </p>          
          <p className={classes.shamelessplug}>
            <a href="https://github.com/no8am/no8am" target="_blank" rel="noopener noreferrer"> © 2021 no8am.v3α</a>&nbsp;•&nbsp;Jimmy Wei '21&nbsp;•&nbsp;
            <a href="http://nickdemarchis.com" target="_blank" rel="noopener noreferrer">Nick DeMarchis '22</a>
            <br /><a href="https://forms.gle/h7A8zgGPAm7PpWDr5" target="_blank" rel="noopener noreferrer">Feedback</a>&nbsp;•&nbsp;
            <a href="https://github.com/no8am/no8am" target="_blank" rel="noopener noreferrer">Github &amp; bugs</a> 
            <br />Database last updated 08/17/2021.</p>
        </div>
        <div className={classes.CRNs} style={{zIndex: 99}}>
          {CRNsModal({
            open: openCRNsModal,
            handleClose: () => setOpenCRNsModal(false),
            CRNs,
            classes,
            modalWidth,
          })}
          <Button 
            style={{ padding: 10, margin: 15, width: "95%" }} 
            variant="outlined" 
            disabled={CRNs.length <= 0}
            onClick={() => {
              CRNs.length > 0 ? setOpenCRNsModal(true) : setOpenCRNsModal(false);
            }}
          >Show CRN's</Button>
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

      { SectionModal({
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
      }) }
    </div>
  )
}
