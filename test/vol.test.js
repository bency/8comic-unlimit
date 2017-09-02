const Vol = require('../vol');
const Bootstrap = require('../bootstrap');
const fixtureHtml = require('./fixture/2017-08-29.html');
global.$ = require('jquery');

test('test vol hash', () => {
    let vol = new Vol(fixtureHtml);
    let expected = {url: "http://img2.8comic.com/3/3654/407/001_DCn.jpg", nextCh: 408, maxPage: 19};
    expect(vol.volInfo(407, 1)).toMatchObject(expected);
});
