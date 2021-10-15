import React from 'react';
import './NewSchedule.css'

import { ScheduleComponent, WorkWeek, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { Button } from '@material-ui/core';
import { Room, Person, Schedule } from '@material-ui/icons';

const NewSchedule = (props) => {

  const { intervals, tempIntervals, width, height, courses, openCourseModal } = props;

  const onEventRendered = React.useCallback((args) => {
    let categoryColor = args.data.CategoryColor;
    if (!args.element || !categoryColor) { return; }
    Object.assign(args.element.style, {
      backgroundColor: categoryColor,
    });
  }, []);

  const fullIntervals = () => {
    const tempIntervalsTrans = tempIntervals.map(interval => {
        let intCopy = { ...interval };
        intCopy.color += "99"
        return intCopy;
      })
    return intervals.concat(tempIntervalsTrans);
  }

  const data = fullIntervals().map(interval => {
    let weekDayNum;
    switch (interval.weekDay) {
      case "M":
        weekDayNum = 1;
        break;
      case "T":
        weekDayNum = 2;
        break;
      case "W":
        weekDayNum = 3;
        break;
      case "R":
        weekDayNum = 4;
        break;
      case "F":
        weekDayNum = 5;
        break;
      default:
        weekDayNum = 6;
        break;
    }
    const description = "coming soon!";
    return {
      Subject: interval.courseTitle,
      StartTime: new Date(2018, 0, weekDayNum, interval.start.hour, interval.start.minute),
      EndTime: new Date(2018, 0, weekDayNum, interval.end.hour, interval.end.minute),
      IsAllDay: false,
      CategoryColor: interval.color.toString(),
      Description: description,
      Location: interval.location,
      Instructors: interval.instructorString,
    }
  })

  const eventRef = React.useRef();

  const handleOpenCourseModal = (inProps) => {
    for (let i = 0; i < courses.length; i++) {
      let name = inProps.Subject.split(" ").join("")
      let name2 = courses[i].sections[0].Subj + courses[i].sections[0].Number
      if (name === name2) {
        openCourseModal(courses[i]);
      }
    }
  }

  const bulletPoints = (props) => {
    const [building, room] = props.Location ? props.Location.split(" ") : ["", ""];
    let instructorList = props.Instructors.split("; ")
    let instructorLinks = instructorList.map((instructor, index) => {
      let instructorPretty = instructor.split(" ")
      if (instructorPretty.length > 2) { instructorPretty.pop() }
      instructorPretty = instructorPretty.map(word => word.replace(",", ""));
      instructorPretty.unshift(instructorPretty.pop())
      instructorPretty.join(" ");
      const end = index === instructorList.length - 1 ? " " : "; "
      return (
      <span><a 
        style={{color: "black"}} 
        href={`https://www.ratemyprofessors.com/search/teachers?query=${instructorPretty}&sid=U2Nob29sLTE0MA==`} 
        target="_blank" 
        rel="noopener noreferrer"
      >{instructor}</a>{end}</span>
      );
    })

    return (
      <div className="bullet-point-info" style={{padding: "10px", fontSize: "10pt"}}>
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
          }}>
            <Schedule style={{padding: "10px 10px 10px 0px"}}/>
            <span>
              {props.StartTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {props.EndTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        {(building) && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
          }}>
            <Room style={{padding: "10px 10px 10px 0px"}}/>
            <span>
              <a 
              style={{color: "black"}} 
              href={`https://my.bucknell.edu/apps/m/building/${building}`} 
              target="_blank" 
              rel="noopener noreferrer">
                {building}&nbsp;{room}
              </a>
            </span>
          </div>
        )}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
        }}>
          <Person style={{padding: "10px 10px 10px 0px"}}/>
          <span>{instructorLinks}</span>
        </div>
    </div>
    )
  }

  const contentTemplate = (props) => {
    return (
      <div className="event popup content" style={{
        fontSize: '1.5em',
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        {bulletPoints(props)}
        <div className="description" style={{padding: "15px"}}>
          <Button variant="outlined" color="primary" onClick={() => {handleOpenCourseModal(props)}}>Edit</Button>
        </div> 
      </div>
    )
  }

  return (
    <ScheduleComponent 
      width = {width}
      height = {height}
      className = "schedule"
      readonly = {true}
      timeScale={{ enable: true, interval: 60, slotCount: 2 }}
      minDate = {new Date(2018, 0, 1)}
      maxDate = {new Date(2018, 0, 5)}
      selectedDate = {new Date(2018, 0, 1)}
      eventRendered = {onEventRendered}
      eventSettings = {{ 
        dataSource: data,
        fields: {
            subject: { name: 'Subject' },
            isAllDay: { name: 'IsAllDay' },
            startTime: { name: 'StartTime' },
            endTime: { name: 'EndTime' },
            categoryColor: { name: 'CategoryColor' },
            description: { name: 'Description' },
            location: { name: 'Location' },
            instructors: { name: 'Instructors' },
        }
      }}
      ref={eventRef}
      quickInfoTemplates={{
        content: contentTemplate
      }}
    >
      <ViewsDirective>
        <ViewDirective option='WorkWeek' startHour='08:00' endHour='22:00'/>
      </ViewsDirective>
      <Inject services={[WorkWeek]}/>
    </ScheduleComponent>
  );
}

export default NewSchedule;