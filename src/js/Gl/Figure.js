import * as THREE from 'three'

import vertex from './shader/vertex2.glsl'
import fragment from './shader/fragment.glsl'

import {FigureMouse} from './Figure.mouse'

export default class Figure {
  sizes = new THREE.Vector2(0, 0)
  offset = new THREE.Vector2(0, 0)
  time = 0
  rendering = false

  constructor(scene, $img, proxy) {
    this.scene = scene
    this.$img = $img
    this.proxy = proxy

    this.mouse = new FigureMouse(this)
    this.mouse.addEvents()

    this.loader = new THREE.TextureLoader()
    this.createMesh()

    document.querySelector('.range').addEventListener('input', (e) => {
      this.mesh.material.uniforms.uHide.value = e.target.value
    })
  }

  uploadTextures() {
    const p1 = new Promise((resolve) => {
      this.texture = this.loader.load(this.$img.getAttribute('src'), () => {
        resolve()
      })
    })
    const p2 = new Promise((resolve) => {
      this.texture2 = this.loader.load(this.$img.dataset.secondImage, () => {
        resolve()
      })
    })

    return Promise.all([p1, p2])
  }

  async createMesh() {
    await this.uploadTextures()
    this.rendering = true

    this.$img.classList.add('js-hidden')

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 128, 128)

    console.log(this.geometry)

    const uniforms = {
      uTexture: {type: 't', value: this.texture},
      uColorTexture: {type: 't', value: this.texture2},
      uResolution: {
        type: 'v2',
        value: new THREE.Vector2(
          this.getBoundingTexture.naturalWidth,
          this.getBoundingTexture.naturalHeight,
        ),
      },
      uSize: {
        type: 'v2',
        value: new THREE.Vector2(
          this.getBoundingTexture.width,
          this.getBoundingTexture.height,
        ),
      },
      uTime: {value: 0},
      uDistortion: {value: 0},
      uScale: {value: 0},
      uLongScale: {value: 0.1},
      uClicked: {value: 0},
      uHide: {value: 0},
    }
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.setSizes()

    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, this.sizes.x / 2)
    this.scene.add(this.mesh)
  }

  setSizes() {
    if (!this.rendering) {
      return
    }
    const {width, height, top, left} = this.getBoundingTexture

    const ww = window.innerWidth
    const wh = window.innerHeight

    this.sizes.set(width, height)
    this.offset.set(left - ww / 2 + width / 2, wh / 2 - top - height / 2)
  }

  get getBoundingTexture() {
    const {width, height, top, left} = this.$img.getBoundingClientRect()
    const {naturalWidth, naturalHeight} = this.$img
    return {width, height, top, left, naturalWidth, naturalHeight}
  }
  update() {
    if (!this.rendering) {
      return
    }
    this.time++
    const m = this.mesh.material.uniforms
    m.uTime.value = this.time
  }

  resize() {
    if (!this.rendering) {
      return
    }
    this.setSizes()
    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

    this.mesh.material.uniforms.uSize.value.x = this.getBoundingTexture.width
    this.mesh.material.uniforms.uSize.value.y = this.getBoundingTexture.height
  }

  destroy() {
    this.mouse.removeEvents()
    this.$img.classList.remove('js-hidden')

    this.scene.remove(this.mesh)

    this.geometry.dispose()
    this.material.dispose()
    this.texture.dispose()
    this.texture2.dispose()
  }
}
