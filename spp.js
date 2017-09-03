/* cs: 很長的那串 hash
 * ti: http://new.comicvip.com/show/cool-103.html?ch=783 裡面的 103
 * chs: 最新話數
 */
function VolSpp (cs, ti, chs) {
    var comicHash = cs;
    var ch = request('ch');
    var vol_id = ti;
    var factor = 46;
    var max_ch = chs;
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
