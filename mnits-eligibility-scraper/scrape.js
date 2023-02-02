// ==UserScript==
// @name        MNITS-Scraper/scrape.js
// @namespace   Violentmonkey Scripts
// @match       https://mn-its.dhs.state.mn.us/pr/trans/elig/dorequest
// @grant       none
// @version     1.0
// @author      -
// @description 1/24/2023, 11:26:14 AM
// ==/UserScript==

let rowIndex = sessionStorage.getItem('rowIndex');

let list = document.querySelectorAll('li');

let majorProgram = '';
let pmap = '';
let comments = '';

const majorProgramRegex = /(?<=has eligibility for\s|eligible\sfor.*\s)(MA|QM|IM)(?=:)/;
const pmapRegex = /(?<=delivered\sthrough.*\s)([a-zA-Z]*\s{0,1}[a-zA-Z]*)(?=\.)/;
const spenddownRegex = /eligible for MA: Medical Assistance after a spenddown has been satisfied\./;
const inactivityRegex = /Subscriber is inactive\./;

const getMajorProgram = () => {
  list.forEach((li) => {
    if (majorProgramRegex.test(li.innerText)) {
      majorProgram += li.innerText.match(majorProgramRegex)[0];
    }
  })
  if (majorProgram === '') {majorProgram = ''}
}

const getPMAP = () => {
  list.forEach((li) => {
    if (pmapRegex.test(li.innerText)) {
      switch(li.innerText.match(pmapRegex)[0]) {
        case 'HealthPartners Care':
          pmap = 'HP';
          break;
        case 'UCare Minnesota':
          pmap = 'UCARE';
          break;
        case 'Medica':
          pmap = 'MEDICA';
          break;
        case 'Blue Plus':
          pmap = 'BCBS';
          break;
        case 'Hennepin Health':
          pmap = 'HH';
          break;
        default:
          pmap = 'UNRECOGNIZED PMAP';
      }
    }
  })
}

const getSpenddown = () => {
  list.forEach((li) => {
    if (spenddownRegex.test(li.innerText)) {
      comments = 'spenddown';
    }
  })
}

const checkInactivity = () => {
  list.forEach((li) => {
    if (inactivityRegex.test(li.innerText)) {
      comments = 'INACTIVE';
    }
  })
}

const checkAllFieldsEmpty = () => {
  if (majorProgram === '' && pmap === '' && comments === '') {
    comments = 'ERROR\, please review';
  }
}

const submitForm = () => {
  setTimeout(() => {
    document.querySelector('input[type="submit"].mnits-btn-primary').click();
  }, getRandomTimeout());
}

const updateSessionStorage = () => {
  let data = JSON.parse(sessionStorage.getItem('csvData'));
  data[rowIndex].splice(3, data[rowIndex].length, majorProgram, pmap, comments);
  sessionStorage.setItem('csvData', JSON.stringify(data));
  sessionStorage.setItem('rowIndex', Number(++rowIndex));
}

const getRandomTimeout = () => Math.floor((Math.random() * (.9999 - .5000) + .5000) * 10000);

getMajorProgram();
getPMAP();
getSpenddown();
checkInactivity();
checkAllFieldsEmpty();
console.log(`Major Program: ${majorProgram}\nPMAP: ${pmap}\nComments: ${comments}`);
updateSessionStorage();
submitForm();
