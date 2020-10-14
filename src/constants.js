import{ schemeTableau10 } from 'd3-scale-chromatic';

export const colors = schemeTableau10;
export const colors2 = [
  '#2364AA',
  '#3DA5D9',
  '#65B8B0',
  '#EA7317',
  '#D81E5B',
  // '#341C1C',
]

// Classes go from 8am to 9:52pm at Bucknell
export const first_class = { hour: 8, minute: 0}
export const last_class = { hour: 22, minute: 0}

export const weekDayMap = {
	'M': 'Monday',
	'T': 'Tuesday',
	'W': 'Wednesday',
	'R': 'Thursday',
	'F': 'Friday'
}

export const weekDayMapShort = {
  'M': 'Mon',
  'T': 'Tue',
  'W': 'Wed',
  'R': 'Thu',
  'F': 'Fri'
}

export const weekDayMapSuperShort = {
  'M': 'M',
  'T': 'T',
  'W': 'W',
  'R': 'R',
  'F': 'F'
}