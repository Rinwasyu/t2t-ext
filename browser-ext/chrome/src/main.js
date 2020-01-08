// This code is not good working.

let pattern = [
	[/(クソ|糞|くそ)/ig, '嫌い'],
];

console.log("t2t");
	
let body_elem = document.getElementsByTagName("body")[0];

for (let i = 0; i < pattern.length; i++) {
	body_elem.innerHTML = body_elem.innerHTML.replace(pattern[i][0], pattern[i][1]);
}