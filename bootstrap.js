class Bootstrap {
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
}
module.exports = Bootstrap;
