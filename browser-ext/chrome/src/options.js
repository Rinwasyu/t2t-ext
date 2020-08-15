let dictionary = [];

let load_default_dictionary = function() {
	// load dictionaries
	chrome.runtime.getPackageDirectoryEntry(function(root) {
		root.getDirectory("dict", {create:false}, function(dict_dir) {
			// Load list.txt
			dict_dir.getFile("list.txt", {create:false}, function(file_entry) {
				file_entry.file(function(file) {
					let reader = new FileReader();
					reader.addEventListener("load", function() {
						loadDictionaries(reader.result.split("\n"));
					});
					reader.readAsText(file, "utf-8");
				});
			});
			
			function loadDictionaries(list) {
				for (let i = 0; i < list.length; i++) {
					dict_dir.getFile(list[i], {create:false}, function(file_entry) {
						file_entry.file(function(file) {
							let reader = new FileReader();
							reader.addEventListener("load", function() {
								document.getElementById("dictionary").value = reader.result;
							});
							reader.readAsText(file, "utf-8");
						});
					});
				}
			}
		});
	});
};

chrome.runtime.sendMessage({command:"get"}, function(response) {
	result = response.dictionary;
	for (let j = 0; j < result.length; j++) {
		result[j] = result[j].join(" ");
	}
	result = result.join("\n");
	document.getElementById("dictionary").value = result;
});

window.addEventListener("load", function() {
	document.getElementById("save_dictionary").addEventListener("click", function() {
		chrome.runtime.sendMessage({command:"save", dictionary:document.getElementById("dictionary").value});
	});
	document.getElementById("load_default_dictionary").addEventListener("click", function() {
		load_default_dictionary();
	});
});