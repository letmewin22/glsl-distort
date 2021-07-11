import {Camera} from 'ogl'
import {resize, raf} from '@emotionagency/utils'
import emitter from 'tiny-emitter/instance'
import gsap from 'gsap'

import BaseScene from './BaseScene'
import Figure from './Figure'

export default class Scene extends BaseScene {
  figures = []
  $imgs = []

  constructor($selector, $imgs = []) {
    super($selector)
    this.$imgs = $imgs

    this.bounds()
    this.init()
    raf.on(this.animate)
    resize.on(this.resize)
  }

  bounds() {
    const m = ['animate', 'resize']
    m.forEach((fn) => {
      this[fn] = this[fn].bind(this)
    })
  }

  init() {
    super.init()

    this.$imgs.forEach((img) => {
      const figureIns = new Figure(this.scene, this.renderer, img)
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

    this.camera = new Camera(this.renderer.gl, {
      fov: this.fov,
      aspect: this.sizes.w / this.sizes.h,
      near: 0.01,
      far: 10000,
    })

    this.camera.position.x = 0
    this.camera.position.y = 0
    this.camera.position.z = this.perspective
  }

  updatePos() {
    this.figures.forEach((figure) => {
      figure.setSizes()
      figure.resize()
      figure.update()
    })
  }

  resize() {
    super.resize()
  }

  updateImages() {
    const blocks = document.querySelectorAll('.img-wrapper')
    this.$imgs.forEach(($img, i) => {
      if (!$img.classList.contains('js-cloned')) {
        gsap.to(this.figures[i].material.uniforms.uHide, {
          duration: 1.2,
          value: 1,
          ease: 'power2.out',
          // onComplete: () => this.figures[i].destroy(),
        })
        gsap.to(blocks, {duration: 1.2, opacity: 0, ease: 'power2.out'})
      }
    })
  }

  animate() {
    this.updatePos()
    super.animate()
  }

  destroy() {
    this.figures.forEach((figure) => {
      figure.destroy()
    })
  }
}
