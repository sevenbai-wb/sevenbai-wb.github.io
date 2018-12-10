+(function (window, webduino) {

  'use strict';

  window.getVideoClassifier = function (modelName, camSource) {
    return new webduino.module.imageml(modelName, camSource);
  };

}(window, window.webduino));