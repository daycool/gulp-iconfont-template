'use strict';

var path = require('path'),
	gutil = require('gulp-util'),
	consolidate = require('consolidate'),
	_ = require('lodash'),
	Stream = require('stream');

var PLUGIN_NAME  = 'gulp-iconfont-template';

function iconfontTemplate(config) {
	var glyphMap = [],
		currentGlyph,
		currentCodePoint,
		inputFilePrefix,
		stream,
		outputFile,
		engine,
		cssClass;

	// Set default values
	config = _.merge({
		path: 'html',
		targetPath: 'template.html',
		fontPath: './',
		engine: 'lodash',
	    firstGlyph: 0xE001,
		cssClass: 'icon'
	}, config);

	// Enable default html generators
	if(!config.path) {
		config.path = 'html';
	}
	if(/^(html)$/i.test(config.path)) {
		config.path = __dirname + '/templates/template.' + config.path;
	}

	try {
		engine = require(config.engine);
	} catch(e) {
		throw new gutil.PluginError(PLUGIN_NAME, 'Template engine "' + config.engine + '" not present');
	}

	// Define starting point
	currentGlyph = config.firstGlyph;

	// Happy streaming
	stream = Stream.PassThrough({
		objectMode: true
	});

	stream._transform = function(file, unused, cb) {
		var fileName;

		if (file.isNull()) {
			this.push(file);
			return cb();
		}

		// Create output file
		if (!outputFile) {
			outputFile = new gutil.File({
				base: file.base,
				cwd: file.cwd,
				path: path.join(file.base, config.targetPath),
				contents: file.isBuffer() ? new Buffer(0) : new Stream.PassThrough()
			});
		}

		currentCodePoint = (currentGlyph++).toString(16).toUpperCase();

		fileName = path.basename(file.path, '.svg');
		glyphMap.push({
			fileName: fileName,
			codePoint: currentCodePoint
		});

		file.path = path.dirname(file.path) + '/' + path.basename(file.path);

		this.push(file);

		cb();
	};

	stream._flush = function(cb) {
		var content;
		if (glyphMap.length) {
			consolidate[config.engine](config.path, {
					glyphs: glyphMap,
					fontName: config.fontName,
					fontPath: config.fontPath,
					cssClass: config.cssClass
				}, function(err, html) {
					if (err) {
						throw new gutil.PluginError(PLUGIN_NAME, 'Error in template: ' + err.message);
					}

					content = Buffer(html);

					if (outputFile.isBuffer()) {
						outputFile.contents = content;
					} else {
						outputFile.contents.write(content);
						outputFile.contents.end();
					}

					stream.push(outputFile);

					cb();
			});
		} else {
			cb();
		}
	};

	return stream;
};

module.exports = iconfontTemplate;
