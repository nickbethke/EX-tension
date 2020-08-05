var options = {
    "hostname_show": {
        tag: EX.CHECKBOX,
        label: "Show Hostname",
        default: true
    },
    "ip_show": {
        tag: EX.CHECKBOX,
        label: "Show IP",
        default: true
    },
    "dns_show": {
        tag: EX.CHECKBOX,
        label: "Show DNS",
        default: false
    },
    "hr": {
        tag: EX.SEPARATOR
    },
    "psw_show": {
        tag: EX.CHECKBOX,
        label: "Show Password creation",
        default: false
    }
}
var option_keys = [];
for (var o in options) {
    if (options.hasOwnProperty(o)) {
        option_keys.push(o);
    }
}
const EX_ = new EX(options);

$('#options-container').append(EX_.Options);

const Overlay_ = new Overlay();

chrome.storage.sync.get(option_keys, function (items) {
    for (var item in items) {
        if (options.hasOwnProperty(item)) {
            switch (options[item].tag) {
                case EX.CHECKBOX:
                    if (items[item]) {
                        console.log($('[name=' + item + ']'));
                        $('[name=' + item + ']').attr('checked', 'checked');
                    } else {
                        $('[name=' + item + ']').removeAttr('checked');
                    }
                    break;
                case EX.INPUT:
                    if (items[item]) {
                        console.log($('[name=' + item + ']'));
                        $('[name=' + item + ']').val(items[item]);
                    }
                    break;
            }
        }
    }
})

function restoreDefault(_callback) {
    var values = {};
    for (var o in options) {
        if (options.hasOwnProperty(o)) {
            values[o] = options[o].default;
            switch (options[o].tag) {
                case EX.CHECKBOX:
                    if (options[o].default) {
                        $('[name=' + o + ']').attr('checked', 'checked');
                    }else{
                        $('[name=' + o + ']').removeAttr('checked');
                    }
                    break;
                case EX.INPUT:
                    if (options[o].default) {
                        $('[name=' + o + ']').val(options[o].default);
                    }
                    break;
            }
        }
    }
    chrome.storage.sync.set(values, function () {
        typeof _callback === 'function' ? _callback() : "";
    });
}
$('#restoreDefault').click(() => {
    restoreDefault(function () {
        Overlay_.content('<span>Default restored!</span>');
        Overlay_.head('<div class="lead">Message</div>');
        Overlay_.show();
    })
})
$('#save').click(function () {
    var values = {};
    for (var o in options) {
        if (options.hasOwnProperty(o)) {
            if (options[o].tag != EX.SEPARATOR) {
                switch (options[o].tag) {
                    case EX.CHECKBOX:
                        var val = $('[name=' + o + ']').prop('checked');
                        break;
                    case EX.INPUT:
                        var val = $('[name=' + o + ']').val();
                        break;
                }
                values[o] = val;
            }

        }
    }
    console.log(values);
    chrome.storage.sync.set(values, function () {
        Overlay_.content('<span>Options saved!</span>');
        Overlay_.head('<div class="lead">Message</div>');
        Overlay_.show();
    });

});