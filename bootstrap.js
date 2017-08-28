class Bootstrap {

    constructor() {
        this.y = 46;
    }

    getBasicParams(html) {
        let cs = '',
            ti = '',
            chs = '';
        // 撈 comic hash
        let $scripts = $(html).find('script');
        for (let i = 0; i < $scripts.length; i++) {
            if ($scripts[i].innerHTML.match(/var cs=/)) {
                let $script = $scripts[i];
                cs  = $script.innerHTML.match(/var cs='([\w]*)'/)[1] || null;
                ti  = $script.innerHTML.match(/var ti=([\d]*);/)[1] || null;
                chs = $script.innerHTML.match(/var chs=([\w]*);/)[1] || null;
            }
        }
        return {cs, ti, chs};
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
}
module.exports = Bootstrap;
