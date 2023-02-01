// ==UserScript==
// @name        tx-plan-closer/parse.js
// @namespace   Violentmonkey Scripts
// @match       https://www.cbh3.crediblebh.com/client/client_tx.aspx?client_id=*
// @grant       none
// @version     1.0
// @author      -
// @description 7/21/2022, 9:45:39 AM
// ==/UserScript==



const getCtx = () => {
  if (document.querySelector('[name="main"]') === null) {
    ctx = document;
  } else {
    ctx = document.querySelector('[name="main"]').contentDocument;
  }
}

// Parsing Funcs

const isPurple = (date) => {
  const team = ctx.querySelector(`[id=${date.id}] ~ [id$=Label4]`);
  const teamStr = team.innerHTML.replace('<b>Program:</b>&nbsp;&nbsp;', '');
  if (teamStr === 'RAM Purple ACT') { return true }
  else { return false };
}

const rangesAreValid = () => {
  generations.forEach((gen) => {
    const newerDate = new Date(gen);
    const olderDate = new Date(generations[generations.indexOf(gen) + 1]);
    const difference = (newerDate - olderDate) / (1000 * 60 * 60 * 24);
    if (difference > 192) { return false } // check if difference > 6 months (+12-day buffer)
  });
}

const getGenerations = () => {
  let generations = []
  purpleDates.forEach(date => {
    if (!generations.includes(date.textContent)) {
      generations.push(date.textContent);
    }
  })
  return generations;
}

const promptSixMonthError = () => {
    const input = prompt('Effective range greater than 6 months detected. Would you like to proceed? (y/n)');
    input = input.toLowerCase();
    if (input === 'y' || input === 'yes') { return }
    else if (input === 'n' || input === 'no') {
      alert('Treatment plan dates out of range, stopping execution...';
      throw 'Treatment plan dates out of range, stopping execution...'; 
    }
    else { promptSixMonthError() };
}

const editOldest = () => {
  localStorage.setItem('endDate', newDate);
  const editBtn = ctx.querySelector(`[id=${oldestDate.id}] ~ [id$=btnEdit]`);
  editBtn.click();
}



// Main


let ctx;
getCtx(); // get context (either 'document' or 'frame[name="main"]')

const allDates = ctx.querySelectorAll('[id$=Label1]');
let allDatesArr = Array.from(allDates);
let purpleDates = allDatesArr.filter(isPurple);

let generations = getGenerations();


if (rangesAreValid() === false) { promptSixMonthError() };

const oldestDate = purpleDates.at(-1);
const newDate = generations.at(-2); // gets generation following oldestDate


// Click editBtn
if (generations.length > 1) {
  console.log('editing...');
  editOldest();
}
