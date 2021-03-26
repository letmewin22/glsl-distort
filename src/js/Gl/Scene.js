import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

import Figure from './Figure'

export default class Scene {
  constructor($selector, $imgs = [], $cimgs = []) {
    this.$container = document.querySelector($selector)
    this.$imgs = $imgs
    this.$cimgs = $cimgs

    this.sizes = {
      w: window.innerWidth,
      h: window.innerHeight,
    }

    this.time = 0

    this.figures = []

    this.resize = this.resize.bind(this)
    window.addEventListener('resize', this.resize)

    this.init()
    this.animate()
  }

  init() {
    this.scene = new THREE.Scene()

    this.setupCamera()

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })

    this.renderer.setSize(this.sizes.w, this.sizes.h)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setClearColor(0xd3d3d3, 0)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableZoom = false

    this.$container.appendChild(this.renderer.domElement)

    this.$imgs.forEach((img, i) => {
      const figureIns = new Figure(this.scene, img, this.$cimgs[i])
      this.figures.push(figureIns)
    })
  }

  setupCamera() {
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

    // this.camera.lookAt(this.scene.position)
    this.camera.lookAt(0, 0, 0)
  }

  resize() {
    this.sizes = {...this.sizes, w: window.innerWidth, h: window.innerHeight}

    this.setupCamera()

    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.sizes.w, this.sizes.h)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.figures.forEach((figure) => figure.resize())
  }

  updatePos(pos) {
    // this.scene.position.y = pos
    this.figures.forEach((figure) => {
      figure.getSizes(pos)
      figure.resize()
    })
  }

  animate() {
    this.animateRAF = () => {
      requestAnimationFrame(this.animateRAF)
      this.time++
      this.figures.forEach((figure) => {
        figure.update()
      })
      this.updatePos(document.querySelector('#scroll-container').scrollTop)
      this.renderer.render(this.scene, this.camera)
    }
    this.animateRAF()
  }
}
