var gulp = require("gulp");
var babel = require("gulp-babel");
var concat = require("gulp-concat");
var sourcemaps = require("gulp-sourcemaps");
var connect = require("gulp-connect");
var open = require("gulp-open");

gulp.task("html", function () {
  return gulp.src(["client/src/html.js", "client/src/**/*.html"])
    .pipe(gulp.dest("client/dist"));
});

gulp.task("babel", function () {
    return gulp.src("client/src/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(babel({
			presets: ['es2015']
		}))
    .pipe(concat("bundle.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("client/dist"));
});

gulp.task('connect', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('open', ['html', 'babel', 'connect'], function () {
  gulp.src('client/dist/index.html')
    .pipe(connect.reload());
});

gulp.task('default', ['open']);