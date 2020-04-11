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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function timestampToDate(timestamp, unix = false) {
    if(unix) timestamp *= 1000;
    const dt = new Date(timestamp);
    const day = dt.getDate();
    const month = dt.toLocaleString("en-us", { month: "short" });
    const year = dt.getFullYear().toString().substr(-2);
    return `${month} ${day}, '${year}`;
}

module.exports = {
    shortNumber,
    assistant_icon,
    padWithZeroes,
    insertAt,
    suffix,
    numberWithCommas,
    timestampToDate
};
