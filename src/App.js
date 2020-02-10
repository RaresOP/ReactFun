import React, { useState, useEffect } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  withRouter,
  useHistory,
  BrowserRouter as Router
} from "react-router-dom";
import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReactNotifications from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";
import Button from "@material-ui/core/Button";
import { encodeUrlData, GetBackendURL } from "./Helpers";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import MaterialTable from "material-table";

import "date-fns";

import { makeStyles } from "@material-ui/core/styles";

import { TimeoffRequestComponent } from "./TimeoffRequest";

import { CustomEventComponent } from "./CustomEvent";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const eventStyleGetter = (event, start, end, isSelected) => {
  console.log(event);
  var color = "#" + event.color;
  var style = {
    // backgroundColor: backgroundColor,
    borderRadius: "5px",
    opacity: 0.8,
    color: color,
    border: "1px solid black;",
    display: "block"
  };
  return {
    style: style
  };
};

let formats = {
  eventTimeRangeFormat: () => null
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

const localizer = Calendar.momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
var history;
var first = 0;
const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

var timeOffColumns = [
  { title: "Start", field: "start" },
  { title: "End", field: "end" },
  { title: "Status", field: "status" },
  { title: "Type", field: "type" }
];

var shiftTradeRequestsColumns = [
  { title: "Status", field: "status" },
  { title: "Date", field: "date" },
  { title: "Details", field: "details" }
];

const App = container => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [currentView, setCurrentView] = useState("month");

  const [shiftEvents, setShiftEvents] = useState([{}]);

  const [displayEvents, setDisplayEvents] = useState([
    {
      // start: new Date(),
      //  end: new Date(moment().add(30, "days")),
      //  title: "Loading schedule",
      //  resourceId: 1
    }
  ]);

  const [activityEvents, setActivityEvents] = useState([{}]);

  const classes = useStyles();

  const [resourceMap, setResourceMap] = useState([
    {
      resourceId: 1,
      resourceTitle: "ag1"
    }
  ]);

  const [tabValue, setTabValue] = React.useState(0);

  const [timeOffState, setTimeOffState] = React.useState([
    {
      start: "ag1",
      end: "Pending",
      status: "2020 - 02 - 04",
      type: 4
    }
  ]);

  const [shiftTradeState, setShiftTradeState] = React.useState([
    {
      status: "PENDING",
      date: new Date().toISOString().split("T")[0],
      details: "To be implemented"
    }
  ]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  history = useHistory();

  const Logout = () => {
    localStorage.removeItem("LoggedIn");
    history.push("/signin");
    fetch(GetBackendURL() + "/api/wfm/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
  };

  const LoadTimeOffRequests = () => {
    fetch(GetBackendURL() + "/api/wfm/timeoffreqs", {
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      },
      credentials: "include"
    })
      .then(response => response.json())
      .then(data => {
        let myLocalTimeOffReqs = [];
        for (var i = 0; i < data.length; i++) {
          let currentTimeOff = data[i];

          var newTimeOff = {
            start: new Date(currentTimeOff.Start).toISOString().split("T")[0],
            end: new Date(currentTimeOff.End).toISOString().split("T")[0],
            status: currentTimeOff.Status,
            type: currentTimeOff.Type
          };

          myLocalTimeOffReqs.push(newTimeOff);
        }

        setTimeOffState(myLocalTimeOffReqs);
      });
  };

  const LoadSchedule = (start, end) => {
    if (localStorage.getItem("LoggedIn") != null) {
      const reqData = {
        start: start,
        end: end
      };

      LoadTimeOffRequests();

      fetch(
        GetBackendURL() + "/api/wfm/wfmschedule?" + encodeUrlData(reqData),
        {
          headers: {
            "Content-Type": "application/json; charset=UTF-8"
          },
          credentials: "include"
        }
      )
        .then(response => response.json())
        .then(data => {
          let myLocalShiftEvents = [];
          let myLocalActivityEvents = [];
          for (var i = 0; i < data.length; i++) {
            for (var dayIndex = 0; dayIndex < data[i].Days.length; dayIndex++) {
              let currentDay = data[i].Days[dayIndex];
              for (
                var shiftIndex = 0;
                shiftIndex < currentDay.Shifts.length;
                shiftIndex++
              ) {
                let currentShift = currentDay.Shifts[shiftIndex];

                var newShiftEvent = {
                  start: new Date(currentShift.Start),
                  end: new Date(currentShift.End),
                  title: currentShift.Name,
                  resourceId: 1,
                  color: currentShift.TextColor
                };

                myLocalShiftEvents.push(newShiftEvent);
                if (currentShift.Activities == null) {
                  myLocalActivityEvents.push(newShiftEvent);
                  continue;
                }

                currentShift.Activities.forEach(currentActivity => {
                  const newActivityEvent = {
                    start: new Date(currentActivity.Start),
                    end: new Date(currentActivity.End),
                    title: currentActivity.Name,
                    resourceId: 1,
                    color: currentShift.TextColor
                  };
                  myLocalActivityEvents.push(newActivityEvent);
                });
              }
            }
          }

          if (currentView === "month") {
            setDisplayEvents(myLocalShiftEvents);
          } else {
            setDisplayEvents(myLocalActivityEvents);
          }

          setShiftEvents(myLocalShiftEvents);
          setActivityEvents(myLocalActivityEvents);
        })
        .catch(error => {
          console.log(error);
          window.alert("Log in first!");
          Logout();
        });
    }
  };

  const computeDisplayedDateRange = () => {
    console.log(currentDate);

    let start = moment(currentDate).startOf(currentView);

    let end = moment(currentDate).endOf(currentView);
    if (currentView === "month") {
      start = start.startOf("week");

      start = addDays(start, 1);
      end = addDays(start, 34);
    }
    if (currentView === "week") {
      start = start.startOf("week");
      start = addDays(start, 1);
      end = addDays(start, 6);
    }

    LoadSchedule(
      start.toISOString().split("T")[0],
      end.toISOString().split("T")[0]
    );
  };

  const onEventDrop = ({ event, start, end, allDay }) => {
    console.log(start);
  };

  const CurrentDateUpdate = date => {
    setCurrentDate(prevstate => {
      return date;
    });
  };

  const CurrentViewUpdate = view => {
    if (view === "month") {
      setDisplayEvents(shiftEvents);
    } else {
      console.log(activityEvents);
      setDisplayEvents(activityEvents);
    }
    setCurrentView(prevstate => {
      return view;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (localStorage.getItem("LoggedIn") != null) {
        fetch(GetBackendURL() + "/api/wfm/notification", {
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
          }
        })
          .then(response => response.text())
          .then(response => {
            console.log(response);
            if (response !== "null") {
              computeDisplayedDateRange();
              store.addNotification({
                title: "Notification",
                message: response,
                type: "default", // 'default', 'success', 'info', 'warning'
                container: "bottom-left", // where to position the notifications
                animationIn: ["animated", "fadeIn"], // animate.css classes that's applied
                animationOut: ["animated", "fadeOut"], // animate.css classes that's applied
                dismiss: {
                  duration: 0
                }
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }, 3000);

    computeDisplayedDateRange();
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (first === 0) {
      first = 1;
      return;
    }
    computeDisplayedDateRange();
  }, [currentDate, currentView]);

  const handleSlotSelection = ({ start, end, action }) => {
    console.log("START SELECTION");
    console.log(start);
    console.log("END SELECTION");
    console.log(end);
  };

  return (
    <div className="App">
      <AppBar position="static">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="simple tabs example"
        >
          <Tab label="Schedule" {...a11yProps(0)} />
          <Tab label="Time Off" {...a11yProps(1)} />
          <Tab label="Shift trades" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <DnDCalendar
          defaultDate={new Date()}
          defaultView="month"
          events={displayEvents}
          localizer={localizer}
          onEventDrop={onEventDrop}
          onNavigate={CurrentDateUpdate}
          onView={CurrentViewUpdate}
          resizable
          selectable={true}
          onSelectSlot={handleSlotSelection}
          resources={resourceMap}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
          style={{ height: "100vh" }}
          components={{
            event: CustomEventComponent
          }}
          formats={formats}
          views={["month", "week", "day"]}
          eventPropGetter={eventStyleGetter}
          step={15}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <TimeoffRequestComponent />

        <MaterialTable
          title="Requests"
          columns={timeOffColumns}
          data={timeOffState}
          editable={{
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  setTimeOffState(prevState => {
                    const data = [...prevState];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              })
          }}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <MaterialTable
          title="Shift Trade Requests"
          columns={shiftTradeRequestsColumns}
          data={shiftTradeState}
          editable={{
            onRowDelete: oldData =>
              new Promise(resolve => {
                setTimeout(() => {
                  resolve();
                  setShiftTradeState(prevState => {
                    const data = [...prevState];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                  });
                }, 600);
              })
          }}
        />
      </TabPanel>
      <ReactNotifications />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={Logout}
      >
        Logout
      </Button>
    </div>
  );
};

export default withRouter(App);
