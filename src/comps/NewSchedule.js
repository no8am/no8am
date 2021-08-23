import React from 'react';
import './NewSchedule.css'

import { ScheduleComponent, WorkWeek, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import { Button } from '@material-ui/core';
import { Room } from '@material-ui/icons';

const NewSchedule = (props) => {

  const { intervals, width, height, courses, openCourseModal } = props;

  const onEventRendered = React.useCallback((args) => {
    let categoryColor = args.data.CategoryColor;
    if (!args.element || !categoryColor) { return; }
    Object.assign(args.element.style, {
      backgroundColor: categoryColor,
    });
  }, []);

  const data = intervals.map(interval => {
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
    }
  })

  const eventRef = React.useRef();

  const handleOpenCourseModal = (inProps) => {
    for (let i = 0; i < courses.length; i++) {
      if (inProps.Location.split(" ").join("") === courses[i].sections[0].Subj + courses[i].sections[0].Number) {
        openCourseModal(courses[i]);
      }
    }
  }

  const contentTemplate = (props) => {
    const [building, room] = props.Location.split(" ");
    return (
      <div className="event popup content" style={{
        fontSize: '1.5em',
      }}>
        <div className="location" style={{padding: "10px"}}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "left",
          }}>
            <Room style={{padding: "10px"}}/>
            <a style={{color: "black"}} href={`https://my.bucknell.edu/apps/m/building/${building}`} target="_blank" rel="noopener noreferrer">{building}</a>&nbsp;{room}
          </div>
          <div style={{opacity: "0.5", fontSize: '0.75em'}}>
            For more detailed information, including to change section, click the chip from the main panel.
          </div>
        </div>
        {/* <div className="description">
          <Button variant="outlined" color="primary" onClick={() => {
            window.alert("bad practice")
            handleOpenCourseModal(props)
          }}>Additional Info</Button>
        </div>  */}
      </div>
    )
  }

  return (
    <ScheduleComponent 
      width = {width}
      height = {height}
      className = "schedule"
      readonly = {true}
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