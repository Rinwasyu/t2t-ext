let dictionary = [];

chrome.contextMenus.create({
	title: "寛容な文章に翻訳",
	contexts: ["all"],
	type: "normal",
	onclick: function(info, tab) {
		chrome.tabs.sendMessage(tab.id, {action: "t2t", dictionary: dictionary});
	}
});

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
				console.log("loading dictionaries...");
				for (let i = 0; i < list.length; i++) {
					dict_dir.getFile(list[i], {create:false}, function(file_entry) {
						file_entry.file(function(file) {
							let reader = new FileReader();
							reader.addEventListener("load", function() {
								let temp_dict = [];
								let result = reader.result.split("\n");
								for (let j = 0; j < result.length; j++) {
									result[j] = result[j].split(" ");
								}
								dictionary = result;
							});
							reader.readAsText(file, "utf-8");
						});
					});
				}
			}
		});
	});
};

chrome.storage.local.get(["dictionary"], function(items) {
	console.log(items.dictionary);
	if (items.dictionary) {
		result = items.dictionary.split("\n");
		for (let j = 0; j < result.length; j++) {
			result[j] = result[j].split(" ");
		}
		dictionary = result;
	} else {
		load_default_dictionary();
	}
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	console.log("onchanged:", namespace);
	if (namespace == "local") {
		console.log(changes.dictionary);
		result = changes.dictionary.split("\n");
		for (let j = 0; j < result.length; j++) {
			result[j] = result[j].split(" ");
		}
		dictionary = result;
		console.log("dictionary:", dictionary);
	}
});

let save_dictionary = function(dict) {
	chrome.storage.local.set({dictionary: dict});
	result = dict.split("\n");
	for (let j = 0; j < result.length; j++) {
		result[j] = result[j].split(" ");
	}
	dictionary = result;
	console.log("dictionary:", dictionary);
};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("message");
	console.log(request);
	if (request.command == "save") {
		console.log("save:", request.dictionary);
		save_dictionary(request.dictionary);
	} else if (request.command == "get") {
		console.log("get:", dictionary);
		sendResponse({dictionary: dictionary});
	}
	return true;
});