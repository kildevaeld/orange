'use strict';

const gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    webpack = require('webpack-stream'),
    merge = require('merge2');


const project = tsc.createProject('./tsconfig.json', {
    declaration: false
});
gulp.task('typescript', () => {
    let result = project.src()
    .pipe(tsc(project))
    
    let js = result.js
    .pipe(gulp.dest('./'));
    
    let dts = result.dts.pipe(gulp.dest('./declarations'));
    
    return merge([js,dts]);
    
})    

gulp.task('default', ['typescript'], () => {
    
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
    return gulp.watch('./src/**/*.ts', ['default']);
});