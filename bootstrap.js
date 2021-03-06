class Bootstrap {

    constructor(html) {
        this.y = 46;
        this.cs = '';
        this.ti = '';
        this.chs = '';
        this.setBasicParams(html);
    }

    setBasicParams(html) {
        // 撈 comic hash
        let $scripts = $(html).find('script');
        for (let i = 0; i < $scripts.length; i++) {
            if ($scripts[i].innerHTML.match(/var cs=/)) {
                let $script = $scripts[i];
                this.cs  = $script.innerHTML.match(/var cs='([\w]*)'/)[1] || null;
                this.ti  = parseInt($script.innerHTML.match(/var ti=([\d]*);/)[1]) || null;
                this.chs = parseInt($script.innerHTML.match(/var chs=([\w]*);/)[1]) || null;
            }
        }
    }
    getBasicParams() {
        return {cs: this.cs, ti: this.ti, chs: this.chs};
    }

    request (queryStringName) {
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

    lc(l) {
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

    su(a, b, c) {
        var e = (a + '').substring(b, b + c);
        return (e);
    }
    nn(n) {
            return n < 10 ? '00' + n : n < 100 ? '0' + n : n;
    }
    mm(p) {
            return (parseInt((p - 1) / 10) % 10) + (((p - 1) % 10) * 3)
    }
}
module.exports = Bootstrap;
