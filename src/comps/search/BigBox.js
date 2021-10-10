import React from 'react'
import { Autocomplete } from '@material-ui/lab';
import { TextField, Chip, Tooltip } from '@material-ui/core';
import { FilterList } from '@material-ui/icons';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const BigBox = (props) => {

    const {courses, setCourses, setQuery, filteredCourseList, handleOpenSectionModal, setOpenFilterModal} = props;
        
    return (
    <Autocomplete
        size="small"
        style={{ marginTop: "15px", width: "100%" }}
        autoHighlight
        filterSelectedOptions
        multiple
        value={courses}
        onChange={(e, courses) => setCourses(courses) }
        onInputChange={(e, query) => setQuery(query) }
        id="add-course-autocomplete"
        options={filteredCourseList}
        getOptionLabel={option => option.title}
        renderInput={params => (
        <TextField
        {...params}
        label="Add course"
        variant="outlined"
        InputProps={{
            ...params.InputProps,
            endAdornment: (
            <React.Fragment>
                {params.InputProps.endAdornment}
                {!props?.noFilterIcon && (
                    <Tooltip title="Filter" arrow>
                        <FilterList onClick={() => setOpenFilterModal(true)} style={{cursor: "pointer"}}/>
                    </Tooltip>
                )}
            </React.Fragment>
                ),
            }}
            />
        )}
        renderOption={(option, { inputValue }) => {
            const matches = match(option.title, inputValue);
            const parts = parse(option.title, matches);
            return (
            <div>
                {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                    {part.text}
                </span>
                ))}
            </div>
            );
        }}
        
        renderTags={(value, getTagProps) =>
            value.map((option, index) => (
            <Chip
                onClick={()=>handleOpenSectionModal(option)}
                style={{backgroundColor:option.color}}
                label={(
                <section>
                    <span style={{fontWeight: "bold", marginRight: 5, color: "white"}}> {option.sections[0].DeptCodes[0] + " " + option.sections[0].Number}</span>
                    <span style={{verticalAlign: "middle", color: "white", fontSize: 10}}> {`${option.sections.length} ` + (option.sections.length === 1 ? "Section" : "Sections")}</span>
                </section>
                )}
                {...getTagProps({ index })} />
            ))
        }
    />
)}

export default BigBox;