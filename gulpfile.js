'use strict';

const gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    webpack = require('webpack-stream'),
    merge = require('merge2'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel');


const project = tsc.createProject('./tsconfig.json', {
    declaration: true
});
gulp.task('typescript', () => {
    let result = project.src()
    .pipe(tsc(project))
    
    let js = result.js
    .pipe(babel({
        presets: ['es2015']
        }))
    .pipe(gulp.dest('./'));
    
    let dts = result.dts.pipe(gulp.dest('./declarations'));
    
    return merge([js,dts]);
    
});

gulp.task('uglify', ['bundle'], () => {
    return gulp.src('./dist/orange.js')
    .pipe(uglify())
    .pipe(rename('orange.min.js'))
    .pipe(gulp.dest('dist'));
})

gulp.task('default', ['bundle', 'uglify']);

gulp.task('bundle', ['typescript'], () => {
    
    return gulp.src('./index.js')
    .pipe(webpack({
        
        output: {
            libraryTarget: 'umd',
            library: ['orange'],
            filename: 'orange.js'
        },
       
        module: {
            loaders: [
                {test: /\.js$/, loader: 'babel-loader', exclude: /(node_modules|bower_components)/, query: { presets: ['es2015']}}
            ]
        }
    }))
    .pipe(gulp.dest('dist'))
    
});

gulp.task('watch', () => {
    return gulp.watch('./src/**/*.ts', ['bundle']);
});