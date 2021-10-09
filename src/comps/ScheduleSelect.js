import React from "react";
import { 
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    Select,
    FormControl,
    Tooltip,
} from "@material-ui/core";
import { Create, Cloud } from "@material-ui/icons";

const ScheduleSelect = ({courses, schedules, addSchedulesEntry, updateScheduleName, updateScheduleCourses}) => {  

  // on save (that is, when the user clicks the save button)
  const saveSchedule = (event: Event) => {
    const date = new Date();
    event.preventDefault();
    addSchedulesEntry({
      id: date.getTime(), 
      name: date.getSeconds(), 
      courses: [...courses],
    });
    console.log("save schedule schedules");
    console.log(schedules);
  };

  return (
    <div className="schedule-select">
      <FormControl fullWidth>
        {/* <InputLabel id="demo-simple-select-label">Select ScheduleADT</InputLabel> */}
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Selected ScheduleADT"
          autoWidth
        >
          {Object.keys(schedules).map((scheduleId, index) => {
            return (
              <MenuItem
                value={scheduleId} 
                onClick={() => {updateScheduleCourses(scheduleId);}}
              >
                <ListItemIcon>
                    <Create 
                      fontSize="small"
                      onClick = {() => {
                        const newName = prompt("Enter a new name for this schedule");
                        updateScheduleName(scheduleId, newName);
                      }}
                    />
                </ListItemIcon>
                <ListItemText>
                  {schedules[scheduleId].name}
                </ListItemText>
                <Tooltip title={schedules[scheduleId].courses.map(course => (course.title + "\r\n\r\n"))} arrow>
                  <Typography 
                    color="textSecondary"
                  >
                    {schedules[scheduleId].courses.length}
                  </Typography>
                </Tooltip>
              </MenuItem>
            );
          })}
          {(Object.keys(schedules).length > 0) && <Divider />}
          <MenuItem
            onClick={(e) => {saveSchedule(e);}}
            disabled={courses.length === 0}
          >
            <ListItemIcon>
              <Cloud fontSize="small" />
            </ListItemIcon>
            <ListItemText>Save this schedule</ListItemText>
          </MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

ScheduleSelect.defaultProps = {
  courses: [],
  schedules: [],
}

export default ScheduleSelect;