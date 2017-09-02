/* cs: 很長的那串 hash
 * ti: http://new.comicvip.com/show/cool-103.html?ch=783 裡面的 103
 * chs: 最新話數
 */
function VolSp (cs, ti, chs) {
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
        } else if (page == maxPage && "" != volInfo.nextCh) {
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
    this.getUrlPostfix = function (preLoad) {
        return ch + '-' + Math.max(1, (page - 1 - preLoad));
    }
}
