import React from 'react';
import './NewSchedule.css'

import { ScheduleComponent, WorkWeek, Inject, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';

const NewSchedule = (props) => {

  const { intervals, width, height } = props;

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

    const onClick = (event) => {console.log("clicked!")}
    const description = "Click here to adjust section, and to view course description and books.";
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
    >
      <ViewsDirective>
        <ViewDirective option='WorkWeek' startHour='08:00' endHour='22:00'/>
      </ViewsDirective>
      <Inject services={[WorkWeek]}/>
    </ScheduleComponent>
  );
}

export default NewSchedule;