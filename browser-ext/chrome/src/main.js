

let t2t_translation = false;
let t2t_elements = [];
let t2t_dictionary;
let t2t_regex;

let t2t_default_dic = [
	/*
	 * ["Pattern", "flags", "Replacement"]
	 */
	/*["(クソ|糞|くそ)", "g", '嫌な'],
	["^(ゴミカス|ゴミ)", "g", "嫌な"],
	["(ゴミカス|ゴミ)($|。|」|、|\\!|！)", "g", "嫌$2"],
	["(悪|早|遅)(過ぎ|すぎ)", "g", "$1い"],
	["^で(\\?|、)", "g", "ところで$1"],
	["バカ", "g", "うーんって感じ"],
	["頭(が|)悪い", "g", "面白い"],
	["(さっさと|はよ|)死ねば", "g", "いなくなれば"],
	["(さっさと|はよ|)死ね(や|よ|)", "g", "いなくなってほしい"],
	["(さっさと|はよ|)死んで([^「」。、]*)", "g", "いなくなって$2"],
	["(に|)しろ(よ|)(。|、|\\!|！|$)", "g", "$1してほしい$3"],
	["かよ(。|$)", "g", ""],
	["よな($|。|、)", "g", ""],
	["るぞ($|。|、)", "g", "るかも$1"],
	["(^|。|「|、)は(\\?|？|、|$)", "g", "$1どうして$2"],
	["(ぶち|)殺(し(て(え|ー)|たい)|す)", "g", "いなくなってほしい"],
	["としか(\S*?)わない", "g", "と$1う"],
	["(って|が|は|^)[キき]([ッっ]|)[シし][ョょ](|く(ワル|悪|わる))(かった|い|($|。|、|\\!|！|[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]))", "g", "$1好きになれな$5"],
	["さっさと", "g", "早く"],
	["しろ(っ|。|」|、)", "g", "してほしい$1"],
	["((っつって)(んだ)|(っつってん)(の))", "g", "って言ってる$3"],
	["(て|は)くんな", "g", "$1こないで"],
	["キチガイ", "g", "変人"],
	["(見|出|消え)ろ", "g", "$1てほしい"],
	["てはなりません(。|、)", "g", "て欲しくありません$1"],
	["腹立つ", "g", "好きになれない"],
	["う(る|っ)(さい|せ(ー|い))", "g", "静かにしてほしい"],
	["お前|てめ(え|ー)|テメー", "g", "あなた"],
	["だらいけない", "g", "でほしくない"],
	["(して|[すう](こと|事))はいけない", "g", "してほしくない"],
	["(っと|ってお)(こう|け|いて)", "g", "ってみるのはどうだろう"], // やっとこう
	["そこまで", "g", ""],
	["そもそも", "g", ""],
	["(なん|何)で", "g", "どうして"],*/
];

let md5_default_dic = md5(JSON.stringify(t2t_default_dic));

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