# no8am.v3α
<p align="center">
  A super fun, super cool new scheduling system, to help Bucknell students get their schedules together.</br>
  https://rayschedule.com </br>
  <!-- <img src="https://github.com/icewing1996/no8am-2/blob/master/src/screenshot.png"> -->
</p>

## Notes
Basically, the deal is here that the database has to be manually pulled from the CourseInformation site [here](https://pubapps.bucknell.edu/CourseInformation/data/course/term/202105). The call works fine whenever it's run locally in development (see below), but deployed it fails. So, please contact me if the database needs to be updated.

## Current Bugs

* Courses scheduled at the same time overlap, instead of appearing side-by-side.
* The CRN table doesn't look right (this one *really* bothers me).
* The "class hours" count is horribly wrong (this one bothers me too).

## To-do list

* Add descriptions to section selection windows, that way people know what class they're signing up for
* Add RateMyProfessor links to each professor's name systematically?
* Reframe schedule for extra early / late classes (we *love* everything that our 30-minute in-between class period does, right?)

## Develop
```bash
git clone https://github.com/ndemarchis/no8am-3 && cd no8am-3
npm install
npm start
```

## License
This project is licensed under the terms of the The GNU General Public License v3.0.

## Tribute
This project was inspired by [no8am-2](https://github.com/icewing1996/no8am-2), [no8am](https://github.com/nowyasimi/no8am) and [semesterly](https://github.com/noahpresler/semesterly).
