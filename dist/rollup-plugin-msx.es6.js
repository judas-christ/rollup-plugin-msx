import { createFilter } from 'rollup-pluginutils';
import msx from 'msx';
import assign from 'object-assign';

function plugin(options) {
  options = options || {};
  // var mithrilImport = 'import m from "mithril";';
  var ext = options.ext || 'msx';
  var filter = createFilter('**/*.' + ext);

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
}

export default plugin;