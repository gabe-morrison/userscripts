// ==UserScript==
// @name        CBH Activity Attachment Helper - 3
// @namespace   Violentmonkey Scripts
// @match       https://www.cbh3.crediblebh.com/common/add_attachment.asp
// @exclude     /\?sType=C/
// @grant       none
// @version     1.0
// @author      -
// @description 2/27/2023, 2:47:46 PM
// ==/UserScript==


const activityId = window.location.href.match(/(?<=id=)\d*/)[0];
const descriptionField = document.querySelector('input[name="file_description"]');

console.log(activityId);
descriptionField.value = activityId;


document.querySelector('label#fileinput-label').click();
