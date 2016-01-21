var pluginsutils = require('rollup-pluginutils');
var msx = require('msx');
var assign = require('object-assign');

module.exports = function(options) {
  options = options || {};
  // var mithrilImport = 'import m from "mithril";';
  var ext = options.ext || 'msx';
  var filter = pluginsutils.createFilter('**/*.' + ext);

  options = assign({}, options);

  // delete plugin options, leaving msx options
  delete options.ext;

  return {
    transform: function(source, id) {
      if(!filter(id)) return null;
      //HACK: commenting out imports and exports, because msx compiler cannot handle them.
      var fixedSource = source.replace(/import.*from.*;?|export\s+(?:default|{[^}]*})?/g, '/*--*$&*--*/');
      var code = msx.transform(fixedSource, options);
      //restoring the imports and exports.
      var fixedCode = code.replace(/\/\*--\*(.*)\*--\*\//g, '$1');
      return fixedCode;
    }
  };
};
