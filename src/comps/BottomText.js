import React from 'react';
import { Button } from '@material-ui/core';

const BottomText = (props) => {

    const { classes, saveSchedule, hasSaved, uid, classHour, credits } = props;

    return (
        <div className={classes.bottomText}>
        <Button style={{ padding: 10, margin: 15, width: "95%" }} variant="outlined" onClick={saveSchedule}>Get Schedule Link</Button>
        <div style={{ marginBottom: 10 }} className={classes.classHour}><p>{ hasSaved ? window.location.origin+'/'+uid : ''}</p></div>
        <p className={classes.classHour}> {credits[0] == null ? 0 : credits[0]} credits, {classHour} class hours </p>          
        <p className={classes.shamelessplug}>
          <a href="https://github.com/no8am/no8am" target="_blank" rel="noopener noreferrer"> © 2021 no8am.v3α</a>&nbsp;•&nbsp;Jimmy Wei '21&nbsp;•&nbsp;
          <a href="http://nickdemarchis.com" target="_blank" rel="noopener noreferrer">Nick DeMarchis '22</a>
          <br /><b><a href="https://tables.area120.google.com/form/90iIrdp5fKYdYHq6WXJ_Og/t/9nEcfWIkVZ0baf8t36Ck-28zLhrAHKysF8Ti3-uqskdKbBSqQlZcjySbl8aSF2x_08" target="_blank" rel="noopener noreferrer">Feedback</a></b>&nbsp;•&nbsp;Database last updated 10/18/2021.</p>
      </div>
    )
}

export default BottomText;