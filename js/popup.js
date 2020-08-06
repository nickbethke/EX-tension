jQuery(function ($) {
    "use Strict";
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        var options = [];
        chrome.storage.sync.get(null, function (items) {
            options = items;
            let url = tabs[0].url;
            var u = new URL(url);
            var hn = u.hostname;
            if (validURL(url)) {
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
                    if (r.Server || r.server) {
                        var server = r.Server ? r.Server : r.server;
                    }
                    serverContents = server.split(" ");
                    serverContents.forEach(function (e) {
                        var $s = e.split("/");
                        console.log($s);
                        if ($s.length === 2) {
                            var name = $s[0];
                            var version = $s[1];
                        } else {
                            var name = e;
                            var version = false;
                        }
                        if (name.includes('CentOS')) {
                            $('#serverinfos').append(serverInfo('centos.svg', "CentOS", version));
                        }
                        if (name.includes('Ubuntu')) {
                            $('#serverinfos').append(serverInfo('Ubuntu.svg', "Ubuntu", version));
                        }
                        if (name.includes('PHP') || name === "PHP") {
                            $('#serverinfos').append(serverInfo('PHP.svg', "PHP", version));
                        }
                        if (name.includes('Apache')) {
                            $('#serverinfos').append(serverInfo('Apache.svg', "Apache", version));
                        }
                        if (name.includes('nginx')) {
                            $('#serverinfos').append(serverInfo('nginx.svg', "nginx", version));
                        }
                        if (name.includes('Microsoft')) {
                            $('#serverinfos').append(serverInfo('microsoft.svg', server, version));
                        }
                    })


                    if (server.includes('gws')) {
                        $('#serverinfos').append(serverInfo('google.png', "Google Web Server"));
                    }
                    else if (server.includes('YouTube Frontend Proxy')) {
                        $('#serverinfos').append(serverInfo('youtube.png', "YouTube Frontend Proxy"));
                    }
                    else if (server.includes('GitHub')) {
                        $('#serverinfos').append(serverInfo('github.svg', server));
                    }
                    else if (server.includes('cloudflare')) {
                        $('#serverinfos').append(serverInfo('cloudflare.svg', "Cloudflare"));
                    }
                    else if (server.includes('Debian')) {
                        $('#serverinfos').append(serverInfo('debian.svg', "Debian"));
                    } else if (server.includes('AppleHttpServer')) {
                        $('#serverinfos').append(serverInfo('AppleServer.svg', "Apple HTTP Server"));
                    }
                    if (r['X-Powered-By'] || r['x-powered-by']) {
                        $('#serverinfos').append("<b>Powered By</b>");
                        var powered = r['X-Powered-By'] ? r['X-Powered-By'] : r['x-powered-by'];
                        if (powered.includes('Phusion Passenger')) {
                            $('#serverinfos').append(serverInfo("Phusion\ Passenger.png", 'Phusion Passenger'));
                        } else if (powered.includes('PHP') || powered.includes('php')) {
                            $('#serverinfos').append(serverInfo("PHP.svg", powered));
                        } else {
                            $('#serverinfos').append("<div class='package'><p>" + powered + "</p></div>");
                        }
                    }
                    if (r['via'] || r['Via']) {
                        var via = r['via'] ? r['via'] : r['Via'];
                        if(via.includes('varnish')){
                            $('#serverinfos').append(serverInfo("varnish.svg", 'Varnish'));
                        }
                        if(via.includes('vegur')){
                            $('#serverinfos').append(serverInfo(false, 'vegur'));
                        }
                    }
                })
            } else {
                var error = $('<div>');
                error.addClass('p-2');
                error.html('Not valid page.')
                $('.content').html(error);
            }
        });
    });
});
function serverInfo(img, text, version) {
    if(!img){
        img = "placeholder.svg";
    }
    if (version) {
        return "<div class='package'><img src='../images/packages/" + img + "'/><p>" + text + "<div class='version'>" + version + "</div><p></div>";
    } else {
        return "<div class='package'><img src='../images/packages/" + img + "'/><p>" + text + "<p></div>";
    }

}
$('#optionspage').click(function () {
    window.open(chrome.extension.getURL('content/options.html'));
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    $('body').html('');
});
function getServerInfo(hostname, _callback) {
    var geturl;
    geturl = jQuery.ajax({
        type: "GET",
        url: hostname,
        success: function () {
            var header = geturl.getAllResponseHeaders();
            var pre = $("<pre>" + header + "</pre>");
            $('#serverinfos').append(pre);
            pre.hide();
            $('#serverinfos').dblclick(function () {
                pre.toggle();
            })
            header = header.split('\n');
            h = [];
            header.forEach(function (e) {
                h[e.split(':')[0]] = e.split(':')[1];
            })
            typeof _callback === "function" ? _callback(h) : "";
        }
    });
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
function validURL(str) {
    var pattern = new RegExp('^(http(s)?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    if (str.includes('localhost')) return true;
    return !!pattern.test(str);
}