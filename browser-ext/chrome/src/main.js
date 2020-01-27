

let t2t_translation = false;
let t2t_elements = [];
let t2t_dictionary;
let t2t_regex;

let get_elements = function() {
	switch (location.host) {
		case "twitter.com":
			return document.getElementsByClassName("css-901oao css-16my406 r-gwet1z r-ad9z0x r-bcqeeo r-qvutc0");
		case "hayabusa.open2ch.net":
			return document.getElementsByClassName("mesg");
		case "www.google.com":
			return document.getElementsByClassName("rc");
		default:
			return document.getElementsByTagName("html");
	}
}

let get_dictionary = function() {
	let dic_array = t2t_dictionary;
	let dic_regex = [];
	console.log(t2t_dictionary.length);
	for (let i = 0; i < dic_array.length; i++) {
		dic_regex[i] = [
			new RegExp(dic_array[i][0], "g"),
			dic_array[i][1]
		];
	}
	
	return dic_regex;
};

let t2t = function() {
	if (!t2t_regex) {
		t2t_regex = get_dictionary();
		console.log(t2t_regex);
	}
	
	console.log("t2t");
	
	t2t_elements = get_elements();
	
	for (let i = 0; i < t2t_elements.length; i++) {
		if (!t2t_elements[i].dataset.t2t_md5sum || t2t_elements[i].dataset.t2t_md5sum != md5(t2t_elements[i].innerHTML)) {
			for (let j = 0; j < t2t_regex.length; j++) {
				if (t2t_elements[i].innerHTML != t2t_elements[i].innerHTML.replace(t2t_regex[j][0], t2t_regex[j][1]))
					console.log("変換！");
				t2t_elements[i].innerHTML = t2t_elements[i].innerHTML.replace(
						t2t_regex[j][0],
						"<span class='kanyou'>" + t2t_regex[j][1]+"</span>"
					);
				t2t_elements[i].dataset.t2t_md5sum = md5(t2t_elements[i].innerHTML);
			}
		}
	}
	setTimeout(t2t, 1000);
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.action == "Translate") {
		if (!t2t_translation) {
			t2t_translation = true;
			t2t_dictionary = request.dictionary;
			console.log(t2t_dictionary);
			t2t();
		}
	}
});