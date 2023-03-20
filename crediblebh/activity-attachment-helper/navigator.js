// ==UserScript==
// @name        CBH Activity Attachment Helper - 2
// @namespace   Violentmonkey Scripts
// @match       https://www.cbh3.crediblebh.com/visit/clientvisit_view.asp
// @grant       none
// @version     1.0
// @author      -
// @description 2/27/2023, 2:29:24 PM
// ==/UserScript==


const getRandomTimeout = () => Math.floor((Math.random() * (.9999 - .5000) + .5000) * 1000);

if (document.querySelector('img[src="/images/btn_delete_sm.gif"]') === null) {
  setTimeout(() => {
    document.querySelector('input.sminputbtn7').click();
  }, getRandomTimeout());
}



