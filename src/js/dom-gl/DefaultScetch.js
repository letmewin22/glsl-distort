import {Renderer, Transform} from 'ogl'
import {resize, raf} from '@emotionagency/utils'

export default class DefaultScetch {
  constructor($selector, customRaf) {
    this.$container = document.querySelector($selector)
    this.raf = customRaf ?? raf

    this.sizes = {
      w: window.innerWidth,
      h: window.innerHeight,
    }

    this.time = 0

    this._bounds()
  }

  _bounds() {
    const m = ['_animate', '_resize']
    m.forEach((fn) => {
      this[fn] = this[fn].bind(this)
    })
  }

  _init() {
    this.scene = new Transform()

    this.renderer = new Renderer({
      dpr: 2,
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
    })

    this._setupCamera()
    this.renderer.setSize(this.sizes.w, this.sizes.h)
    this.$container.appendChild(this.renderer.gl.canvas)

    this.raf.on(this._animate)
    resize.on(this._resize)
  }

  _setupCamera() {}

  _resize() {
    this.sizes = {...this.sizes, w: window.innerWidth, h: window.innerHeight}

    this._setupCamera()

    this.camera.updateMatrixWorld()

    this.camera.perspective({
      aspect: this.sizes.w / this.sizes.h,
    })

    this.renderer.setSize(this.sizes.w, this.sizes.h)
  }

  _animate() {
    this.time++
    this.renderer.render({scene: this.scene, camera: this.camera})
  }
  destroy() {
    this.raf.off(this._animate)
    resize.off(this._resize)
  }
}
