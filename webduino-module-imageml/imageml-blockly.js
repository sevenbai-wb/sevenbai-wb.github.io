+(function (window, webduino) {

  'use strict';

  window.getVideoClassifier = function (modelName, camSource, userId) {
    return new webduino.module.imageml(modelName, camSource, userId);
  };

}(window, window.webduino));