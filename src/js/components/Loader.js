import imagesLoaded from 'imagesloaded'
import gsap from 'gsap'
import emitter from 'tiny-emitter/instance'

const noop = () => {}

export class Loader {
  constructor(cb, mode) {
    this.mode = mode ?? 'default' // default || webgl
    this.pli = document.querySelectorAll('[data-pli]')
    this.cb = cb ?? noop

    this.countImages = this.pli.length
    this.loadedLength = 0

    this.loader = document.querySelector('.loader')

    this.percentHTML = this.loader.querySelector('.loader__percent')

    this.num = {val: 0}
    this.state = false
  }

  init() {
    document.documentElement.style.cursor = 'wait'
    document.body.style.pointerEvents = 'none'

    if (this.pli.length > 0) {
      this.mode === 'webgl' ? this.loadWebgl() : this.loadDefault()
    } else {
      this.counter(100, 1)
    }
  }

  loadDefault() {
    this.imgLoad = imagesLoaded(document.querySelectorAll('[data-pli]'), {
      background: true,
    })

    this.imgLoad.on('progress', (_, image) => this.onProgress(image))
    this.imgLoad.on('fail', () => {
      setTimeout(() => {
        this.counter(100, 1)
      }, 650)
    })
  }

  loadWebgl() {
    const imgs = this.pli
    console.log(imgs)
    emitter.on('textureLoaded', () => {
      this.loadedLength++
      this.counter().then(() => {
        this.counter()
      })
    })
  }

  afterLoad() {
    if (!this.state) {
      this.state = true

      document.documentElement.style.cursor = 'auto'
      document.body.style.pointerEvents = 'auto'
      this.loader.style.opacity = 0

      setTimeout(() => {
        this.cb()
      }, 600)
    }
  }

  counter(c, d) {
    const count = c ?? Number(100 * (this.loadedLength / this.countImages))

    return new Promise((resolve) => {
      gsap.to(this.num, {
        duration: d ?? 0.5,
        val: count,
        ease: 'power1.out',
        onUpdate: () => {
          const result = Math.round(this.num.val) + '%'
          this.percentHTML.innerHTML = result
        },
        onComplete: () => {
          if (count !== 100) {
            resolve()
          } else {
            this.afterLoad()
          }
        },
      })
    })
  }

  onProgress(image) {
    if (image.isLoaded) {
      image.element ?
        image.element.classList.add('loaded') :
        image.img.classList.add('loaded')

      this.loadedLength = document.querySelectorAll('[data-pli].loaded').length

      this.counter().then(() => {
        this.counter()
      })
    }
  }
}
