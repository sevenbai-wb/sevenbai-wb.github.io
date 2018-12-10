//https: //blockly-demo.appspot.com/static/demos/blockfactory_old/index.html#ckpupe
Blockly.Blocks['imageml_classifier'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(Blockly.Msg.WEBDUINO_IMAGEML_CAMERA_SRC)
      .appendField(new Blockly.FieldTextInput(Blockly.Msg.WEBDUINO_IMAGEML_CAMERA_LOCAL), "camSource")
      .appendField(Blockly.Msg.WEBDUINO_IMAGEML_MODEL_NAME)
      .appendField(new Blockly.FieldTextInput(""), "modelName");
    this.setOutput(true, null);
    this.setColour(230);
    this.setTooltip('https://mldemo.webduino.io');
    this.setHelpUrl('');
  }
};

Blockly.Blocks['imageml_label'] = {
  init: function () {
    this.appendDummyInput()
      .appendField(new Blockly.FieldVariable("imageClassifier"), "name")
      .appendField(Blockly.Msg.WEBDUINO_IMAGEML_CLASSIFY)
      .appendField(new Blockly.FieldTextInput("0"), "idx")
      .appendField(Blockly.Msg.WEBDUINO_IMAGEML_CLASSIFY2);
    this.appendStatementInput("name")
      .setCheck(null)
      .appendField(Blockly.Msg.WEBDUINO_IMAGEML_RUN);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(75);
    this.setTooltip('https://mldemo.webduino.io');
    this.setHelpUrl('');
  }
};