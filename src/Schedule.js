import React from 'react';
import { Group } from '@vx/group';
import { AxisLeft, AxisTop } from '@vx/axis';
import { Bar } from '@vx/shape';
import { scaleLinear, scaleBand } from '@vx/scale';
import { Text } from '@vx/text';
import { weekDayMap, weekDayMapShort, weekDayMapSuperShort, first_class, last_class } from './constants';
import { timeToMinute, time2Str } from './utils';
import { motion } from 'framer-motion';

const HoverText = props => {
  const [text, setText] = React.useState(props.default);
  const {barX, barY, color, fontSize, opacity, barWidth, barHeight, textOffset, defaultText, mouseOverText } = props;
  return (
    <motion.g onMouseOver={e => setText(mouseOverText)}
        onMouseLeave={e => setText(defaultText)}
        whileHover={{scale:1.1}} whileTap={{scale:0.95}}
    >
      <Bar    
        x={barX}
        y={barY}
        width={barWidth}
        height={barHeight}
        fill={color}
        opacity={opacity}
        rx={5}
      />
      <Text
        x={barX+barWidth/2}
        y={barY+textOffset}
        width={barWidth}
        height={barHeight}
        fontSize={fontSize}
        textAnchor="middle"
        verticalAnchor="start"
        style={{ cursor: "default", fill: "white", stroke: "white", fontFamily: "Prompt"}}
      >
      {text ? text : defaultText}
      </Text>
    </motion.g>
  )
}
  
// Set up left axis ticks (every hour from first_class to last_class)
let tickValues = [];
let time_offset = 0;
let start_time = timeToMinute(first_class);
let end_time = timeToMinute(last_class);
while (time_offset + start_time < end_time) {
  tickValues.push(time_offset)
  time_offset += 60;
}

// Monday through Friday
const x_domain = ['M', 'T', 'W', 'R', 'F']
// y_domain in minutes
const y_domain = [first_class.hour + first_class.minute, 
                  60 * (last_class.hour - first_class.hour) + 
                  last_class.minute - first_class.minute] 

// Deprecated ; data = ['MWF 1:00 PM - 1:52 PM', 'MWF 8:00 AM - 9:52 AM'];
// Push { weekDay, start, end, courseTitle, color } into intervals for each week day
// const handleDayStr = (daystr, intervals) => {
//   const [ weekDays, ...time ] = daystr.split(" ");
//   let [ start, end ] = time.join(" ").split(" - ");
//   start = timeStr2timeObj(start);
//   end = timeStr2timeObj(end);
//   let courseTitle = "CS203"
//   let color = colors[hashStr(courseTitle) % colors.length];
//   let weekDay;
//   for (weekDay of weekDays) {
//     intervals.push({ weekDay, start, end, courseTitle, color });
//   }
// }

export default class Schedule extends React.Component {

  render() {
    const { width, height, margin, intervals, tempIntervals } = this.props;
    const combined_intervals = [...intervals, ...tempIntervals];
    const bg = 'rgba(256, 256, 256, 0.8)';

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // scales
    const xScale = scaleBand({
      range: [0, xMax],
      domain: x_domain
    });
    const yScale = scaleLinear({
      range: [0, yMax],
      domain: y_domain, 
    });
 
    const weekDayMapUsed = width < 600 ? (width < 300 ? weekDayMapSuperShort : weekDayMapShort) : weekDayMap;
    const fontSize = width < 600 ? 10 : 16;
    const textOffset = width < 600 ? 5 : 8;

    return (
      <div className="schedule" style={{ width, height, flex: '1' }}>
        <svg width={width} height={height}>
          <rect x={0} y={0} width={width} height={height} fill={bg} ry={10} />
          <Group left={margin.left}>
            <AxisLeft
              hideTicks
              hideAxisLine
              top={margin.top+20}
              left={0}
              scale={yScale}
              tickValues={tickValues}
              stroke="#1b1a1e"
              tickStroke="#8e205f"
              tickLabelProps={(value, index) => ({
                fill: 'black',
                textAnchor: 'end',
                fontSize: 10,
                fontFamily: 'Prompt',
                dx: '-0.25em',
                dy: '0.5em'
              })}
              tickComponent={({ formattedValue, ...tickProps }) => (
                <text {...tickProps}>{time2Str(formattedValue, first_class)}</text>
              )}
            />

            <AxisTop
              hideTicks
              hideAxisLine
              top={margin.top}
              left={0}
              scale={xScale}
              stroke="#1b1a1e"
              tickStroke="#8e205f"
              tickLabelProps={(value, index) => ({
                fill: 'black',
                textAnchor: 'middle',
                fontSize: 15,
                fontFamily: 'Prompt',
                fontWeight: 'bold',
                dx: '0em',
                dy: '0.25em'
              })}
              tickComponent={({ formattedValue, ...tickProps }) => (
                <text {...tickProps}>{weekDayMapUsed[formattedValue]}</text>
              )}
            />
            
          </Group>
          <Group top={margin.top+20} left={margin.left}>
            {combined_intervals.map((interval, i) => {
              const barWidth = xScale.bandwidth();
              console.log(interval)
              let { start, end, weekDay, courseTitle, color, startText, endText } = interval;
              start = timeToMinute(start) - timeToMinute(first_class);
              end = timeToMinute(end) - timeToMinute(first_class);
              const barHeight = yScale(end) - yScale(start);
              const barX = xScale(weekDay);
              const barY = yScale(start);
              return (
                <HoverText
                    key={`${courseTitle}-${i}`}
                    color={color}
                    fontSize={fontSize}
                    barX={barX}
                    barY={barY}
                    barWidth={barWidth}
                    barHeight={barHeight}
                    textOffset={textOffset}
                    defaultText={courseTitle}
                    mouseOverText={`${startText} ${endText}`}
                    opacity={interval.temp ? 0.5 : 1}
                />
              )
            })}
          </Group>
        </svg>
      </div>
    );
  }
}