var gulp = require("gulp");
var jsonmerge = require("gulp-merge-json");
var debug = require("gulp-debug");

gulp.task("default", function () {
    return gulp.src(["./src/pages/**/*-lang.json",
        "../mygolf-app/src/pages/**/*-lang.json"])
        .pipe(debug())
        .pipe(jsonmerge("app.lang.js",false, false, false, 'var myGolfLang' ))
        .pipe(gulp.dest("./www/"));
});
