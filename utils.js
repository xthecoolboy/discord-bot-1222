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

function insertAt(a, b, position) {
    return a.substring(0, position) + b + a.substring(position);
}

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

module.exports = {
    shortNumber,
    insertAt,
    suffix,
    timestampToDate,
    compareArr,
    Number,
    String,
    withCommas
};
