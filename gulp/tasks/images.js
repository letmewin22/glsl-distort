const config = require('../config')

const {src, dest} = require('gulp')
const webp = require('gulp-webp')
const gulpif = require('gulp-if')

function images(bs) {
  return src(config.src.img)
    .pipe(
      gulpif(
        config.production,
        webp({
          quality: 70,
        }),
      ),
    )
    .pipe(dest(config.build.img))
    .pipe(gulpif(!config.production, bs.stream()))
}

module.exports = images
