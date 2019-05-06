+(function (window, webduino) {
  'use strict';

  window.getVideoClassifier = function (modelName) {
    return new webduino.module.imageml(modelName);
  };

}(window, window.webduino));