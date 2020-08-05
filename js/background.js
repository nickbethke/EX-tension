chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: { schemes: ['http', 'https'] },
            })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });

});
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        restoreDefault();
    }
});
var options = {
    "hostname_show": {
        default: true
    },
    "ip_show": {
        default: true
    },
    "dns_show": {
        default: false
    },
    "psw_show": {
        default: false
    }
}
function restoreDefault(_callback) {
    var values = {};
    for (var o in options) {
        if (options.hasOwnProperty(o)) {
            values[o] = options[o].default;
        }
    }
    chrome.storage.sync.set(values, function () {
        typeof _callback === 'function' ? _callback() : "";
    });
}