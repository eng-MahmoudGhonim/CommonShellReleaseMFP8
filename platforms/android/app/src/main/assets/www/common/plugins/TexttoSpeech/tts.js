/*

    Cordova Text-to-Speech Plugin
    https://github.com/vilic/cordova-plugin-tts

    by VILIC VANE
    https://github.com/vilic

    MIT License

*/
var TTS = function() {
};
TTS.speak = function (text) {
    return new Promise(function (resolve, reject) {
        var options = {};

        if (typeof text == 'string') {
            options.text = text;
        } else {
            options = text;
        }

        cordova.exec(resolve, reject, 'TTS', 'speak', [options]);
    });
};

TTS.stop = function() {
    return new Promise(function (resolve, reject) {
        cordova.exec(resolve, reject, 'TTS', 'stop', []);
    });
};

TTS.checkLanguage = function() {
    return new Promise(function (resolve, reject) {
        cordova.exec(resolve, reject, 'TTS', 'checkLanguage', []);
    });
};

TTS.openInstallTts = function() {
    return new Promise(function (resolve, reject) {
        cordova.exec(resolve, reject, 'TTS', 'openInstallTts', []);
    });
};
