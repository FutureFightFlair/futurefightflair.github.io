flair.current_choice = 0;
flair.sheet_filter = null;
flair.sheet_filter_change = false;
flair.typing_timeout = null;

flair.subreddits = ['future_fight'];

flair.updateCharacterFilter = function (sheet_name) {
    if (sheet_name == 'ALL') {
        flair.sheet_filter = null;
    } else {
        flair.sheet_filter = sheet_name;
    }

    flair.sheet_filter_change = true;
    flair.updateFilter();
}

flair.updateFilter = function (text) {
    text = text || document.getElementById('flair-filter-text').value;

    var is_int = text >>> 0 === parseFloat(text);
    if (is_int) {
        text = text.toString();
    }

    text = text.toLowerCase();

    for (var hero_id in flair.by_id) {
        if (flair.by_id.hasOwnProperty(hero_id)) {
            var hero_name = flair.by_id[hero_id].hero_name.toLowerCase();
            var sheet = flair.by_id[hero_id].sheet;

            var el = document.querySelector('.flair-choice[data-id="' + hero_id + '"]');
            if (el == null)
                continue;

            if (
                // check hero_name
                (text.length == 0 || text == hero_name || (hero_name.indexOf(text) !== -1 && isNaN(text)) ||
                    // check hero_id
                    text === hero_id || text === flair.by_id[hero_id].orig_id) &&
                // check sheet
                (flair.sheet_filter === null || flair.sheet_filter === sheet)
            ) {
                n.show(el);
            } else {
                n.hide(el);
            }
        }
    }

    var fn_hashUpdate = function () {
        var hash = "#";

        if (text.length != 0) {
            hash += "q=" + encodeURIComponent(text);
        }

        if (flair.sheet_filter != null) {
            if (hash.length != 1) {
                hash += "&";
            }

            hash += "r=" + encodeURIComponent(flair.sheet_filter);
        }

        history.replaceState(undefined, undefined, hash);
    };

    // sheet filter change should be an immediate hash change
    // for the text filter, we should wait for the user to be done typing
    if (flair.sheet_filter_change) {
        flair.sheet_filter_change = false;
        fn_hashUpdate();
    } else {
        if (flair.typing_timeout) {
            clearTimeout(flair.typing_timeout);
        }

        flair.typing_timeout = setTimeout(fn_hashUpdate, 600);
    }

}


flair.selectChoice = function (hero_id, key) {
    var el = document.querySelector('.flair-choice[data-id="' + hero_id + '"]');

    console.log(el)

    if (!el) {
        return;
    }

    // If trainerflair disable subreddit selection checkbox
    var sr_choices = document.getElementsByClassName("sr-choice");
    if (el.getAttribute('class').indexOf("trainerflair") >= 0) {
        for (var i = 1; i < sr_choices.length; i++) {
            var input_el = sr_choices[i].firstChild;

            // If checkbox was selected save status
            if (input_el.checked) {
                input_el.waschecked = true;
            }

            input_el.checked = false;
            input_el.disabled = true;
        }
    } else {
        for (var i = 1; i < sr_choices.length; i++) {
            var input_el = sr_choices[i].firstChild;

            if (input_el.waschecked) {
                input_el.checked = true;
                input_el.waschecked = false;
            }

            input_el.disabled = false;
        }
    }

    n.removeClass(document.querySelectorAll('.flair-choice'), 'selected');
    n.addClass(el, 'selected');

    flair.current_choice = key;


    flair.by_id[hero_id].hero_attribute = flair.by_id[hero_id].hero_name.replace(/.*?(\#[^)]*\#).*?/g, "$1").replace(/#Combat#/g, "").replace(/#Blast#/g, "").replace(/#Speed#/g, "").replace(/#Universal#/g, "").replace(/#None#/g, "").replace(/#Synergy#/g, "<img src='images/icons/synergy.png' style='height:20px;' title='Synergy'></img>").replace(/#Buff#/g, "<img src='images/icons/buff.png' style='height:20px;' title='Buff'></img>").replace(/#Leader#/g, "<img src='images/icons/leadership.png' style='height:20px;' title='Leadership'></img>").replace(/#Support#/g, "<img src='images/icons/support.png' style='height:20px;' title='Team Support'></img>").replace(/#PVE5#/g, "<img src='images/icons/pve5.png' style='height:20px;' title='PVE: Mythic'></img> ").replace(/#PVE4#/g, "<img src='images/icons/pve4.png' style='height:20px;' title='PVE: Legendary'></img> ").replace(/#PVE3#/g, "<img src='images/icons/pve3.png' style='height:20px;' title='PVE: Heroic'></img> ").replace(/#PVE2#/g, "<img src='images/icons/pve2.png' style='height:20px;' title='PVE: Rare'></img> ").replace(/#PVE1#/g, "<img src='images/icons/pve1.png' style='height:20px;' title='PVE: Advanced'></img> ").replace(/#PVP5#/g, "<img src='images/icons/pvp5.png' style='height:20px;' title='PVP: Mythic'></img> ").replace(/#PVP4#/g, "<img src='images/icons/pvp4.png' style='height:20px;' title='PVP: Legendary'></img> ").replace(/#PVP3#/g, "<img src='images/icons/pvp3.png' style='height:20px;' title='PVP: Heroic'></img> ").replace(/#PVP2#/g, "<img src='images/icons/pvp2.png' style='height:20px;' title='PVP: Rare'></img> ").replace(/#PVP1#/g, "<img src='images/icons/pvp1.png' style='height:20px;' title='PVP: Advanced'></img> ");
    flair.by_id[hero_id].hero_name1 = flair.by_id[hero_id].hero_name.replace(/ *\[[^]*\ */g, "");
    flair.by_id[hero_id].uni_name1 = flair.by_id[hero_id].hero_name.replace(/.*?(\[[^]*\]).*?/g, "$1").replace(/\[/g, '').replace(/]/g, '').replace(/ *\#[^]*\ */g, "<br>");

document.getElementById('flair-selection-infocard').setAttribute('src', "images/infocards/" + flair.by_id[hero_id].flair_class.replace(/flair-/gi, "").replace(/\ .*/,'') + ".png");
	
	
    document.getElementById('flair-selection-name').innerHTML = flair.by_id[hero_id].hero_name1;
    document.getElementById('flair-selection-uniname').innerHTML = flair.by_id[hero_id].uni_name1;
    document.getElementById('flair-selection-attribute').innerHTML = flair.by_id[hero_id].hero_attribute;


	
	
}

flair.loadChoices = function () {
    flair.load__by_id();

    var do_initial_updateFilter = false;

    if (window.location.hash) {
        var hash = window.location.hash.substring(1);

        if (hash == 'flair') {
            history.replaceState(undefined, undefined, "#");
        }

        var q = n.getParameterByName('q', "?" + hash);
        var r = n.getParameterByName('r', "?" + hash);

        if (q) {
            document.getElementById('flair-filter-text').value = q;
        }

        if (r) {
            var isAvailable = false;
            for (var i = 0; i < document.getElementById("flair-filter-sheet").length; i++) {
                if (document.getElementById("flair-filter-sheet").options[i].value == r) {
                    isAvailable = true;
                }
            }

            if (isAvailable) {
                document.getElementById('flair-filter-sheet').value = r;
                flair.sheet_filter = r;
            }
        }

        if (q || r) {
            do_initial_updateFilter = true;
        }
    }

    var enter = document.getElementById('flair-choices');
    for (var hero_id in flair.by_id) {
        if (flair.by_id.hasOwnProperty(hero_id)) {
            var data = flair.by_id[hero_id];

            var flair_choice = document.createElement('div');
            flair_choice.setAttribute('class', 'flair flair-choice ' + data.flair_class + ' ' + data.hero_name);
            flair_choice.setAttribute('data-name', data.hero_name);
            flair_choice.setAttribute('title', data.hero_name.replace(/ *\#[^)]*\# */g, "").replace(/\[.*/, '') + "- " + data.hero_name.replace(/ *\#[^)]*\# */g, "").replace(/.*?(\[[^]*\]).*?/g, "$1").replace(/\[/g, '').replace(/]/g, ''));
            flair_choice.setAttribute('data-id', data.hero_id);
            flair_choice.setAttribute('onclick', 'flair.selectChoice("' + data.hero_id + '","' + data.key + '")');

        }


    }

    var sr_enter = document.getElementById('subreddit-selection');
    for (var i = 0; i < flair.subreddits.length; i++) {
        var sr = flair.subreddits[i];

        var sr_choice = document.createElement('label');
        sr_choice.setAttribute('class', 'sr-choice');
        sr_choice.setAttribute('data-name', sr);
        sr_choice.setAttribute('for', 'sr-choice-' + sr);

        var sr_choice_input = document.createElement('input');
        sr_choice_input.setAttribute('id', 'sr-choice-' + sr);
        sr_choice_input.setAttribute('type', 'checkbox');
        sr_choice_input.setAttribute('checked', '');

        var sr_choice_span = document.createElement('span');
        sr_choice_span.textContent = sr;

        sr_choice.appendChild(sr_choice_input);
        sr_choice.appendChild(sr_choice_span);


        if (i != flair.subreddits.length - 1) {
            var sr_sep = document.createElement('span');
            sr_sep.setAttribute('class', 'sr-sep');
            sr_sep.textContent = '|';
            sr_enter.appendChild(sr_sep);
        }
    }

    if (do_initial_updateFilter) {
        flair.updateFilter();
    }
}

document.addEventListener('DOMContentLoaded', flair.loadChoices, false);

/* UTILITIES
--------------------------------------------------------------------------------*/
var n = {};

n.getParameterByName = function (name, url) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(url);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

n.addClass = function (o, className) {
    if (!o || !className || !className.length)
        return;

    o = n.isString(o) ? document.querySelectorAll(o) : o;

    function do_stuff(el) {
        if (el.classList) {
            el.classList.add(className);
        } else if (!hasClass(el, className)) {
            el.className += ' ' + className;
        }
    }

    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++)
            do_stuff(o[i]);
    } else do_stuff(o);
}

n.removeClass = function (o, className) {
    if (!o || !className || !className.length)
        return;

    o = n.isString(o) ? document.querySelectorAll(o) : o;

    function do_stuff(el) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            var regExp = new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'g');
            document.getElementById("MyElement").className = document.getElementById("MyElement").className.replace(regExp);
        }
    }

    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++)
            do_stuff(o[i]);
    } else do_stuff(o);
}

n.toggleClass = function (o, className) {
    if (!o || !className || !className.length)
        return;

    o = n.isString(o) ? document.querySelectorAll(o) : o;

    function do_stuff(el) {
        if (el.classList) {
            el.classList.toggle(className);
        } else {
            if (hasClass(el, className)) {
                removeClass(el, className);
            } else {
                el.className += ' ' + className;
            }
        }
    }

    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++)
            do_stuff(o[i]);
    } else do_stuff(o);
}

n.hasClass = function (o, className) {
    if (!o || !className || !className.length)
        return false;

    o = n.isString(o) ? document.querySelectorAll(o) : o;

    function do_stuff(el) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            var regExp = new RegExp('(?:^|\\s)' + className + '(?!\\S)', 'g');
            return document.getElementById("MyElement").className.match(regExp);
        }
    }

    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++)
            if (!do_stuff(o[i]))
                return false;
    } else return do_stuff(o);

    return true;
}


n.setClass = function (o, className, state) {
    if (!state && n.hasClass(o, className)) {
        n.removeClass(o, className);
    } else if (state && !n.hasClass(o, className)) {
        n.addClass(o, className);
    }
}

n.isNodeList = function (nodes) {
    var stringRepr = Object.prototype.toString.call(nodes);

    return typeof nodes === 'object' &&
        /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
        (typeof nodes.length === 'number') &&
        (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
}

n.startsWith = function (str, needle) {
    return str.length >= needle.length && str.substring(0, needle.length) === needle;
}

n.endsWith = function (str, needle) {
    return str.length >= needle.length && str.substring(str.length - needle.length) === needle;
}

// General purpose "contains" function
// For: strings, arrays, objects (check if property exists), nodes
n.contains = function (haystack, needle) {
    if (typeof haystack === 'string' || haystack instanceof String) {
        return haystack.indexOf(needle) > -1;
    } else if (haystack instanceof Array) {
        return n.inArray(needle, haystack);
    } else if (typeof haystack == 'object') {
        return haystack.hasOwnProperty(needle);
    } else if (n.isNode(haystack) && n.isNode(needle)) {
        return haystack.contains(needle);
    }
    return false;
}

n.isString = function (obj) {
    return typeof obj === 'string' || obj instanceof String;
}


n.hide = function (o) {
    o = n.isString(o) ? document.querySelectorAll(o) : o;

    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++) {
            o[i].style.display = 'none';
        }
    } else {
        o.style.display = 'none';
    }
}
n.show = function (o) {
    o = n.isString(o) ? document.querySelectorAll(o) : o;

    if (n.isNodeList(o)) {
        for (var i = 0, len = o.length; i < len; i++) {
            o[i].style.display = '';
        }
    } else {
        o.style.display = '';
    }
}



function filterSelection1(c) {
    var x, i;
    x = document.getElementsByClassName("flair flair-choice");
    if (c == "all") c = "";
    for (i = 0; i < x.length; i++) {
        w3RemoveClass(x[i], "type");
        if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "type");
    }
}

        filterSelection("all")
        function filterSelection(c) {
            var x, i;
            x = document.getElementsByClassName("flair flair-choice");
            if (c == "all") c = "";
            for (i = 0; i < x.length; i++) {
                w3RemoveClass(x[i], "show");
                if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
            }
        }

        filterSelection1("all")
        function filterSelection1(c) {
            var x, i;
            x = document.getElementsByClassName("flair flair-choice");
            if (c == "all") c = "";
            for (i = 0; i < x.length; i++) {
                w3RemoveClass(x[i], "type");
                if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "type");
            }
        }



function filterSelection(c) {
    var x, i;
    x = document.getElementsByClassName("flair flair-choice");
    if (c == "all") c = "";
    for (i = 0; i < x.length; i++) {
        w3AddClass(x[i], "show");
        if (x[i].className.indexOf(c) > -1) w3RemoveClass(x[i], "show");
    }
}

function w3AddClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        if (arr1.indexOf(arr2[i]) == -1) {
            element.className += " " + arr2[i];
        }
    }
}

function w3RemoveClass(element, name) {
    var i, arr1, arr2;
    arr1 = element.className.split(" ");
    arr2 = name.split(" ");
    for (i = 0; i < arr2.length; i++) {
        while (arr1.indexOf(arr2[i]) > -1) {
            arr1.splice(arr1.indexOf(arr2[i]), 1);
        }
    }
    element.className = arr1.join(" ");
}


$(function () {

    $(".dropdown-content").on('click', 'button', function () {
        $(".btn3:first-child").text($(this).text());
        $(".btn3:first-child").val($(this).text());
    });

});

$(function () {

    $(".dropdown1-content").on('click', 'button', function () {
        $(".btn4:first-child").text($(this).text());
        $(".btn4:first-child").val($(this).text());
    });

});