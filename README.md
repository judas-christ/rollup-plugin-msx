# Rollup Plugin for MSX
> Mithril MSX transform plugin for Rollup.js

## Installation

```bash
npm install rollup-plugin-msx --save-dev
```

## Usage

Edit your `rollup.config.js` file to include the MSX plugin:

```js
import msx from 'rollup-plugin-msx';

export default {
  entry: 'src/main.js',
  format: 'cjs',
  plugins: [msx()],
  dest: 'bundle.js'
};
```
