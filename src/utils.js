import { useEffect, useState } from 'react';

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
  return { section, crn, time, room, instructor, seats, credit, key, title, section_obj };
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
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export const parseMeetingTimes = (section, intervals) => {
  const courseTitle = section.Subj + " " + section.Number;
  const { color } = section;
  let totalLectureTime = 0;
  let meeting;
  for (meeting of section.Meetings) {
    const startText = meeting.Start;
    const endText = meeting.End;
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
      intervals.push({ weekDay, start, end, courseTitle, color, startText, endText });
    }
    const lectureTime = (end.hour - start.hour) * 60 + (end.minute - start.minute);
    totalLectureTime += lectureTime;
  }
  return totalLectureTime;
}