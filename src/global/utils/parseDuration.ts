// import log from './logger';
// import {parse} from 'path';
// const F = f(__filename);

export default parseDuration;

/**
 * This takes a string and converts it into time
 * @param {string} duration A string representing a duration
 * @return {number} The duration in milliseconds
 */
export async function parseDuration(duration:string):Promise<number> {
  // Those code inspired by https://gist.github.com/substanc3-dev/306bb4d04b2aad3a5d019052b1a0dec0
  // This is super cool, thanks a lot!
  const supported = 'smMhdwmoy';
  const numbers = '0123456789';
  let stage = 1;
  let idx = 0;
  let tempNumber = 0;
  let tempString = '';
  let timeValue = 0;
  while (idx < duration.length) {
    const c = duration[idx];
    switch (stage) {
      case 1: // waiting for number
      {
        idx += 1;
        if (numbers.includes(c)) {
          tempString = c.toString();
          stage = 2;
        }
        break;
      }
      case 2: // parsing the number
      {
        if (numbers.includes(c)) {
          tempString += c;
          idx += 1;
        } else {
          // log.debug(F, `TValue: ${tempString}`);
          tempNumber = Number.parseInt(tempString, 10);
          stage = 3;
        }
        break;
      }
      case 3: // parsing the qualifier
      {
        idx += 1;
        if (c === ' ') {
          break;
        } else if (supported.includes(c)) {
          // log.debug(F, `Qualifier ${c}`);
          if (c === 'h') {
            timeValue += tempNumber * 60 * 60 * 1000;
          }
          if (c === 'M') {
            timeValue += tempNumber * 30 * 24 * 60 * 60 * 1000;
          }
          if (c === 'm') {
            timeValue += tempNumber * 60 * 1000;
          }
          if (c === 's') {
            timeValue += tempNumber * 1000;
          }
          if (c === 'd') {
            timeValue += tempNumber * 24 * 60 * 60 * 1000;
          }
          if (c === 'w') {
            timeValue += tempNumber * 7 * 24 * 60 * 60 * 1000;
          }
          if (c === 'y') {
            timeValue += tempNumber * 365 * 24 * 60 * 60 * 1000;
          }
          stage = 1;
          break;
        } else return timeValue;
      }
      default:
        break;
    }
  }
  return timeValue;
}

/*
 Input validation for parseDuration. Ensures string is a written time in one or multiple of 3 formats.
*/
export const validateDurationInput = (input: string): boolean => {
  // eslint-disable-next-line max-len
  const regex = /^(\d+\s?(y|year|M|month|w|week|d|day|days|h|hour|hours|m|min|mins|minute|minutes|s|sec|secs|second|seconds)\s?)+$/i;
  return regex.test(input.trim());
};

/*
 This function takes input in the form of years/months, etc, as written and converts them to smMhdwmoy format.
 It was used to force string compliance for parseDuration but may not be necessary.
 Feel free to remove it if it's not used in a year or two.
*/
export async function makeValid(duration: string): Promise<string> {
  // Define a map for the units and their short forms
  const unitMap: Record<string, string> = {
    years: 'y',
    year: 'y',
    months: 'M',
    month: 'M',
    weeks: 'w',
    week: 'w',
    days: 'd',
    day: 'd',
    hours: 'h',
    hour: 'h',
    minutes: 'm',
    minute: 'm',
    seconds: 's',
    second: 's',
  };

  // Regular expression to match the input format
  const regex = /\b(\d+)\s*(years?|months?|weeks?|days?|hours?|minutes?|seconds?)\b/gi;

  // Array to store the parsed results
  const parts: string[] = [];

  // Replace matched parts with their formatted versions
  let match;
  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(duration)) !== null) {
    const value = match[1]; // The number (e.g., "1")
    const unit = match[2].toLowerCase(); // The unit (e.g., "year" or "years")

    // Map the unit to its short form and combine with the value
    if (unit in unitMap) {
      parts.push(`${value}${unitMap[unit]}`);
    }
  }

  // Join the parts with a space to form the final result
  return parts.join(' ');
}
