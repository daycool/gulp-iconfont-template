# gulp-iconfont-template
> Generate (S)Html file for icon font created with [Gulp](http://gulpjs.com/)

## Warning

Recent versions of [gulp-iconfont](https://github.com/nfroidure/gulp-iconfont) emit a `glyphs` (or `codepoints` < 4.0.0) event (see [docs](https://github.com/nfroidure/gulp-iconfont/)) which should likely be used instead of the workflow described below. However, it will continue to work as expected.
The future of this plugin will be discussed in https://github.com/backflip/gulp-iconfont-css/issues/9.

## Usage

First, install `gulp-iconfont` 、 `gulp-iconfont-css` 、`gulp-iconfont-template` as development dependencies:

```shell
npm install --save-dev gulp-iconfont gulp-iconfont-css gulp-iconfont-template
```

Then, add it to your `gulpfile.js`. **Important**: `gulp-iconfont-template` has to be inserted *before* piping the files through `gulp-iconfont-css`.

```javascript
var iconfont = require('gulp-iconfont');
var iconfontCss = require('gulp-iconfont-css');
var iconfontTemplate = require('gulp-iconfont-template');

var fontName = 'Icons';

gulp.task('iconfont', function(){
  gulp.src(['app/assets/icons/*.svg'])
    .pipe(iconfontHtml({
      fontName: fontName,
      path: 'assets/templates/template.html',
      targetPath: 'template.html',
    }))
    .pipe(iconfontCss({
      fontName: fontName,
      path: 'app/assets/css/templates/_icons.scss',
      targetPath: '../../css/_icons.scss',
      fontPath: '../../fonts/icons/'
    }))
    .pipe(iconfont({
      fontName: fontName
     }))
    .pipe(gulp.dest('app/assets/fonts/icons/'));
});
```

## API

### iconfontTemplate(options)

#### options.fontName
Type: `String`

The name of the generated font family (required). **Important**: Has to be identical to iconfont's ```fontName``` option.

#### options.path
Type: `String`

The template path (optional, defaults to `html` template provided with plugin).

#### options.targetPath
Type: `String`

The path where the (S)html file should be saved, relative to the path used in ```gulp.dest()``` 

#### options.fontPath
Type: `String`

Directory of font files relative to generated (S)html file (optional, defaults to ```./```).

#### options.cssClass
Type: `String`

Name of the generated CSS class/placeholder. Default is `icon`.

#### options.engine
Type: `String`

The template engine to use (optional, defaults to ```lodash```). 
See https://github.com/visionmedia/consolidate.js/ for available engines. The engine has to be installed before using.
