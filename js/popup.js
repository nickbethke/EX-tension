jQuery(function ($) {
    "use Strict";
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        var options = [];
        chrome.storage.sync.get(null, function (items) {
            options = items;
            let url = tabs[0].url;
            var u = new URL(url);
            var hn = u.hostname;
            getInfo(hn, function (r) {
                $('.loading-info').remove();
                r = JSON.parse(r)
                if (options.hostname_show) {
                    $('#server #hostname').val(r.host);
                } else {
                    $('#server #host-group').hide();
                }
                if (options.ip_show) {
                    $('#server #ip').val(r.ip);
                } else {
                    $('#server #ip-group').hide();
                }
                if (options.dns_show) {
                    $('#dns #dns-group').html("");

                    html = "";
                    r.dns.forEach(function (e) {
                        html += "<div class='dns-point'>";
                        for (var p in e) {
                            html += "<div><b>" + p + "</b>: " + e[p] + "</div>";
                        }

                        html += "</div>";
                    })
                    $('#dns #dns-group').html(html);
                } else {
                    $('#dns #dns-group').hide();
                    $('#dns-tab').hide();
                }
            });
            if (options.psw_show) {
                $('#password').keyup(function () {
                    var password = $(this).val();
                    getPassword(password, function (r) {
                        r = JSON.parse(r)
                        if (!r.error) {
                            console.log(r);
                            $('.password-container').remove();
                            var cont = $('<div class="password-container">');
                            cont.append('<hr/>');
                            cont.append('<div class="form-group"><label>Crypt</label> <input class="form-control form-control-sm" value="' + r.crypt + '"/></div>');
                            cont.append('<div class="form-group"><label>Password Hash</label> <input class="form-control form-control-sm" value="' + r.password_hash + '"/></div>');
                            $('#passwordContent').append(cont);
                        }
                    })
                })
            } else {
                $('#password-tab').hide();
                $('#password-content').hide();
            }
            getServerInfo(url, function (r) {
                r = JSON.parse(r);
                for (var prop in r) {
                    if (r[prop].Server || r[prop].server) {
                        var server = r[prop].Server ? r[prop].Server : r[prop].server;
                    }
                    if (server.includes('Apache')) {
                        $('#serverinfos').append(serverInfo('Apache.svg', "Apache"));
                    }
                    else if (server.includes('nginx')) {
                        $('#serverinfos').append(serverInfo('nginx.svg', "nginx"));
                    }
                    else if (server.includes('gws')) {
                        $('#serverinfos').append(serverInfo('google.png', "Google Web Server"));
                    }
                    else if (server.includes('YouTube Frontend Proxy')) {
                        $('#serverinfos').append(serverInfo('youtube.png', "YouTube Frontend Proxy"));
                    }
                    else if (server.includes('Microsoft')) {
                        $('#serverinfos').append(serverInfo('microsoft.svg', server));
                    }
                    else if (server.includes('cloudflare')) {
                        $('#serverinfos').append(serverInfo('cloudflare.svg', "Cloudflare"));
                    }
                    else if (server.includes('Debian')) {
                        $('#serverinfos').append(serverInfo('debian.svg', "Debian"));
                    } else if (server.includes('AppleHttpServer')) {
                        $('#serverinfos').append(serverInfo('AppleServer.svg', "Apple HTTP Server"));
                    } else {
                        $('#serverinfos').append("<div class='package'><p>" + server + "</p></div>");
                    }
                    if (r[prop]['X-Powered-By'] || r[prop]['x-powered-by']) {
                        $('#serverinfos').append("<b>Powered By</b>");
                        var powered = r[prop]['X-Powered-By'] ? r[prop]['X-Powered-By'] : r[prop]['x-powered-by'];
                        if (powered.includes('Phusion Passenger')) {
                            $('#serverinfos').append(serverInfo("Phusion\ Passenger.png", 'Phusion Passenger'));
                        } else if (powered.includes('PHP') || powered.includes('php')) {
                            $('#serverinfos').append(serverInfo("PHP.svg", powered));
                        } else {
                            $('#serverinfos').append("<div class='package'><p>" + powered + "</p></div>");
                        }

                    }
                }

            })

        });
    });
});
function serverInfo(img, text) {
    return "<div class='package'><img src='../images/packages/" + img + "'/><p>" + text + "<p></div>";
}
$('#optionspage').click(function () {
    window.open(chrome.extension.getURL('content/options.html'));
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    $('body').html('');
});
function getServerInfo(hostname, _callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            typeof _callback === "function" ? _callback(this.responseText) : "";
        }
    };
    xhttp.open("GET", "https://nick.s911.hqgmbh.eu/server.php?s=" + hostname, true);
    xhttp.send();
}
function getInfo(hostname, _callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            typeof _callback === "function" ? _callback(this.responseText) : "";
        }
    };
    xhttp.open("GET", "https://nick.s911.hqgmbh.eu/ping.php?h=" + hostname, true);
    xhttp.send();
}
function getPassword(password, _callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            typeof _callback === "function" ? _callback(this.responseText) : "";
        }
    };
    xhttp.open("GET", "https://nick.s911.hqgmbh.eu/password.php?p=" + password, true);
    xhttp.send();
}
