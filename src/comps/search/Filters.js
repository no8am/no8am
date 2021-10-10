import React from 'react'
import { Autocomplete } from '@material-ui/lab';
import { TextField } from '@material-ui/core';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const Filters = (props) => {

    const {setRequirements, requirementList, setInstructor, instructorList} = props

    return (
        <div className = "autoCompleteWrapper" style={{ display: "flex", flexDirection: "column", flexWrap: "wrap", width: "100%"}}>
            <Autocomplete
                size="small"
                autoHighlight
                disableListWrap
                multiple
                filterSelectedOptions
                onChange={(e, reqs) => setRequirements(reqs) }
                id="add-requirement-autocomplete"
                options={requirementList}
                style={{width: "100%", paddingTop: "10px"}}
                renderInput={params => <TextField {...params} label="Requirements" variant="outlined" />}
                renderOption={(option, { inputValue }) => {
                    // Highlight parts of text that matches input
                    const matches = match(option, inputValue);
                    const parts = parse(option, matches);
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
            />
            <Autocomplete
                size="small"
                autoHighlight
                filterSelectedOptions
                onChange={(e, instructor) => setInstructor(instructor) }
                id="add-instructor-autocomplete"
                options={instructorList}
                style={{width: "100%", paddingTop: "10px"}}
                renderInput={params => <TextField {...params} label="Instructor" variant="outlined" />}
                renderOption={(option, { inputValue }) => {
                    // Highlight parts of text that matches input
                    const matches = match(option, inputValue);
                    const parts = parse(option, matches);
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
            />
        </div>
    )
}

export default Filters