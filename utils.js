/* eslint-disable camelcase */
/**
 *
 * @param {Number} number number to shorten
 */
function shortNumber(number) {
    if(number < 1000) return number.toString();
    if(number > 1000000) {
        return number / 1000000 + "m";
    }
    return number / 1000 + "k";
}

function padWithZeroes(number, length) {
    var my_string = "" + number;
    while(my_string.length < length) {
        my_string = "0" + my_string;
    }

    return my_string;
}

function insertAt(a, b, position) {
    return a.substring(0, position) + b + a.substring(position);
}

const assistant_icon = "Please wait";

function suffix(i) {
    var j = i % 10;
    var k = i % 100;
    if(j === 1 && k !== 11) {
        return i + "st";
    }
    if(j === 2 && k !== 12) {
        return i + "nd";
    }
    if(j === 3 && k !== 13) {
        return i + "rd";
    }
    return i + "th";
}

// eslint-disable-next-line no-extend-native
Number.prototype.withCommas = function() {
    return this.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

// eslint-disable-next-line no-extend-native
String.prototype.withCommas = function() {
    return this.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

function withCommas() {
    return this.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function timestampToDate(timestamp, unix = false) {
    if(unix) timestamp *= 1000;
    const dt = new Date(timestamp);
    const day = dt.getDate();
    const month = dt.toLocaleString("en-us", { month: "short" });
    const year = dt.getFullYear().toString().substr(-2);
    return `${month} ${day}, '${year}`;
}

function compareArr(arr1, arr2) {
    if(!arr1 || !arr2) return false;
    if(arr1.length !== arr2.length) return false;
    for(var i = 0, l = arr1.length; i < l; i++) {
        // Check if we have nested arrays
        if(arr1[i] instanceof Array && arr2[i] instanceof Array) {
            // recurse into the nested arrays
            if(!arr1[i].equals(arr2[i])) return false;
        } else if(arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}

function formatDate(date, format, utc) {
    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while(s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H === 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if(!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};

module.exports = {
    shortNumber,
    assistant_icon,
    padWithZeroes,
    insertAt,
    suffix,
    timestampToDate,
    compareArr,
    Number,
    String,
    withCommas,
    formatDate
};
