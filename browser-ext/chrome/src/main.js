// This code is not good working.

let pattern = [
	[/(クソ|糞|くそ)/ig, '嫌な'],
	[/^(ゴミカス|ゴミ)/ig, "嫌な"],
	[/(ゴミカス|ゴミ)($|。|」|、|\!|！)/ig, "嫌$2"],
	[/(悪|早|遅)(過ぎ|すぎ)/ig, "$1い"],
	[/^で(\?|、)/ig, "ところで$1"],
	[/バカ/g, "うーんって感じ"],
	[/頭(が|)悪い/g, "面白い"],
	[/(さっさと|はよ|)死ねば/g, "いなくなれば"],
	[/(さっさと|はよ|)死(ね|んで(.*|))(や|よ|)/g, "いなくなってほしい"],
	[/(に|)しろ(よ|)(。|、|\!|！|$)/g, "$1してほしい$3"],
	[/かよ(。|$)/g, ""],
	[/よな($|。|、)/g, ""],
	[/るぞ($|。|、)/g, "るかも$1"],
	[/(^|。|「|、)は(\?|？|、|$)/g, "$1どうして$2"],
	[/(ぶち|)殺(し(て(え|ー)|たい)|す)/g, "いなくなってほしい"],
	[/としか(\S*?)わない/g, "と$1う"],
	[/(って|が|は)キショ(|く(ワル|悪|わる))(かった|い|($|。|、|\!|！))/g, "$1好きになれな$4"],
	[/さっさと/g, "早く"],
	[/しろ(っ|。|」|、)/g, "してほしい$1"],
	[/((っつって)(んだ)|(っつってん)(の))/g, "って言ってる$3"],
	[/(て|は)くんな/g, "$1こないで"],
	[/キチガイ/g, "変人"],
	[/(見|出|消え)ろ/g, "$1てほしい"],
	[/てはなりません(。|、)/g, "て欲しくありません$1"],
	[/腹立つ/g, "好きになれない"],
];

let get_elements = function() {
	switch (location.host) {
		case "twitter.com":
			return document.getElementsByClassName("tweet-text");
		case "hayabusa.open2ch.net":
			return document.getElementsByClassName("mesg");
		case "www.google.com":
			return document.getElementsByClassName("rc");
		default:
			return document.getElementsByTagName("html");
	}
}

let t2t = function() {

	console.log("t2t");

	let elements = get_elements();

	for (let i = 0; i < pattern.length; i++) {
		for (let j = 0; j < elements.length; j++) {
			elements[j].innerHTML = elements[j].innerHTML.replace(pattern[i][0], "<span class='kanyou'>" + pattern[i][1]+"</span>");
		}
	}
};

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if (request == "Translate") {
		t2t();
	}
});