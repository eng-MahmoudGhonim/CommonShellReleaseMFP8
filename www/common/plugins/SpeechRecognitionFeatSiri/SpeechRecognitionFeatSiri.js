var SpeechRecognitionFeatSiri = {
  recordButtonTapped: function(limitationSec, locale, onSuccess, onFail) {
    if(arguments.callee.length == arguments.length) {
        limitationSec = limitationSec == null? "0" : limitationSec;
        locale = locale == null? "no_locale" : locale;
        cordova.exec(onSuccess, onFail, 'SpeechRecognitionFeatSiri', 'recordButtonTapped', [limitationSec, locale]);
    }else{
        alert('[cordova-plugin-speech-recognition-feat-siri] wrong number of arguments (' +
              arguments.length + ' for ' +
              arguments.callee.length + ')');
    }
  }
};
