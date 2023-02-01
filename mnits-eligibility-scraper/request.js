// ==UserScript==
// @name        MNITS-Scraper/request.js
// @namespace   Violentmonkey Scripts
// @match       https://mn-its.dhs.state.mn.us/pr/trans/elig/eligrequest
// @grant       none
// @version     1.0
// @author      Gabriel Morrison
// @description 1/23/2023, 2:53:49 PM
// ==/UserScript==



// CSV Import Funcs

const createInputPrompt = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.style.position = 'absolute';
  input.style.left = '0';
  input.style.top = '0';
  input.style.backgroundColor = 'white';
  input.style.border = 'black 2px dashed';
  input.style.zIndex = '9999';
  input.textContent = "Please select a .csv file to parse";
  input.id = 'csvInput';
  document.querySelector('body').appendChild(input);
  input.addEventListener('change', processCSV);
}

const processCSV = () => {
  const input = document.querySelector('#csvInput');
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    console.log('The File APIs are not fully supported in this browser.');
    return;
  }
  if (!input.files[0]) { console.log("No file selected."); return};
  const csv = input.files[0];
  const fr = new FileReader();
  fr.onload = (e) => {
    toJSON(e.target.result);
    fillForm();
  }
  fr.readAsText(csv);
}


const toJSON = (str) => {
  let arr = str.split(/\r?\n/);
  arr = arr.filter((el) => {if (el) {return el}});
  let data = [];
  let row = [];
  let currentCol = 0;
  const selectedCols = [0, 4, 5];
  for (i=0;i<arr.length;i++) {
    data[i] = arr[i].split(',');
    data[i] = data[i].filter((el, index) => {
      if (el && data[i].length >= 5 && selectedCols.includes(index)) {
        return el;
      }
    });
  }
  data[0] = ["ID","DOB","PMI","MAJOR PROGRAM","PMAP"];
  sessionStorage.setItem('csvData', JSON.stringify(data));
  sessionStorage.setItem('rowIndex', 1);
}




// Query Funcs

const getBirthdate = (date) => {
  const dateObj = new Date(date);
  const year = dateObj.getFullYear().toString();
  let month = dateObj.getMonth() + 1;
  month = month.toString().length === 2 ? month : `0${month}`;
  const day = dateObj.getDate().toString().length === 2 ? dateObj.getDate() : `0${dateObj.getDate()}`;
  return `${month}/${day}/${year}`;
}

const submitForm = () => {
  console.log('submitting request...');
  setTimeout(() => {
    document.querySelector('input[type="submit"].mnits-btn-primary').click();
  }, getRandomTimeout());
}

const fillForm = () => {
  let rowIndex = Number(sessionStorage.getItem('rowIndex'));
  const data = JSON.parse(sessionStorage.getItem('csvData'));
  console.log(data);
  if (isComplete(data, rowIndex)) { return } else {
    try {
        if (data[rowIndex][2].length === 8) {
          document.getElementById('eligibilityRequest.subs_id').value = data[rowIndex][2];
        } else {
          skipRow(data, rowIndex, 'Invalid PMI length, please check row.');
          return;
        }
        if (dateRegex.test(data[rowIndex][1])) {
          const birthdate = getBirthdate(data[rowIndex][1]);
          document.getElementById('eligibilityRequest.subs_birth_date').value = birthdate;
        } else {
          skipRow(data, rowIndex, 'Invalid birthdate, please check row.');
          return;
        }
        console.log(data[rowIndex][1], dateRegex.test(data[rowIndex][1]));
    } catch {
      console.error("Error, skipping row");
      skipRow(data, rowIndex, 'Missing columns.');
    }
    console.log('submitting request...');
    submitForm();
  }
}



// Utility Funcs

const isComplete = (data, rowIndex) => {
  if (rowIndex === data.length) {
    console.log('Scraping complete');
    exportCSV(data);
    return true;
  } else { return false }
}

const exportCSV = (data) => {
  let csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "my_data.csv");
  document.body.appendChild(link); // Required for FF
  link.click();
  sessionStorage.removeItem('csvData');
  sessionStorage.removeItem('rowIndex');
}

const skipRow = (arr, rowIndex, msg) => {
    const data = arr;
    console.log(`Skipping row. ${msg}`);
    data[rowIndex].push('null','null', msg);
    sessionStorage.setItem('csvData', JSON.stringify(data));
    sessionStorage.setItem('rowIndex', Number(++rowIndex));
    fillForm();
}

const getRandomTimeout = () => Math.floor((Math.random() * (.9999 - .5000) + .5000) * 10000);



// Main

const dateRegex = /\d{1,2}\/\d{1,2}\/\d{4}/g;

if (!sessionStorage.getItem('rowIndex')) {
  sessionStorage.setItem('rowIndex', 1);
  console.log('creating input prompt');
  createInputPrompt();
} else {
  console.log('querying MN-ITS');
  fillForm();
}
