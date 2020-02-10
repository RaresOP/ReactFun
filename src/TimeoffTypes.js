import React, { useState, useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { GetBackendURL } from "./Helpers";
import Select from "@material-ui/core/Select";

export const TimeoffTypesComponent = props => {
  const [timeoffTypes, setTimeoffTypes] = useState([]);

  const [timeofftype, setTimeoffType] = React.useState("");

  const HandleTimeoffTypeChange = event => {
    setTimeoffType(event.target.value);
    props.onChange(timeoffTypes[event.target.value]);
  };

  useEffect(() => {
    fetch(GetBackendURL() + "/api/wfm/timeofftypes", {
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      }
    })
      .then(response => response.json())
      .then(response => {
        let myLocalTimeoffs = [];
        for (var i = 0; i < response.length; i++) {
          myLocalTimeoffs.push(response[i].TypeName);
        }
        setTimeoffTypes(myLocalTimeoffs);
      });
  }, []);

  let list = timeoffTypes.map((el, index) => (
    <MenuItem value={index}>{el}</MenuItem>
  ));

  return (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={timeofftype}
      onChange={HandleTimeoffTypeChange}
    >
      {list}
    </Select>
  );
};
