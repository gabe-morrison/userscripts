// ==UserScript==
// @name        dup-checker.js
// @namespace   Violentmonkey Scripts
// @match       https://www.cbh3.crediblebh.com/planner/planner4*
// @grant       none
// @version     1.0
// @author      -
// @description 1/31/2023, 10:31:56 AM
// ==/UserScript==

const arr = Array.from(document.querySelectorAll('a.cwtt'));
let filteredArr = [];


const filterDups = (target) => {
	filteredArr = arr.filter((el) => {
		if (target.textContent === el.textContent) {
			el.style.backgroundColor = 'yellow';
			return el;
		}
	})
}


const handleMouseEnter = (e) => filterDups(e.target);

const handleMouseExit = () => {
	filteredArr.forEach((el) => {el.style.backgroundColor = null});
	filteredArr = [];
}

arr.forEach((el) => {
	el.addEventListener('mouseenter', (e) => handleMouseEnter(e));
	el.addEventListener('mouseleave', handleMouseExit);
})
