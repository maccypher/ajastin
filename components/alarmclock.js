import React, { Component } from "react";
// Outsourced function for special time format.
import timeFormat from "./timeformat";
import styled from "styled-components";
// As we wanna play a sound at the end of an AlarmClock, we need the audio files
import audioFile from "../assets/audio/Ringtone-for-alarm.mp3";
// While playing the audio file, we wanna display a sound icon.
import speaker from "../assets/ajastin_speaker.svg";

class AlarmClock extends Component {
  constructor(props) {
    super(props);
    const time = new Date();
    // Set state objects for time, because every new added AlarmClock
    // should show the current time + one hour, so we have ready to go
    // default value in every single AlarmClock.
    this.state = {
      // Essentially we only have to define the state objects for HOUR and MINUTE.
      // But as we wanna compare the current time with one we set in the AlarmClock,
      // we need to get the date vars as well. It's maybe not as elegant as it can be,
      // but it's better than transcoding current time back into unix timestamp and
      // comparing it with the current unis timestamp.
      yy: time.getFullYear(),
      mm: time.getMonth(),
      dd: time.getDate(),
      h: time.getHours() + 1,
      m: time.getMinutes(),
      // Default state to define, that the current AlarmClock is not started so far.
      alarmClockIsStarted: false,
      // Default state to define, that the current audio isn't playing so far.
      audioPlaying: false,
      // Default state to define, that the current audio is stopped so far.
      audioStopped: true
    };
  }

  // Get an initial time object, but formatted the right way.
  initTime = () => {
    const value = timeFormat(this.state.h, this.state.m, 0);
    return value;
    // A shorthand is possible here:
  };

  // Every time we change the input field value, we need to update the state
  handleOnChange = event => {
    // Extract only the number for hours from the string.
    const newHour = Number(event.target.value.split(":")[0]);
    // Extract only the number for minutes from the string.
    const newMin = Number(event.target.value.split(":")[1]);
    // Now update the state with the newly extracted values.
    this.setState({ h: newHour, m: newMin });
  };

  // Once we have made a decission on wich time the ALarmClock should end,
  // we wanna start the timer:
  handleSetTimer = () => {
    // Tell the state: this AlarmClock has begun and IS currently running.
    this.setState({ alarmClockIsStarted: true });
    // Here we really start the clock by calling the 'setInterval()' method.
    this.interval = setInterval(this.basicClock, 1000);
  };

  // Sometimes it is necessary to stop the current ALarmClock.
  handleStopTimer = () => {
    // Tell the state: this AlarmClock has stopped and ISN'T currently running.
    this.setState({ alarmClockIsStarted: false });
    // Stop the timer by clearing the interval.
    clearInterval(this.interval);
  };

  // This method is actually the core - it's the clock, that is ticking 'til the end
  basicClock = () => {
    // Get the current time, every 1000ms (= 1s)
    const currentTime = new Date();
    // Put the time (from the state objects), set by the user via the input field,
    // into a constant.
    // ATTENTION: the last property is set to '0'. This is because of we need the
    // seconds for the comparison, but we wanna set our AlarmClock to full minutes.
    const stopTime = new Date(
      this.state.yy,
      this.state.mm,
      this.state.dd,
      this.state.h,
      this.state.m,
      0
    );

    // Now we can compare the current time with the one from state.
    // There's no need to hold multiple conditions in the if-else statement.
    // We only need to check if the current time is bigger or at least equal
    // to the one from the state.
    if (currentTime >= stopTime) {
      // Call the 'onFinish' method we got from the props and
      // give the current AlarmClock ID with it.
      this.props.onFinish(this.props.id);
      // Call these methods:
      this.handleStopTimer();
      this.audio.load();
      this.audio.play();
    }
  };

  handleRemoveAlarmClock = () => {
    // CAREFUL: here you have to call the function you gave from above
    // via the props into this component! In this case 'removeAlarmClock'.
    // It is declared outside in the component injection as attribute (see arrow):
    /*  <AlarmClock
          key={alarmClock.id}
          finished={alarmClock.finished}
          onFinish={this.handleAlarmClockFinished}
    --->  removeAlarmClock={this.handleDeleteAlarmClock}
          id={alarmClock.id}
        />
    */
    this.props.removeAlarmClock(this.props.id);
  };

  // This method is called when the audio is playing
  handleOnPlay = () => {
    // Update the state with these properties:
    this.setState({
      audioPlaying: true,
      audioStopped: false
    });
  };

  // This method is called when the audio is stopped
  handleOnEnd = () => {
    // Update the state with these properties:
    this.setState({
      audioPlaying: false,
      audioStopped: true
    });
  };

  // Let's show something ...
  render() {
    // We need an attributed in the input field to disable it
    // when the AlarmClock is started
    let attributeDisabled = "";
    // Declare some text as long as it's not started
    let buttonText = "Set";
    // Give function which handler is called when we click on 'Set'
    let buttonFunction = this.handleSetTimer;
    // We define a style to show or hide the remove button
    let buttonStyleRemove = "";

    // When the AlarmClock is started ...
    if (this.state.alarmClockIsStarted) {
      // ... set the input field to disabled ...
      attributeDisabled = "disabled";
      // ... declare another button text ...
      buttonText = "Stop";
      // ... inject another button handler to stop the current AlarmClock ...
      buttonFunction = this.handleStopTimer;
      // ... and hide the remove button.
      buttonStyleRemove = "hide";
    }

    // Define a styling variable for the speaker icon and hide it by default.
    let iconSpeakerStyle = "hide";
    // When the AlarmClock has reached the end and the sound is playing ...
    if (this.state.audioPlaying) {
      // ... set the style for the speaker icon to show it.
      iconSpeakerStyle = "show";
    }

    // Now we are really ready to really show something ...
    return (
      <Clock>
        <RemoveButton
          // Set the style to show or hide this button.
          className={buttonStyleRemove}
          // Name the method, that should called:
          onClick={this.handleRemoveAlarmClock}
        >
          x
        </RemoveButton>
        <Speaker
          // Set the style to show or hide this button.
          className={iconSpeakerStyle}
        >
          <img alt="speaker" src={speaker} width="20" height="20" />
        </Speaker>
        <TimerInput
          type="time"
          name="alarmclock"
          // Put the initial time in the input field ...
          value={this.initTime()}
          // ... tell which handler to use ...
          onChange={this.handleOnChange}
          // ... and set it to disabled or not.
          disabled={attributeDisabled}
        />
        <SetButton
          // Inject the method, that should be called by pressing 'Set'.
          onClick={buttonFunction}
        >
          {buttonText}
        </SetButton>
        <audio
          ref={node => (this.audio = node)}
          id="timesUpSound"
          className="hide"
          // Call the method when the audio starts to play ...
          onPlay={this.handleOnPlay}
          // Call the method when the audio has stopped ...
          onEnded={this.handleOnEnd}
        >
          {/*
          Here we put in the audio files we wanna use. To be safe with 
          different browsers, we define two different audio sources.
        */}
          <source src={audioFile} type="audio/mpeg" />
        </audio>
      </Clock>
    );
  }
}

// As we are using 'styled components', we have to style the components:
const Clock = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
  margin: 10px 0;
`;

const Speaker = styled.div`
  position: absolute;
  width: 15px;
  height: 30px;
  line-height: 38px;
  padding: 0 5px;
  z-index: 9999;
  background-color: #333;

  img {
    width: 100%;
  }
`;

const TimerInput = styled.input`
  text-align: center;
  background-color: #333;
  border: none;
  width: 100%;

  &:hover {
    background-color: #444;
  }

  &:disabled {
    background-color: #111;
    &:hover {
      background-color: #111;
    }
  }

  &:focus {
    color: #333;
    background-color: #eee;
    outline: 0;
    box-shadow: inset 0 0 0 2px steelblue;
  }

  &::-webkit-clear-button,
  &::-webkit-cancel-button,
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::-ms-clear {
    display: none;
  }
`;

const RemoveButton = styled.button`
  display: block;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: bold;
  border: none;
  background-color: #333;
  width: 40px;
  line-height: 20px;
  margin: 0;
  padding: 0;
  text-align: center;

  &:hover {
    background-color: firebrick;
  }

  &:focus {
    outline: 0;
  }

  &.hide {
    display: none;
  }
`;

const SetButton = styled.button`
  font-size: 14px;
  border: none;
  background-color: black;
  width: 80px;
  padding: 0 20px;

  &:hover {
    background-color: steelblue;
  }

  &:focus {
    outline: 0;
  }
`;
// As you can see, you can chain nested CSS styles as
// you maybe know from the LESS or SASS syntax

// Now we only have to export the App.
export default AlarmClock;

// The component now can be imported by:
//  'import AlarmClock from "./components/alarmclock";'
// in the import section of each file you
// wanna use the component:
