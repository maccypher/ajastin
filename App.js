import React, { Component } from "react";
import "./App.css";
// Outsourced component to re-use it and keep the app slim
import AlarmClock from "./components/alarmclock";
// Outsourced function for special time format.
import timeFormat from "./components/timeformat";
// This will be needed to generate an unique ID for every AlarmClock
import uuid from "uuid/v4";

import quit from "./assets/ajastin_quit.svg";

class App extends Component {
  constructor(props) {
    super(props);
    // First we need an initial time object in the App state.
    // Furthermore it's necessary to put our AlarmClock object(s) in state.
    // The object should have at least the properties 'id' and 'finished'. This
    // is to identify the exact AlarmClock later on and get an information
    // about it has reached the timer end or not.
    // Because of we want to use more than one AlarmClock at a time, we put the
    // AlarmClock objects in an array with an unique ID given by the module 'uuid':
    this.state = {
      time: new Date(),
      alarmClocks: [{ id: uuid(), finished: false }]
    };
  }

  // The method 'componentDidMount()' is called before the 'render()' method, so
  // we start our basic clock here.
  // Let's set the 'setInterval()' method with 1000ms (= 1s) and calling another
  // custom method to get the current time.
  componentDidMount() {
    setInterval(this.basicClock, 1000);
  }

  // This is the method to get the current time. We need this later on in the DOM,
  // so let's put it in the state and update the initial time object.
  basicClock = () => {
    this.setState({
      time: new Date()
    });
  };

  // What should happen, when the AlarmClock has finished?
  handleAlarmClockFinished = id => {
    // We have to update the corresponding object property 'finished' to true in the state.
    // Therefore we create a new temporary object from the current used AlarmClock:
    let currentAlarmClock = { id: id, finished: true };

    // To identify the right object in the 'alarmClocks' array, we compare the given 'id'
    // with ones in the array and get out the array index of it:
    let index = this.state.alarmClocks.findIndex(
      alarmClock => alarmClock.id === id
    );

    // Now let's check if the state object property 'finished' is false:
    if (!this.state.alarmClocks[index].finished) {
      // Itterate over the alarmClocks array with the ract 'map()' method and put
      // all results (return elements) the new variable 'updatedAlarmClocks':
      let updatedAlarmClocks = this.state.alarmClocks.map(alarmClock => {
        // Compare the id of the object id with the given one:
        if (alarmClock.id === id) {
          // If we got a match, return newly created temporary object.
          return currentAlarmClock;
        } else {
          // If not, return the old value.
          return alarmClock;
        }
      });

      // After all, update the state and put the content of 'updatedAlarmClocks'
      // in the state object 'alarmClocks':
      this.setState({
        alarmClocks: updatedAlarmClocks
      });
    }
  };

  // If we have multiple AlarmClocks in use, we maybe wann remove some.
  handleDeleteAlarmClock = id => {
    // Again we have to create a temporary object by filtering the objects ...
    let updatedAlarmClocks = this.state.alarmClocks.filter(
      alarmClock => alarmClock.id !== id
    );

    // ... and put back in the state object 'alarmClocks'
    this.setState({
      alarmClocks: updatedAlarmClocks
    });
  };

  // Initially we thought about using more than one AlarmClock at a time:
  handleAddTimer = () => {
    // We have to define some vars for this.
    // First we define a new object the the array ...
    let newAlarmClock = { id: uuid(), finished: false };
    // ... then let's grab all existing AlarmClocks ...
    let oldAlarmClocks = this.state.alarmClocks;
    // ... and now put all together.
    let allAlarmClocks = oldAlarmClocks.concat(newAlarmClock);

    // Last, but not least, we update the state
    this.setState({
      alarmClocks: allAlarmClocks
    });
  };

  // NOTICE: this function is absolutely useless at this point and is just a
  // placeholder when you want to put this stuff in an electron app. After
  // bundling all together you have to search for this function in:
  // "/static/js/main.<bundle-ID>.js" and put the text from the var in it.
  // Otherwise the "Quit Ajastin" button is useless.
  handleQuitApp = () => {
    let bm = 'require("remote").app.quit()';
  };

  // The basic methods are declared and now we can go ahead
  // with displaying the stuff in the frontend:
  render() {
    // Get the initial time from the state and put it in some constants
    const h = this.state.time.getHours();
    const m = this.state.time.getMinutes();
    const s = this.state.time.getSeconds();
    // Now format the time for the input field, because it expects a
    // special format. Therefore we're using an external function
    // we outsourced at another point and imported at the top.
    const value = timeFormat(h, m, s);

    // [OPTIONAL] Define a variable to give the finished AlarmClock
    // a different CSS style.
    let alarmClockFinishedStyle = "dropDown";
    if (this.state.finished) {
      alarmClockFinishedStyle = "dropDown ready";
    }

    // Put the state array objects in a new object to itterate
    // later on through it:
    let alarmClocks = this.state.alarmClocks;
    return (
      // Here using the optional style var. It's not needed
      // for the main functionality. Just styling.
      <div id="wrapper" className={alarmClockFinishedStyle}>
        <div className="time">
          {/*
            Put the formatted time into the input field
          */}
          <div className="currentTime">{value}</div>
        </div>
        <div className="spacer">
          {/*
            Now we itterate through the AlarmClock array from the state.
            The more array elements we have, the more ALarmClocks we can display.
          */}
          {alarmClocks.map(alarmClock => (
            <AlarmClock
              key={alarmClock.id}
              finished={alarmClock.finished}
              // This method will be put into the component as props object.
              onFinish={this.handleAlarmClockFinished}
              // This method will be put into the component as props object too.
              removeAlarmClock={this.handleDeleteAlarmClock}
              id={alarmClock.id}
            />
          ))}
        </div>
        {/*
          This button will add another AlarmClock. Therefore we give the 
          'handleAddTimer' handler as a callback function.
        */}
        <button className="addTimer" onClick={this.handleAddTimer}>
          + Add new timer
        </button>

        <button className="quit" onClick={this.handleQuitApp}>
          <div className="quitContent">
            <div className="quitButton" />
            <span className="quitText">Quit Ajastin</span>
          </div>
        </button>
      </div>
    );
  }
}

// That's it! Now we only have to export the App.
export default App;

// Now you are good to go. Let's move on to the other files ('./components/alarmclock.js' and './components/timeformat.js')
