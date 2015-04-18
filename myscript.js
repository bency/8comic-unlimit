var data;
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

var loadPic = function() {
    // 畫面上緣
    var wtop = $(window).scrollTop();

    // 漫畫底部
    var btop = $('#TheTable > tbody > tr > td').height() + $('#TheTable > tbody > tr > td').offset().top;
    if ((loaded == 0 || btop - wtop < window.innerHeight * 1.2)  && data.total > 0) {
        if (loaded < data.total) {
            $('img:hidden').first().fadeIn(1000);
            if (data.urls.length > 0 && $('img:hidden').length == 0) {
                $('#TheTable > tbody > tr > td').append('<img style="display:none;margin-top:30px;" src="' + data.urls.pop() + '"><hr>');
                loaded++;
            }
        } else {
            $(window).unbind('scroll', loadPic);
            path = location.href.split('=')[0];
            vol = parseInt(location.href.split('=')[1]) + 1;
            new_url = path + '=' + vol;
            console.log(new_url);
            history.pushState({}, null, new_url);
            getHtml(new_url);
        }
    }
}

function scrollInit (ret) {
    if (ret) {
        console.log(ret);
        data = ret;
        data.urls.reverse();
        for (i=0; i < 3; i++) {
            $('#TheTable > tbody > tr > td').append('<img src="' + data.urls.pop() + '"><hr>');
        }
        loaded = 3;
        $(window).on('scroll', loadPic);
    }
}

function getHtml (url) {
    $('#loading-fa').addClass('loading-fa');
    loaded = 0;
    $.ajax({
        url: 'http://infinite.bency.org/get_8comic.php',
        dataType: 'json',
        data: {url: url, method: 'json'},
        //jsonp: 'callback',
        //jsonpCallback: 'showpic',
        success: scrollInit
    });
}
$('#TheImg').remove();
getHtml(location.href);
