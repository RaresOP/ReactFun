import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import "date-fns";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import { TimeoffTypesComponent } from "./TimeoffTypes";
import { datediff, GetBackendURL } from "./Helpers";

export const TimeoffRequestComponent = props => {
  const [newRequestOpen, setNewRequestOpen] = React.useState(false);

  const [timeofftype, setTimeoffType] = React.useState("");

  const [selectedStartDate, setSelectedStartDate] = React.useState(new Date());

  const [selectedEndDate, setSelectedEndDate] = React.useState(new Date());

  const handleNewRequestOpen = () => {
    setNewRequestOpen(true);
  };

  const handleNewRequestClose = () => {
    setNewRequestOpen(false);
  };

  const handleSendNewRequest = () => {
    const requestData = {
      timeoffType: timeofftype,
      startDate: selectedStartDate,
      periodValue: datediff(selectedStartDate, selectedEndDate)
    };
    console.log("TRIMIT");
    fetch(GetBackendURL() + "/api/wfm/timeoffreq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(requestData)
    })
      .then(response => response.text())
      .then(response => {
        window.alert(response);
        setNewRequestOpen(false);
      });
  };

  const handleTimeoffTypeChange = newValue => {
    console.log("NEW VALUE IS");
    console.log(newValue);
    setTimeoffType(newValue);
  };

  const handleStartDateChange = date => {
    setSelectedStartDate(date);
  };
  const handleEndDateChange = date => {
    setSelectedEndDate(date);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleNewRequestOpen}>
        New request
      </Button>

      <Dialog
        open={newRequestOpen}
        onClose={handleNewRequestClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">New time off request</DialogTitle>
        <DialogContent>
          <InputLabel id="demo-simple-select-label">Type</InputLabel>

          <TimeoffTypesComponent onChange={handleTimeoffTypeChange} />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid container justify="space-around">
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="start-date-picker"
                label="Start"
                value={selectedStartDate}
                onChange={handleStartDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="end-date-picker"
                label="End"
                value={selectedEndDate}
                onChange={handleEndDateChange}
                KeyboardButtonProps={{
                  "aria-label": "change date"
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNewRequestClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSendNewRequest} color="primary">
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
