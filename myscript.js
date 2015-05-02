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

// 撈 comic hash
var $scripts = $('script');
for (var i = 0; i < $scripts.length; i++) {
    if ($scripts[i].innerHTML.match(/var cs=/)) {
        var $script = $scripts[i];
        cs  = $script.innerHTML.match(/var cs='([\w]*)'/)[1] || null;
        ti  = $script.innerHTML.match(/var ti=([\d]*);/)[1] || null;
        chs = $script.innerHTML.match(/var chs=([\w]*);/)[1] || null;
    }
}

/* cs: 很長的那串 hash
 * ti: http://new.comicvip.com/show/cool-103.html?ch=783 裡面的 103
 * chs: 最新話數
 */
function Vol (cs, ti, page) {
    var comicHash = cs;
    var ch = request('ch');
    var vol_id = ti;
    var factor = 50;
    var max_ch = comicHash.length / factor - 1;
    var page = page;
    var pad_zero = function (n) {
        return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
    }
    var ss = function (a, b, c, d) {
        var e = a.substring(b, b + c);
        return d == null ? e.replace(/[a-z]*/gi, "") : e;
    }
    var mm = function (p) {
        return (parseInt((p - 1) / 10) % 10) + (((p - 1) % 10) * 3)
    };
    if ('undefined' === typeof page) {
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
        for (var i = 0; i < cc / factor; i++) {
            if (ss(comicHash, i * factor, 4) == ch) {
                volHash = ss(comicHash, i * factor, factor, factor);
                ci = i;
                nextCh = ss(comicHash, (ci + 1) * factor, 4);
                return {volHash: volHash, nextCh: nextCh};
            }
        }
        volHash = ss(comicHash, cc - factor, factor);
        nextCh = ss(comicHash, (ci - 1) * factor, 4);
        return {volHash: volHash, nextCh: nextCh};
    }

    var volInfo = getVolHash();
    this.volHash = volInfo.volHash;
    var maxPage = ss(this.volHash, 7, 3);
    this.getPicUrl = function () {
        var url = 'http://img' + ss(this.volHash, 4, 2) + '.8comic.com/' + ss(this.volHash, 6, 1) + '/' + vol_id + '/' + ss(this.volHash, 0, 4) + '/' + pad_zero(page) + '_' + ss(this.volHash, mm(page) + 10, 3, factor) + '.jpg';
        if (this.isEnd()) {
            return '#';
        } else if (page > maxPage) {
            page = 1;
            ch = volInfo.nextCh;
            volInfo = getVolHash();
            this.volHash = volInfo.volHash;
            maxPage = ss(this.volHash, 7, 3);
        } else {
            page++;
        }
        return url;
    }
    this.isEnd = function () {
        return (page > maxPage && "" == volInfo.nextCh);
    }
    this.getUrlPostfix = function () {
        return ch + '-' + Math.max(1, (page - 1));
    }
}
var vol = new Vol(cs, ti);
$('#TheTable > tbody > tr > td').append('<img src="' + vol.getPicUrl() + '"><hr>');

var loadPic = function() {
    // 畫面上緣
    var wtop = $(window).scrollTop();

    // 漫畫底部
    var btop = $('#TheTable > tbody > tr > td').height() + $('#TheTable > tbody > tr > td').offset().top;
    if ($('img:hidden').length < 2 && !vol.isEnd()) {
        $('#TheTable > tbody > tr > td').append('<img style="display:none;margin-top:30px;" src="' + vol.getPicUrl() + '"><hr>');
        path = location.href.split('=')[0];
        new_url = path + '=' + vol.getUrlPostfix();
        history.pushState({}, null, new_url);
    }
    if ((btop - wtop > window.innerHeight * 1.2)) {
        return;
    }
    $('img:hidden').first().fadeIn(1000);
}
$(window).on('scroll', loadPic);

// 去廣告
$('#TheImg').remove();
$('#Form1').ready(function(){
    $('#Form1 > table:nth-child(3)').remove();
    $('#Form1 > table:nth-child(3)').remove();
    $('iframe').remove();
});
// 去廣告結束
