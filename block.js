var urls = [
    '*://*.com/js/nview.js'
];

var response = function() {
    return { cancel: true };
}

chrome.webRequest.onBeforeRequest.addListener(response, { urls: urls }, ['blocking'] );
