// ==UserScript==
// @name        CBH Activity Attachment Helper - 1
// @namespace   Violentmonkey Scripts
// @match       https://www.cbh3.crediblebh.com/visit/list_cvs.asp
// @grant       none
// @version     1.0
// @author      -
// @description 2/27/2023, 2:22:11 PM
// ==/UserScript==

if (/^\d*$/.test(document.querySelector('input[name="clientvisit_id"]').value)) {

  const getRandomTimeout = () => Math.floor((Math.random() * (.9999 - .5000) + .5000) * 1000);

  const activities = document.querySelectorAll('a.listbtn[title="View Activity Details"]');

  setTimeout(() => {
    activities.length === 1
      ? activities[0].click()
      : alert('No exact matches found. Please check activity number or disable script.')
  }, getRandomTimeout());

}

