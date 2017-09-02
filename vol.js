const Bootstrap = require('./bootstrap');
class Vol extends Bootstrap
{
    constructor(html)
    {
        super(html);
        // cs 後的 for 迴圈範圍
        this.forLimit = 507;
        this.ps = 0;
        this.page = 0;
    }

    volInfo(ch, p)
    {
        let url, setId, volHash, tfdoq, wisks, nextCh = 0, ci, a, b;
        for (let i = 0; i < this.forLimit; i++) {
            setId = this.lc(this.su(this.cs, i * this.y + 0, 2));
            volHash = this.lc(this.su(this.cs, i * this.y + 2, 40));
            if (this.lc(this.su(this.cs, i * this.y + 42, 2)) == ch) {
                this.ps = this.lc(this.su(this.cs, i * this.y + 44, 2));
                ci = i;
                url = 'http://img' + this.su(setId, 0, 1) + '.8comic.com/' + this.su(setId, 1, 1) + '/' + this.ti + '/' + ch + '/' + this.nn(p) + '_' + this.su(volHash, this.mm(p), 3) + '.jpg';
                //pi = ci > 0 ? lc(su(cs, ci * y - y + 42, 2)) : ch;
                nextCh = ci < this.chs - 1 ? this.lc(this.su(this.cs, ci * this.y + this.y + 42, 2)) : ch;
                break;
            }
        }
        return {url, nextCh: nextCh, maxPage: this.ps};
    }

    getPicUrl()
    {
    }
}
module.exports = Vol;
