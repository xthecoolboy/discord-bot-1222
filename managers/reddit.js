"use strict";

const got = require("got");

function formatResult(getRandomImage) {
    const imageData = getRandomImage();
    if(!imageData) {
        return;
    }
    var obj = imageData;
    obj.url = `http://imgur.com/${imageData.hash}${imageData.ext.replace(/\?.*/, "")}`;
    return obj;
}

function storeResults(images, subreddit) {
    images.sort(function(a, b) { return a.score - b.score; });
    images = images.slice(0, 40);

    return images[Math.random() * images.length];
}

function randomPuppy(subreddit) {
    subreddit = (typeof subreddit === "string" && subreddit.length !== 0) ? subreddit : "puppies";

    return got(`https://imgur.com/r/${subreddit}/hot.json`)
        .then(response => storeResults(JSON.parse(response.body).data, subreddit))
        .then(getRandomImage => formatResult(getRandomImage));
}

function callback(subreddit, cb) {
    randomPuppy(subreddit)
        .then(url => cb(null, url))
        .catch(err => cb(err));
}

// subreddit is optional
// callback support is provided for a training exercise
module.exports = (subreddit, cb) => {
    if(typeof cb === "function") {
        callback(subreddit, cb);
    } else if(typeof subreddit === "function") {
        callback(null, subreddit);
    } else {
        return randomPuppy(subreddit);
    }
};
