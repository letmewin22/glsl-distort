const {src, dest} = require('gulp')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')

const config = require('../config')

function images() {
  return src(config.src.img)
    .pipe(
      webp({
        quality: 92,
      }),
    )
    .pipe(dest(config.build.img))
    .pipe(src(config.src.img))
    .pipe(
      imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.mozjpeg({quality: 92, progressive: true}),
        imagemin.optipng({optimizationLevel: 3}),
        imagemin.svgo({
          plugins: [{removeViewBox: false}, {cleanupIDs: false}],
        }),
      ]),
    )
    .pipe(dest(config.build.img))
}

module.exports = images
