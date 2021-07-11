import * as THREE from 'three'
import gsap from 'gsap'
import {raf, resize} from '@emotionagency/utils'
import emitter from 'tiny-emitter/instance'
import {state} from '@emotionagency/smoothscroll'

import Figure from './Figure'
import {ease} from './Figure.mouse'
import BaseScene from './BaseScene'

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
    ['animate', 'resize', 'updatePos'].forEach((fn) => {
      this[fn] = this[fn].bind(this)
    })
  }

  init() {
    super.init()
    const updatePos = this.updatePos

    this.proxy = new Proxy(
      {},
      {
        set(...args) {
          const result = Reflect.set(...args)
          updatePos()
          return result
        },
      },
    )

    this.$imgs.forEach((img) => {
      const figureIns = new Figure(this.scene, img, this.proxy)
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

  updatePos() {
    this.figures.forEach((figure) => {
      figure.setSizes()
      figure.resize()
    })
  }

  resize() {
    super.resize()
    this.figures.forEach((figure) => figure.resize())
  }

  animate() {
    if (state.scrolling) {
      this.proxy.scrollPosition = document.querySelector(
        '#scroll-container',
      ).scrollTop
    }
    this.figures.forEach((figure) => {
      figure.update()
    })
    super.animate()
  }

  updateImages() {
    const blocks = document.querySelectorAll('.img-wrapper')
    this.$imgs.forEach(($img, i) => {
      if (!$img.classList.contains('js-cloned')) {
        gsap.to(this.figures[i].mesh.material.uniforms.uHide, {
          duration: 1.2,
          value: 1,
          ease,
          onComplete: () => this.figures[i].destroy(),
        })
        gsap.to(blocks, {duration: 1.2, opacity: 0, ease})
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
