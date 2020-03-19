/**
 * 
 * @param {Number} number number to shorten
 */
function shortNumber(number){
    if(number < 1000)return number.toString();
    if(number > 1000000){
        return number / 1000000 + "m";
    }
    return number / 1000 + "k";
}

function padWithZeroes(number, length) {

    var my_string = '' + number;
    while (my_string.length < length) {
        my_string = '0' + my_string;
    }

    return my_string;

}

function insertAt(a, b, position) {
    return a.substring(0, position) + b + a.substring(position);
}

const assistant_icon = "Please wait";

module.exports = {
    shortNumber,
    assistant_icon,
    padWithZeroes,
    insertAt
}
