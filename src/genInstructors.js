import { courseListRaw } from './data';

let instructorList = []

for (let i = 0; i < courseListRaw.length; i++) {
    for (let j = 0; j < courseListRaw[i].Instructors.length; j++) {
      if (!instructorList.includes(courseListRaw[i].Instructors[j].Display)) {
        instructorList.push(courseListRaw[i].Instructors[j].Display)
      }
    }
  }

  let quotedAndCommaSeparated = "'" + instructorList.join("','") + "'"

  console.log(quotedAndCommaSeparated.toString())