Blockly.JavaScript['imageml_nuwa_classifier'] = function (block) {
  var text_modelname = block.getFieldValue('modelName');
  var code = 'getVideoClassifier("' + text_modelname + '")';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['imageml_nuwa_callback'] = function (block) {
  var idx = block.getFieldValue('idx');
  var variable_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name'), Blockly.Variables.NAME_TYPE);
  var statements_name = Blockly.JavaScript.statementToCode(block, 'name');
  var code = variable_name + '.onLabel(' + idx + ', async function(idx){\n';
  code += statements_name + '\n';
  code += '});\n';
  return code;
};

Blockly.JavaScript['imageml_nuwa_levelVal'] = function (block) {
  var variable_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name'), Blockly.Variables.NAME_TYPE);
  var code = variable_name + '.getClass()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['imageml_nuwa_confidenceVal'] = function (block) {
  var variable_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name'), Blockly.Variables.NAME_TYPE);
  var code = variable_name + '.getConfidence()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};

Blockly.JavaScript['imageml_nuwa_classNameVal'] = function (block) {
  var variable_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('name'), Blockly.Variables.NAME_TYPE);
  var code = variable_name + '.getClassName()';
  return [code, Blockly.JavaScript.ORDER_NONE];
};