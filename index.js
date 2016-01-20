var pluginsutils = require('rollup-pluginutils');
var msx = require('msx');

module.exports = function(opts) {
  console.log('created msx transform');
  var mithrilImport = 'import m from "mithril";';
  var filter = pluginsutils.createFilter('**/*.msx');
  var options = opts || undefined;

  return {
    transform: function(source, id) {
      if(!filter(id)) return null;
      //HACK: commenting out imports and exports, because msx compiler cannot handle them. this needs testing
      var fixedSource = source.replace(/import.*from.*;?|export\s+(?:default|{[^}]*})?/g, '/*--*$&*--*/');
      var code = msx.transform(fixedSource, options);
      //restoring the imports and exports.
      var fixedCode = code.replace(/\/\*--\*(.*)\*--\*\//g, '$1');
      return fixedCode;
    }
  }
};
