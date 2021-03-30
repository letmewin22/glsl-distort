import * as THREE from 'three'
import gsap from 'gsap'
import {raf, resize} from '@emotionagency/utils'
import emitter from 'tiny-emitter/instance'

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

    emitter.on('updateImages', () => {
      this.updateImages()
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
      10000,
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

  updateImages() {
    this.$imgs.forEach(($img, i) => {
      if (!$img.classList.contains('js-cloned')) {
        this.figures[i].destroy()
        gsap.to($img, {duration: 1, opacity: 0})
      }
    })
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
