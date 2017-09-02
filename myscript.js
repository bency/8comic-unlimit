function extLocalStorage (namespace){
    var localStorage = window.localStorage || {};
    if(typeof namespace !== "string") {
        throw new Error("extLocalStorage: Namespace must be a string");
    }
    var getRealKey = function(key){
        return [namespace,".",key].join('');
    };
    var mainFunction = function(key, value){
        var realKey = getRealKey(key);
        if (value === undefined) {
            return localStorage[realKey];
        } else {
            return localStorage[realKey] = value;
        }
    };
    mainFunction.remove = function(key){
        var realKey = getRealKey(key);
        delete localStorage[realKey];
    };
    return mainFunction;
};

var request = function (queryStringName) {
    var returnValue = "";
    var URLString = new String(document.location);
    var serachLocation = -1;
    var queryStringLength = queryStringName.length;
    do {
        serachLocation = URLString.indexOf(queryStringName + "\=");
        if (serachLocation != -1) {
            if ((URLString.charAt(serachLocation - 1) == '?') || (URLString.charAt(serachLocation - 1) == '&')) {
                URLString = URLString.substr(serachLocation);
                break;
            }
            URLString = URLString.substr(serachLocation + queryStringLength + 1);
        }
    } while (serachLocation != -1) if (serachLocation != -1) {
        var seperatorLocation = URLString.indexOf("&");
        if (seperatorLocation == -1) {
            returnValue = URLString.substr(queryStringLength + 1);
        } else {
            returnValue = URLString.substring(queryStringLength + 1, seperatorLocation);
        }
    }
    return returnValue;
}


function getRandomToken () {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    // E.g. db18458e2782b2b77e36769c569e263a53885a9944dd0a861e5064eac16f1a
    return hex.substring(0, 32);
}

function setCookie (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function checkCookie () {
    var user = getCookie("liveany_log");
    if (user == "") {
        var id = getRandomToken();
        setCookie("liveany_log", id, 365);
    }
    return getCookie("liveany_log");
}

function htmlEncode (value){
    return $('<div/>').text(value).html();
}

/* cs: 很長的那串 hash
 * ti: http://new.comicvip.com/show/cool-103.html?ch=783 裡面的 103
 * chs: 最新話數
 */
function Vol (cs, ti, chs) {
    var comicHash = cs;
    var ch = request('ch');
    var vol_id = ti;
    var factor = 46;
    var max_ch = comicHash.length / factor - 1;
    var page = 0;
    var pad_zero = function (n) {
        return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
    }

    var lc = function (l) {
        if (l.length != 2)
            return l;
        var az = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var a = l.substring(0, 1);
        var b = l.substring(1, 2);
        if (a == "Z")
            return 8000 + az.indexOf(b);
        else
            return az.indexOf(a) * 52 + az.indexOf(b);
    }

    var su = function (a, b, c) {
        var e = (a + '').substring(b, b + c);
        return (e);
    }
    var ss = function (a, b, c, d) {
        var e = a.substring(b, b + c);
        return d == null ? e.replace(/[a-z]*/gi, "") : e;
    }
    var mm = function (p) {
        return (parseInt((p - 1) / 10) % 10) + (((p - 1) % 10) * 3)
    };
    if (0 === page) {
        if (ch.indexOf("-") > 0) {
            page = parseInt(ch.split('-')[1]);
            ch = ch.split('-')[0];
        } else if('' == ch) {
            ch = 1;
            page = 1;
        } else {
            page = 1
        }
    }

    var getVolHash = function () {
        var cc = comicHash.length;
        var volHash = '';
        var ci = 0;
        var nextCh = 0;
        var maxPage = 0;
        for (var i = 0; i < cc / factor; i++) {
            if (lc(su(comicHash, i * factor + 42, 2)) == ch) {
                volHash = lc(su(comicHash, i * factor + 2, 40));
                maxPage = lc(su(comicHash, i * factor + 0, 2));
                setId   = lc(su(comicHash, i * factor + 44, 2));
                ci = i;
                nextCh = ci < chs - 1 ? lc(su(comicHash, ci * factor + factor + 42, 2)) : ch;
                return {volHash, nextCh, setId, maxPage};
            }
        }
    }

    var volInfo = getVolHash();
    this.volHash = volInfo.volHash;
    this.getPicUrl = function () {
        var url = 'http://img' + su(volInfo.setId, 0, 1) + '.8comic.com/' + su(volInfo.setId, 1, 1) + '/' + vol_id + '/' + ch + '/' + pad_zero(page) + '_' + su(this.volHash, mm(page), 3) + '.jpg';
        if (this.isEnd()) {
            return '#';
        } else if (page >= volInfo.maxPage && "" != volInfo.nextCh) {
            page = 1;
            ch = volInfo.nextCh;
            volInfo = getVolHash();
            this.volHash = volInfo.volHash;
        } else {
            page++;
        }
        return url;
    }
    this.isEnd = function () {
        return (page > volInfo.maxPage && "" == volInfo.nextCh);
    }
    this.getUrlPostfix = function (preLoad) {
        return ch + '-' + Math.max(1, (page - 1 - preLoad));
    }
}

var Comic = function () {
    var cs = '', ti = '', chs = '';
    this.init = function (html) {

        // 撈 comic hash
        var $scripts = $(html).find('script');
        for (var i = 0; i < $scripts.length; i++) {
            if ($scripts[i].innerHTML.match(/var cs=/)) {
                var $script = $scripts[i];
                cs  = $script.innerHTML.match(/var cs='([\w]*)'/)[1] || null;
                ti  = $script.innerHTML.match(/var ti=([\d]*);/)[1] || null;
                chs = $script.innerHTML.match(/var chs=([\w]*);/)[1] || null;
            }
        }
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-66882171-1', 'auto');
        ga('send', 'pageview');
    }
    this.start = function () {
        $('body').append('<div class="container" id="main"></div>');
        var vol = new Vol(cs, ti);
        $('#main').append('<img class="full-width" src="' + vol.getPicUrl() + '"><hr>');

        $(window).on('scroll', function() {
            loadPic(4, vol);
        });
    }
    // preLoad: 在視線範圍底下預讀幾張圖
    var loadPic = function(preLoad, vol) {

        if (parseInt(preLoad) < 1) {

            // 預讀兩張
            preLoad = 2;
        }
        // 畫面上緣
        var wtop = $(window).scrollTop();

        // 漫畫底部
        var btop = $('#main').height();
        if ($("img[data-comic='hidden']").length < 2 && !vol.isEnd()) {
            $('#main').append('<img class="full-width centered" data-comic="hidden" style="display:none;margin-top:30px;" src="' + vol.getPicUrl() + '"><hr>');
            path = location.href.split('=')[0];
            new_url = path + '=' + vol.getUrlPostfix(preLoad);
            history.pushState({}, null, new_url);
        }
        if ((btop - wtop > window.innerHeight * preLoad)) {
            return;
        }
        $("img[data-comic='hidden']").first().attr("data-comic","display").show();

    }
    this.removeAd = function () {
        // 去廣告$("img").attr("davidou","180");
        $('#TheImg').remove();
        $('#Form1').remove();
        // 去廣告結束
    }
}

var comic = new Comic();
$.get(location.href).done(function (html) {
	comic.init(html);
	comic.removeAd();
	comic.start();
});
