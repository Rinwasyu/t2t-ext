let dictionary = [];

chrome.contextMenus.create({
	title: "寛容な文章に翻訳",
	contexts: ["all"],
	type: "normal",
	onclick: function(info, tab) {
		chrome.tabs.sendMessage(tab.id, {action: "t2t", dictionary: dictionary});
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