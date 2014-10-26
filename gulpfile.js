var gulp = require('gulp');
var rename = require('gulp-rename');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var browserify = require('gulp-browserify');

var pkg = require('./package.json');
var banner = [
  '/**',
  ' * BehaviorTree.js',
  ' * <%= pkg.homepage %>',
  ' *',
  ' * Copyright 2013-2104, <%= pkg.author %>',
  ' * Licensed under the MIT license.',
  ' *',
  ' * Includes Dean Edward\'s Base.js, version 1.1a',
  ' * Copyright 2006-2010, Dean Edwards',
  ' * License: http://www.opensource.org/licenses/mit-license.php',
  ' *',
  ' * Version: <%= pkg.version %>',
  ' */',
  ''
].join('\n');

// Basic usage
gulp.task('scripts', function() {
  // Single entry point to browserify
  gulp.src('src/index.js')
    .pipe(browserify({
      shim: {
        Base: {
          path: './lib/base.js',
          exports: 'Base'
        }
      },
      standalone: 'BehaviorTree'
    }))
   .pipe(header(banner, { pkg: pkg }))
   .pipe(rename('btree-complete.js'))
   .pipe(gulp.dest('./'))

   .pipe(uglify())
   .pipe(header(banner, { pkg: pkg }))
   .pipe(rename('btree-complete.min.js'))
   .pipe(gulp.dest('./'));
});
