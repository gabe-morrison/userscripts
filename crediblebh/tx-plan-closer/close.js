// ==UserScript==
// @name        crediblebh/tx-plan-closer/close.js
// @namespace   Violentmonkey Scripts
// @match       https://www.cbh3.crediblebh.com/client/client_tx_add.aspx?client_id=*&mode=edit&tx_id=*
// @grant       none
// @version     1.0
// @author      -
// @description 8/15/2022, 12:19:56 PM
// ==/UserScript==



const getCtx = () => {
  if (document.querySelector('[name="main"]') === null) {
    ctx = document;
  } else {
    ctx = document.querySelector('[name="main"]').contentDocument;
  }
}

const checkRangeValidity = () => {
    oldDate = new Date(startDate);
    newDate = new Date(endDate);
    const difference = (newDate - oldDate) / (1000 * 60 * 60 * 24);
    // check if difference > 6 months (+12-day buffer)
    if (difference > 192) { promptOutOfRange(newDate, oldDate, difference) };
}

const getRandomTimeout = () => Math.floor((Math.random() * (.9999 - .5000) + .5000) * 10000);

const promptOutOfRange = () => {
    const input = Window.prompt('Effective range greater than 6 months detected. Would you like to proceed? (y/n)');
    input = input.toLowerCase();
    if (input === 'y' || input === 'yes') { return }
    else if (input === 'n' || input === 'no') { throw 'Treatment plan dates out of range; stopping execution...' }
    else { promptOutOfRange() };
}

// get context (either 'document' or 'frame[name="main"]')
let ctx;
getCtx();

const endDateField = ctx.querySelector('#ctl00_cph_txtEndDate');
const saveBtn = ctx.querySelector('#ctl00_cph_btnSave');

const startDate = ctx.querySelector('#ctl00_cph_txtStartDate').value;
const endDate = sessionStorage.getItem('endDate');

console.log(`End Date: ${endDate}`);

checkRangeValidity();

endDateField.value = endDate;

setTimeout(() => {
  saveBtn.click();
}, getRandomTimeout());
