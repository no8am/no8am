import{ schemeTableau10 } from 'd3-scale-chromatic';


export const ALGOLIA_APP_ID = 'VRS9N3FZBF';
export const ALGOLIA_SEARCH_ONLY_API = '7ce0ddcf5bf9871a99bef2f6aaa3d44a';
export const ALGOLIA_INDEX_NAME = '2021_spring_courses';

export const colors = schemeTableau10;
export const colors2 = [
  '#FF9AA2',
  '#FFB7B2',
  '#FFDAC1',
  '#E2F0CB',
  '#B5EAD7',
  '#C7CEEA',
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