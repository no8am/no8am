import React, { useEffect, useState } from 'react';

export const timeToMinute = timeObj => {
  const { hour, minute } = timeObj;
  return 60 * hour + minute;
}

export const time2Str = (minuteStr, first_class) => {
  const start = 60 * first_class.hour + first_class.minute;
  const realTime = start + parseInt(minuteStr);
  let hour = Math.floor(realTime / 60);
  let minute = realTime % 60;
  if (hour < 10) hour = '0' + hour;
  if (minute < 10) minute = '0' + minute;
  return  `${hour}:${minute}`
}

export const timeStr2timeObj = timeStr => {
  // Converts a time string e.g. "08:00 AM" to { hour: 8, minute: 0}
  let am_pm = timeStr.split(" ")[1];
  let [ hour, minute] = timeStr.split(" ")[0].split(":").map(str => parseInt(str));
  if (am_pm === "PM") {
    hour += 12;
  }
  return { hour, minute }
}

export const hashStr = string => {
  // Hash a string, for picking colors
  var hash = 0;
  if (string.length === 0) {
      return hash;
  }
  for (var i = 0; i < string.length; i++) {
      var char = string.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
  }
  return Math.max(-hash, hash); // Force positive
}

export const formatTitle = course => {
  const { Subj, Title } = course;
  const number = course.Number;
  return `${Subj} ${number} - ${Title}`;
}

// For modal table, display course section selection
export function createRow(section_obj, seats_table) {
  const section = section_obj.Section;
  const crn = section_obj.Crn;
  const time = section_obj.Meetings;
  const room = section_obj.Meetings;
  const instructor = section_obj.Instructors;
  const seats = seats_table[section_obj.Id] ? seats_table[section_obj.Id] : 0;
  const credit = section_obj.Credit;
  const key = section_obj.Title + section; // for render list in React
  const title = `${section_obj.Subj} ${section_obj.Number} - ${section_obj.Title}`;
  const method = section_obj.DeliveryMethods;
  const links = section_obj;
  return { section, crn, time, room, instructor, seats, credit, key, title, method, links, section_obj };
}


const formatMeetingTime = meetings => {
  let meeting;
  let result = [];
  for (meeting of meetings) {
      const startText = meeting.Start;
      const endText = meeting.End;
      if (!startText || !endText) continue;
      const start = {
        hour: startText.slice(0,2),
        minute: startText.slice(2,)
      }
      const end = {
        hour: endText.slice(0,2),
        minute: endText.slice(2,)
      }
      let weekDays = "";
      if (meeting.M === "Y") weekDays += "M";
      if (meeting.T === "Y") weekDays += "T";
      if (meeting.W === "Y") weekDays += "W";
      if (meeting.R === "Y") weekDays += "R";
      if (meeting.F === "Y") weekDays += "F";
      const string = `${weekDays} ${start.hour}:${start.minute} - ${end.hour}:${end.minute}`;
      result.push(string);
    }
  if (result.length === 0) return "N/A";
  return result.join("\n");
}

const formatMeetingRoom = meetings => {
  const result = meetings.map(meeting => meeting.Location).join("\n");
  if (!result) return "N/A";
  return result;
}

const formatInstructor = instructors => {
  const result =  instructors.map(instructor => instructor.Display).join("\n");
  if (!result) return "N/A";
  return result;
}

const formatMethod = methods => {
  const result = methods.map(method => reFormatMethod(method)).join("\n");

  return result;
}

const formatLinks = section => {
  const xmlLink = `<?xml version='1.0' encoding='UTF-8'?><textbookorder><school id='63056' ></school><courses><course dept='${section?.Subj}' num='${section?.Number}' sect='${section?.Section}' term='F219'></course></courses></textbookorder>`
  return (
    <div style={{display: 'flex', flexDirection: 'column', flexWrap: 'wrap', alignItems: 'flex-start'}}>
      <a 
        href={`https://banner.ban.bucknell.edu/prodssb/hwzkdpac.P_Bucknell_CGUpdate?formopt=VIEWSECT&term=${section?.Term}&updsubj=${section?.Subj}&crn=${section?.Crn}&viewterm=${section?.Term}`} 
        style={{color: 'black'}}
        target="_blank" 
        rel="noopener noreferrer" >
        Guide
      </a>
      <a 
        href={`https://banner.ban.bucknell.edu/prodssb/bwckctlg.p_disp_course_detail?cat_term_in=${section?.Term}&subj_code_in=${section?.Subj}&crse_numb_in=${section?.Number}` }
        style={{color: 'black'}}
        target="_blank" 
        rel="noopener noreferrer" >
        Desc
      </a>
      <form action="https://securex.bncollege.com/webapp/wcs/stores/servlet/TBListView?cm_mmc=RI-_-737-_-A-_-1" method="POST" target="_blank" className="ng-pristine ng-valid">
        <input type="hidden" name="termMapping" value="N" />
        <input type="hidden" name="catalogId" value="10001" />
        <input type="hidden" name="storeId" value="63056" />
        <input type="hidden" name="courseXml" value={xmlLink} />
        <input 
          type="submit" 
          value="Books" 
          className="getBooksButton" 
          style={{
            border: '0',
            backgroundColor: 'transparent',
            fontSize: 'unset',
            fontFamily: 'unset',
            padding: '0',
            cursor: 'pointer',
          }} />
      </form>
    </div>
  )
}

const reFormatMethod = method => {
  if (method === "RCAR") {return "Classroom and Remote Instruction"}
  else if (method === "RRMT") {return "Remote Instruction"}
  else if (method === "RCLA") {return "Classroom Instruction"}
}

// Section Time Room Instructor Seats Credit Footnote 
export const columns = [
  { id: 'crn',
    label: 'CRN',
    minWidth: 5,
  },
  { id: 'time',
    label: 'Time', 
    minWidth: 5,
    format: value => formatMeetingTime(value),
  },
  {
    id: 'room',
    label: 'Room',
    minWidth: 5,
    format: value => formatMeetingRoom(value),
  },
  {
    id: 'instructor',
    label: 'Instructor',
    minWidth: 5,
    format: value => formatInstructor(value),
  },
  {
    id: 'seats',
    label: 'Seats',
    minWidth: 5,
    align: 'right',
  },
  {
    id: 'credit',
    label: 'Credit',
    minWidth: 5,
    align: 'right',
    format: value => value && value.toFixed(1),
  },
  {
    id: 'links',
    label: 'Links',
    minWidth: 5,
    format: value => formatLinks(value),
  }
];

export const CRNcolumns = [
  { id: 'title',
    label: 'Course Title',
    minWidth: 5,
    align: 'left',
  },
  { id: 'section',
    label: 'Course Section',
    minWidth: 5,
    align: 'left',
  },
  { id: 'crn',
    label: 'CRN',
    minWidth: 5,
    align: 'right',
  },
];

export function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }
    
    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export const parseMeetingTimes = (section, intervals) => {
  const courseTitle = section.Subj + " " + section.Number;
  const { color, Crn } = section;
  const instructorString = section.Instructors.map(instructor => instructor.Display).join("; ");
  let totalLectureTime = 0;
  let meeting;
  for (meeting of section.Meetings) {
    const startText = meeting.Start;
    const endText = meeting.End;
    const location = meeting.Location;
    if (!startText || !endText) continue;
    const start = {
      hour: parseInt(startText.slice(0,2)),
      minute: parseInt(startText.slice(2,))
    }
    const end = {
      hour: parseInt(endText.slice(0,2)),
      minute: parseInt(endText.slice(2,))
    }
    let weekDays = "";
    let weekDay;
    if (meeting.M === "Y") weekDays += "M";
    if (meeting.T === "Y") weekDays += "T";
    if (meeting.W === "Y") weekDays += "W";
    if (meeting.R === "Y") weekDays += "R";
    if (meeting.F === "Y") weekDays += "F";
    for (weekDay of weekDays) {
      intervals.push({ weekDay, start, end, courseTitle, color, startText, endText, location, Crn, instructorString });
      const lectureTime = (end.hour - start.hour) * 60 + (end.minute - start.minute);
      totalLectureTime += lectureTime;
    }
    // const lectureTime = (end.hour - start.hour) * 60 + (end.minute - start.minute);
    // totalLectureTime += lectureTime;
  }
  return totalLectureTime;
}

export const parseCredits = (courses) => {
  let totalCredits = 0
  let coursi
  if (courses.length > 0) {
    for (coursi of courses) {
      totalCredits += coursi.sections[0].Credit
    }
  } else {
    totalCredits = 0
  }

  return totalCredits;
}