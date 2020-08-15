let dictionary = [];

chrome.runtime.sendMessage({command:"get"}, function(response) {
	console.log(response);
	result = response.dictionary;
	for (let j = 0; j < result.length; j++) {
		result[j] = result[j].join(" ");
	}
	result = result.join("\n");
	document.getElementById("dictionary").value = result;
});

window.addEventListener("load", function() {
	document.getElementById("save_dictionary").addEventListener("click", function() {
		console.log("sendMessage");
		console.log(document.getElementById("dictionary").value);
		chrome.runtime.sendMessage({command:"save", dictionary:document.getElementById("dictionary").value});
	});
});