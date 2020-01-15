import React, {  useState, useEffect } from "react";
import Calendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { withRouter,useHistory, BrowserRouter as Router } from 'react-router-dom'
import "./App.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import ReactNotifications from 'react-notifications-component';
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';
import Button from '@material-ui/core/Button';

const localizer = Calendar.momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);
var history
const schedRequest = new XMLHttpRequest();

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function Logout() {
    localStorage.removeItem('LoggedIn');
    history.push('/signin')
}





 function App() {

  const [currentDate, setCurrentDate] = useState(new Date())

  const [currentView, setCurrentView] = useState('month')

  const [events, setEvents] = useState(
     [
      {
        start: new Date(),
        end: new Date(moment().add(30, "days")),
        title: "Loading schedule",
        resourceId: 1
      }
    ]
  )

  const [resourceMap, setResourceMap] = useState(
    [
        {
            resourceId: 1,
            resourceTitle: 'ag1'
        }
    ]
  )



history = useHistory()

function LoadSchedule(start,end)
{
  schedRequest.onreadystatechange = HandleScheduleResponse
  schedRequest.open('get', 'https://localhost:44340/api/wfm/wfmschedule?start='+start+'&end='+end);
  schedRequest.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  schedRequest.withCredentials = true;
  schedRequest.send();
}

function computeDisplayedDateRange()  {

console.log("Am intrat in compute")


  console.log(currentDate)


  let start = moment(currentDate).startOf(currentView);

  let end = moment(currentDate).endOf(currentView);
  if(currentView === 'month') {

      start = start.startOf('week')

      start = addDays(start,1)
      end = addDays(start,34)


    }
  if(currentView === 'week')
  {
    start = start.startOf('week')
    start = addDays(start,1)
    end = addDays(start,6)
  }

  console.log("START E " + start.toISOString().split('T')[0])
  console.log("END E " + end.toISOString().split('T')[0])
  LoadSchedule(start.toISOString().split('T')[0],end.toISOString().split('T')[0])

  //setData({displayedDateRange:{start:start.toString(), end:end.toString()}})

}


function HandleScheduleResponse()
{

  if (schedRequest.readyState === 4 && schedRequest.status === 200)
  {

         let myLocalEvents=[]

      if(schedRequest.response === 'log in first to receive your schedule!')
      {
        window.alert('log in first to receive your schedule!')

        Logout()
      }
      if(schedRequest.response[0]!==undefined)
      {


          let jsonObj = JSON.parse(schedRequest.response)

          for (var i = 0; i < jsonObj.length; i++) {

              for(var dayIndex=0;dayIndex<jsonObj[i].Days.length;dayIndex++)
              {
                let currentDay = jsonObj[i].Days[dayIndex]
                for(var shiftIndex=0;shiftIndex<currentDay.Shifts.length;shiftIndex++)
                {

                    let currentShift = currentDay.Shifts[shiftIndex]

                    var newEvent = {
                       start:new Date(currentShift.Start+'Z'),
                       end:new Date(currentShift.End+'Z'),
                       title:currentShift.Name,
                       resourceId:1
                     }
                     console.log("Adaug event now")
                     myLocalEvents.push(newEvent)

                }
             }
          }

          if(myLocalEvents.length>0)
          {
              setEvents(myLocalEvents)
          }
      }
  }
}



function onEventDrop ({event, start, end, allDay }) {
  console.log(start);
};

function CurrentDateUpdate (date){

   setCurrentDate((prevstate) => { return date});

}
function CurrentViewUpdate (view) {
  setCurrentView(view);
}


useEffect(() => {
  var notifierRequest = new XMLHttpRequest();

      window.setInterval(function(){

      notifierRequest.onreadystatechange = function () {

                  if (notifierRequest.readyState === 4) {

                    if(notifierRequest.response!=null)
                    {

                        store.addNotification({
                          title: 'Notification',
                          message: notifierRequest.response,
                          type: 'default',                         // 'default', 'success', 'info', 'warning'
                          container: 'bottom-left',                // where to position the notifications
                          animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
                          animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
                          dismiss: {
                            duration: 3000
                          }
                        })

                      }

                    notifierRequest.open('get', 'https://localhost:44340/api/wfm/notification', true);
                    notifierRequest.withCredentials = true;
                    notifierRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    notifierRequest.send();
                  }
              }
      }, 1000);


            computeDisplayedDateRange()
            notifierRequest.open('get', 'https://localhost:44340/api/wfm/notification', true);
            notifierRequest.withCredentials = true;
            notifierRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    notifierRequest.send();

  }, []);


useEffect(() => {
            computeDisplayedDateRange()

  }, [currentDate,currentView]);





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

}



export default withRouter(App);
