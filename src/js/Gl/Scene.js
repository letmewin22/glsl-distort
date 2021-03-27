import * as THREE from 'three'
import {raf, resize} from '@emotionagency/utils'

import Figure from './Figure'
import BaseScene from './BaseScene'

export default class Scene extends BaseScene {
  figures = []
  $imgs = []
  constructor($selector, $imgs = []) {
    super($selector)
    this.$imgs = $imgs

    this.init()
    this.bounds()
    raf.on(this.animate)
    resize.on(this.resize)
  }

  bounds() {
    ['animate', 'resize'].forEach((fn) => {
      this[fn] = this[fn].bind(this)
    })
  }

  init() {
    super.init()

    this.$imgs.forEach((img) => {
      const figureIns = new Figure(this.scene, img)
      this.figures.push(figureIns)
    })
  }

  setupCamera() {
    super.setupCamera()

    this.perspective = 800
    this.formula = 2 * Math.atan(this.sizes.h / 2 / this.perspective)
    this.fov = (180 * this.formula) / Math.PI
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      this.sizes.w / this.sizes.h,
      0.01,
      1000,
    )

    this.camera.position.set(0, 0, this.perspective)

    this.camera.lookAt(0, 0, 0)
  }

  updatePos(pos) {
    this.figures.forEach((figure) => {
      figure.getSizes(pos)
      figure.resize()
    })
  }

  resize() {
    super.resize()
    this.figures.forEach((figure) => figure.resize())
  }

  animate() {
    this.updatePos(document.querySelector('#scroll-container').scrollTop)
    this.figures.forEach((figure) => {
      figure.update()
    })
    super.animate()
  }

  destroy() {
    this.figures.forEach((figure) => {
      figure.destroy()
    })

    raf.off(this.animate)
    resize.off(this.resize)
    this.$container.removeChild(this.renderer.domElement)
  }
}
