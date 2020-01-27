let dictionary = [];

chrome.browserAction.onClicked.addListener(function(tab) {
	//chrome.tabs.sendMessage(tab.id, "Translate");
});

chrome.contextMenus.create({
	title: "Translate to Tolerance",
	contexts: ["all"],
	type: "normal",
	onclick: function(info, tab) {
		chrome.tabs.sendMessage(tab.id, {action: "Translate", dictionary: dictionary});
	}
});

// load dictionaries
chrome.runtime.getPackageDirectoryEntry(function(root) {
	root.getDirectory("dict", {create:false}, function(dict_dir) {
		
		// Load list.txt
		dict_dir.getFile("list.txt", {create:false}, function(file_entry) {
			file_entry.file(function(file) {
				let reader = new FileReader();
				reader.addEventListener("load", function() {
					console.log(reader.result);
					loadDictionaries(reader.result.split("\n"));
				});
				reader.readAsText(file, "utf-8");
			});
		});
		
		function loadDictionaries(list) {
			console.log("loadDictionaries");
			for (let i = 0; i < list.length; i++) {
				dict_dir.getFile(list[i], {create:false}, function(file_entry) {
					file_entry.file(function(file) {
						let reader = new FileReader();
						reader.addEventListener("load", function() {
							console.log(reader.result);
							let temp_dict = [];
							let result = reader.result.split("\n");
							for (let j = 0; j < result.length; j++) {
								result[j] = result[j].split(" ");
								dictionary.push(result[j]);
							}
						});
						reader.readAsText(file, "utf-8");
					});
				});
			}
		}
	});
});