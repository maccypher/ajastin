// This is an outsorced function. Outsourced because its easier to re-use it
// across in different methods within different files.

// This small function adds a leading '0' if the given var is lower than 10.
// We call this function in the the next one:
const digitFormat = digit => (digit < 10 ? "0" + digit : digit);

// Here we build the string in a special format that can be used in an input field.
const timeFormat = (hours, mins, secs) =>
  digitFormat(hours) + ":" + digitFormat(mins) + ":" + digitFormat(secs);

// Export the result
export default timeFormat;
