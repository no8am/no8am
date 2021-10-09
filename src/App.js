import React, {useState, useEffect} from 'react';
import './App.css';
import Schedule from './Schedule';
import { Autocomplete } from '@mui/material';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Chip, Modal, Backdrop, Fade, Collapse, Box, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_API, ALGOLIA_INDEX_NAME } from './constants';
import { parseMeetingTimes, parseCredits, useWindowSize, createRow, columns, CRNcolumns } from './utils';
import { useStyles } from './comps/styles';

import { seats, instructorList, requirementList, deliveryMethodList, deliveryMethodMap } from './data';
import CRNsModal from './comps/CRNsModal';
import SectionModal from './comps/SectionModal';
import FilterModal from './comps/FilterModal';
import algoliasearch from 'algoliasearch/lite';
import { useFirestoreDocData, useFirestore } from 'reactfire';
import { set } from 'lodash';

import NewSchedule from './comps/NewSchedule';
import BigBox from './comps/search/BigBox';
import Filters from './comps/search/Filters';
import BottomText from './comps/BottomText';
import ScheduleSelect from './comps/ScheduleSelect';

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
  const [schedules, setSchedules] = useState({}); // object of schedules
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
  const [openFilterModal, setOpenFilterModal] = useState(false);
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
    if (uid) { setUID(uid); }
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
    const result = await collection.add({ schedules }); 
    setUID(result.id);
    setIsSaving(false);
    setHasSaved(true);
  }, [isSaving, courses, schedules, collection])

  // Load schedule
  const scheduleData = useFirestoreDocData(collection.doc(uid), {
    startWithValue: {
      schedules: []
    }
  }).schedules;

  useEffect(() => { if (scheduleData) { setSchedules(scheduleData); } }, [scheduleData])
    
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

  const addSchedulesEntry = (args) => {
    console.log("adding entry for args:")
    console.log(args)
    console.log(schedules)
    setSchedules(prevState => (
      {
        ...prevState, 
        [args.id]: args
      }
    ));
    console.log(schedules)
  };

  const updateScheduleName = (id, name) => {
    setSchedules(prevState => ({...prevState, [id]: {...prevState[id], name}}));
  };

  const updateScheduleCourses = (id) => {
    const vary = Object.assign({}, schedules[id])
    setCourses(() => {
      return vary.courses
    });
  };

	 return (
    <div className={classes.app} style={{ width, height: appHeight }}>
      <div className={classes.courseSelector} style={{ width: courseSelectorWidth, height}}>

        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '45px'}}>
          <h1 style={{margin: 0}}>&lsquo;ray schedule</h1>
          <h6 style={{margin: 0, fontWeight: 400}}><i>the student-made course scheduling solution for Bucknell University</i></h6>
        </div>

        { BigBox({courses, setCourses, setQuery, filteredCourseList, handleOpenSectionModal, setOpenFilterModal}) }

        <div className={classes.CRNs} style={{zIndex: 99, display: "flex"}}>

          {FilterModal({
            open: openFilterModal,
            handleClose: () => {
              setInstructor(null);
              setRequirements([]);
              setOpenFilterModal(false);
            },
            courses, setCourses, setQuery, filteredCourseList, handleOpenSectionModal, 
            requirementList, setRequirements, instructorList, setInstructor,
            bottomText: BottomText({classes, saveSchedule, hasSaved, uid, classHour, credits})
          })}

          {CRNsModal({
            open: openCRNsModal,
            handleClose: () => setOpenCRNsModal(false),
            CRNs, classes, modalWidth,
            bottomText: BottomText({classes, saveSchedule, hasSaved, uid, classHour, credits}),
          })}

          <Button 
            style={{ margin: "15px", width: "100%" }} 
            variant="outlined" 
            onClick={() => {
              setOpenCRNsModal(true);
            }}
          >Export</Button>
          {/* <Button onClick={() => {
            const frank = (new Date()).getSeconds();
            addSchedulesEntry({id:frank, display: (new Date()).getSeconds(), schedule: []})
            console.log(schedules)
          }}>Save</Button> */}
          { ScheduleSelect({courses, schedules, addSchedulesEntry, updateScheduleName, updateScheduleCourses}) }
        </div>
      </div>
      <div/>
      <NewSchedule 
        intervals={intervals}
        tempIntervals={tempIntervals}
        margin={margin} 
        width={scheduleWidth} 
        height={height}
        className={classes.schedule}
        courses={courses}
        openCourseModal = {handleOpenSectionModal}
      />

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
