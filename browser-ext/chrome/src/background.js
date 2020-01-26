chrome.browserAction.onClicked.addListener(function(tab) {
	//chrome.tabs.sendMessage(tab.id, "Translate");
});

chrome.contextMenus.create({
	title: "Translate to Tolerance",
	contexts: ["all"],
	type: "normal",
	onclick: function(info, tab) {
		chrome.tabs.sendMessage(tab.id, "Translate");
	}
});