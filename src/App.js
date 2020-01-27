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
import { encodeUrlData } from "./Helpers";

const localizer = Calendar.momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
var history;
const schedRequest = new XMLHttpRequest();
var first = 0;
const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [currentView, setCurrentView] = useState("month");

  const [events, setEvents] = useState([
    {
      start: new Date(),
      end: new Date(moment().add(30, "days")),
      title: "Loading schedule",
      resourceId: 1
    }
  ]);

  const [resourceMap, setResourceMap] = useState([
    {
      resourceId: 1,
      resourceTitle: "ag1"
    }
  ]);

  history = useHistory();

  const Logout = () => {
    localStorage.removeItem("LoggedIn");
    history.push("/signin");
  };

  const LoadSchedule = (start, end) => {
    const reqData = {
      start: start,
      end: end
    };
    fetch(
      "https://localhost:44340/api/wfm/wfmschedule?" + encodeUrlData(reqData),
      {
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        credentials: "include"
      }
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        let myLocalEvents = [];
        for (var i = 0; i < data.length; i++) {
          for (var dayIndex = 0; dayIndex < data[i].Days.length; dayIndex++) {
            let currentDay = data[i].Days[dayIndex];
            for (
              var shiftIndex = 0;
              shiftIndex < currentDay.Shifts.length;
              shiftIndex++
            ) {
              let currentShift = currentDay.Shifts[shiftIndex];

              var newEvent = {
                start: new Date(currentShift.Start + "Z"),
                end: new Date(currentShift.End + "Z"),
                title: currentShift.Name,
                resourceId: 1
              };
              console.log("Adaug event now");
              myLocalEvents.push(newEvent);
            }
          }
        }

        if (myLocalEvents.length > 0) {
          setEvents(myLocalEvents);
        }
      })
      .catch(error => {
        console.log(error);
        window.alert("Log in first!");
        Logout();
      });
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

    //setData({displayedDateRange:{start:start.toString(), end:end.toString()}})
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
    setCurrentView(view);
  };

  useEffect(() => {
    var notifierRequest = new XMLHttpRequest();

    const interval = setInterval(() => {
      fetch("https://localhost:44340/api/wfm/notification", {
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

  return (
    <div className="App">
      <ReactNotifications />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        onClick={Logout}
      >
        Logout
      </Button>
      <DnDCalendar
        defaultDate={new Date()}
        defaultView="month"
        events={events}
        localizer={localizer}
        onEventDrop={onEventDrop}
        onNavigate={CurrentDateUpdate}
        onView={CurrentViewUpdate}
        resizable
        resources={resourceMap}
        resourceIdAccessor="resourceId"
        resourceTitleAccessor="resourceTitle"
        style={{ height: "100vh" }}
      />
    </div>
  );
};

export default withRouter(App);
