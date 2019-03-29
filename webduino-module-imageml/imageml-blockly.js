+(function (window, webduino) {
  'use strict';

  window.getVideoClassifier = function (modelName, camSource, rotateCam, userId) {
    return new webduino.module.imageml(modelName, camSource, rotateCam, userId);
  };

}(window, window.webduino));