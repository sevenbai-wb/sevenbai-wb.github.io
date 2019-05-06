+
(function (factory) {
  if (typeof exports === 'undefined') {
    factory(webduino || {});
  } else {
    module.exports = factory;
  }
}(function (scope) {
  'use strict';
  // let self = this;
  let proto;
  let Module = scope.Module;
  const HOST_URL = "https://imageml2.webduino.io";
  let mobilenet;
  let secondmodel;
  let vid = 0;
  let status;
  let labels = [];
  let currentClass = -1;
  let currentConfidence = 0;
  let modelInfo = {};

  function loadJS(filePath) {
    var req = new XMLHttpRequest();
    req.open("GET", filePath, false); // 'false': synchronous.
    req.send(null);
    var headElement = document.getElementsByTagName("head")[0];
    var newScriptElement = document.createElement("script");
    newScriptElement.type = "text/javascript";
    newScriptElement.text = req.responseText;
    headElement.appendChild(newScriptElement);
  }

  async function start(modelName) {
    console.log("tfjs 0.13.4");
    loadJS('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@0.13.4');
    // load models
    try {
      const _mobilenet = await tf.loadModel(HOST_URL + '/mobilenet/v1_0.25_224/model.json');
      const layer = _mobilenet.getLayer('conv_pw_13_relu');
      mobilenet = tf.model({ inputs: _mobilenet.inputs, outputs: layer.output });
      let modelUrl;
      let modelUserId = -1;
      let userId = parseInt(hasher.idCode);
      if (modelName.indexOf('https://') === 0) {
        // modelName is full url
        modelUrl = modelName;
        let tmpStr = modelName.slice(modelName.indexOf('/ml_models/') + 11);
        tmpStr = tmpStr.slice(0, tmpStr.indexOf('/'));
        modelUserId = parseInt(tmpStr.slice(0, 8));
        modelName = tmpStr.slice(8);
      } else if (modelName.indexOf('/') === 0) {
        // modelName is short url
        modelUrl = HOST_URL + '/ml_models' + modelName + '/model.json';
        modelUserId = parseInt(modelName.slice(1, 9));
        modelName = modelName.slice(9);
      } else {
        // modelName is just name, combine full url by userId
        modelUrl = HOST_URL + '/ml_models/' + ('00000000' + userId).slice(-8) + modelName + '/model.json';
        modelUserId = userId;
      }

      // get model info
      var req = new XMLHttpRequest();
      req.addEventListener("load", function() {
        let modelsInfo = JSON.parse(this.responseText);
        for (let i = 0; i < modelsInfo.length; i++) {
          if (modelsInfo[i].owner === modelUserId && modelsInfo[i].name === modelName) {
            modelInfo = modelsInfo[i];
            break;
          }
        }
      });
      req.open("GET", HOST_URL + '/mlapi/models?hashkey=' + '482a3e7b4e248f5d8d359ed676b95d64' /*hasher.getAPIHash()*/);
      req.send();

      // load model
      secondmodel = await tf.loadModel(modelUrl);
    } catch (e) {
      alert('Load model error!');
    }

    vid = document.createElement('video');
    vid.width = 224;
    vid.height = 224;
    vid.autoplay = true;
    document.body.appendChild(vid);
    // start webcam
    try {
      navigator.mediaDevices.getUserMedia({
          video: {
            width: 224,
            height: 224,
            facingMode: "user"
          }
        })
        .then(stream => {
          vid.srcObject = stream;
          vid.play();
        });
    } catch (e) {
      alert('WebCam is not available!');
    }

    // create status message
    status = document.createElement('div');
    status.id = 'status';
    document.body.appendChild(status);

    await proto.startDetect();
  }

  function imageml(modelName) {
    setTimeout(async () => {
      await start(modelName);
    }, 1);
  }

  imageml.prototype = proto =
    Object.create(Module.prototype, {
      constructor: {
        value: imageml
      }
    });

  proto.onLabel = function (idx, callback) {
    labels[idx] = callback;
  }

  proto.getClass = function () {
    return currentClass;
  }
  proto.getConfidence = function () {
    return parseInt(currentConfidence * 1000000) / 10000.0;
  }
  proto.getClassName = function () {
    return (modelInfo.classes && currentClass >= 0) ? modelInfo.classes[currentClass].name : '';
  }

  proto.startDetect = async function () {
    if (vid != 0) {
      const resultTensor = tf.tidy(() => {
        const webcamImage = tf.fromPixels(vid);
        const batchedImage = webcamImage.expandDims(0);
        const img = batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
        const activation = mobilenet.predict(img).flatten().expandDims(0);
        const predictions = secondmodel.predict(activation);
        return predictions.as1D();
      });
      let classTensor = resultTensor.argMax();
      let confidenceTensor = resultTensor.max();
      currentClass = (await classTensor.data())[0];
      currentConfidence = (await confidenceTensor.data())[0];
      classTensor.dispose();
      confidenceTensor.dispose();
      resultTensor.dispose();
      status.innerHTML = "辨識類別編號為：" + currentClass + 
      "<br>類別名稱為：" + (modelInfo.classes ? modelInfo.classes[currentClass].name : "") +
      "<br>信心水準：" + parseInt(currentConfidence * 1000000) / 10000.0 + " %";
      if (typeof labels[currentClass] === "function") {
        labels[currentClass](currentClass);
      }
    }
    setTimeout(async () => { await proto.startDetect() }, 100);
  }

  scope.module.imageml = imageml;
}));