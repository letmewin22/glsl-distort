import {Renderer, Transform} from 'ogl'

export default class DefaultScetch {
  constructor($selector) {
    this.$container = document.querySelector($selector)

    this.sizes = {
      w: window.innerWidth,
      h: window.innerHeight,
    }

    this.time = 0
  }

  init() {
    this.scene = new Transform()

    this.renderer = new Renderer({
      dpr: 2,
      antialias: true,
      alpha: true,
      premultipliedAlpha: true,
    })

    this.setupCamera()
    this.renderer.setSize(this.sizes.w, this.sizes.h)
    this.$container.appendChild(this.renderer.gl.canvas)
  }

  setupCamera() {}

  resize() {
    this.sizes = {...this.sizes, w: window.innerWidth, h: window.innerHeight}

    this.setupCamera()

    this.camera.updateMatrixWorld()

    this.camera.perspective({
      aspect: this.sizes.w / this.sizes.h,
    })

    this.renderer.setSize(this.sizes.w, this.sizes.h)
  }

  animate() {
    this.time++
    this.renderer.render({scene: this.scene, camera: this.camera})
  }
  destroy() {}
}
