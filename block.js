var urls = [
    'chrome-extension://paioodidofebolkhokfcagmhiencnfmp/manifest.json'
];

var response = function() {
    return { cancel: true };
}

chrome.webRequest.onBeforeRequest.addListener(response, { urls: urls }, ['blocking'] );
