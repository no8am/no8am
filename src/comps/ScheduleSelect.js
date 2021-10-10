import React from "react";
import { 
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  FormControl,
  Tooltip,
  Button,
  IconButton,
} from "@material-ui/core";
import { Create, Save, Delete } from "@material-ui/icons";

const ScheduleSelect = ({courses, schedules, addSchedulesEntry, updateScheduleName, updateScheduleCourses, removeSchedule}) => {  

  // on save (that is, when the user clicks the save button)
  const saveSchedule = (event: Event) => {
    const date = new Date();
    event.preventDefault();
    addSchedulesEntry({
      id: date.getTime(), 
      name: date.getSeconds(), 
      courses: [...courses],
    });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="schedule-select" style={{width: "100%"}}>
      <Button
        onClick={handleClick}
        color="secondary"
        variant="contained"
        endIcon={<Save />}
        style={{width: "100%", height: "100%"}}
      >
        Schedules
      </Button>
      <FormControl fullWidth>
        <Menu
          label="Selected schedule"
          // variant="outlined"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          autoWidth
        >
          {Object.keys(schedules).map((scheduleId, index) => {
            return (
              <MenuItem
                value={scheduleId} 
                onClick={() => {updateScheduleCourses(scheduleId);}}
              >
                <ListItemText>
                  {schedules[scheduleId].name}
                </ListItemText>
                <ListItemIcon>
                  <Tooltip title="Edit schedule name" arrow>
                  <IconButton
                    fontSize="small"
                    onClick = {() => {
                      const newName = prompt("Enter a new name for this schedule");
                      updateScheduleName(scheduleId, newName);
                    }}
                  >
                    <Create 
                      fontSize="small"
                    />
                  </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete this schedule" arrow>
                  <IconButton
                    fontSize="small"
                    onClick = {() => {
                      removeSchedule(scheduleId);
                    }}
                  >
                    <Delete 
                      fontSize="small"
                    />
                  </IconButton>
                  </Tooltip>
                </ListItemIcon>
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
              onClick={(e) => {handleClose(); saveSchedule(e);}}
              disabled={courses.length === 0}
            >
              <ListItemIcon>
                <Save fontSize="small" />
              </ListItemIcon>
              <ListItemText>Save this schedule</ListItemText>
            </MenuItem>
        </Menu>
      </FormControl>
    </div>
  );
}

ScheduleSelect.defaultProps = {
  courses: [],
  schedules: [],
}

export default ScheduleSelect;