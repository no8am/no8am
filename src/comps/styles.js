import React from 'react';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  listbox: {
    '& ul': {
      padding: 0,
      margin: 0,
    },
  },
  bottomText: {
    position: "absolute",
    bottom: 0,
    color: "white",
    [theme.breakpoints.down('xs')]: {
        width: "100%",
      },
      [theme.breakpoints.up('sm')]: {
        width: "40%",   
      },
  },
  shamelessplug: {
    textAlign: "center",
  },
  classHour: {
    textAlign: "center",
    fontWeight: "bold",
  },
  app: {
    display: "flex",
    [theme.breakpoints.down('xs')]: {
        flexDirection: "column",
      },
      [theme.breakpoints.up('sm')]: {
        flexDirection: "row", 
      },
    background: "linear-gradient(0deg, rgba(113,140,187,1) 0%, rgba(240,137,6,0.3124613569985971) 100%);",
  },
  schedule: {
    flex: 1,
  },
  courseSelector: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: "700px",
  },
  modal: { },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  container: {
    maxHeight: 440,
  },
  modalTitle: {
  	marginLeft: 30,
  	marginTop: 30,
  	fontFamily: "Prompt"
  },
  modalCCC: {
  	marginLeft: 45,
  	fontFamily: "Prompt"
  },
}));

export { useStyles };