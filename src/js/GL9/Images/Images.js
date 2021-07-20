import {lerp} from '@emotionagency/utils'
import {Figure} from '@emotionagency/glhtml'
import emitter from 'tiny-emitter/instance'

import {FigureMouse} from './Figure.mouse'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class Images extends Figure {
  constructor(scene, renderer, $el) {
    super(scene, renderer, $el)

    this.mouse = new FigureMouse(this)
    this.mouse.addEvents()
  }

  createGeometry() {
    super.createGeometry({widthSegments: 64, heightSegments: 64})
  }

  async uploadTextures() {
    const baseParams = 'f_webp,q_92'
    const params = baseParams + ',' + 'c_scale,w_800'
    const fileName = this.$el.dataset.src
    const baseURL = 'https://res.cloudinary.com/emotion-agency/image/upload'
    const link = `${baseURL}/${params}/${fileName}`
    const link2 = `${baseURL}/${baseParams}/${fileName}`

    this.texture = await this.uploadTexture(link)
    this.bigTexture = await this.uploadTexture(link2)
    emitter.emit('textureLoaded')
  }

  createMaterial() {
    this.dividers = 8

    const uniforms = {
      uTexture: {type: 't', value: this.texture},
      uDistortion: {value: 0},
      uScale: {value: 0},
      uLongScale: {value: 0.1},
      uClicked: {value: 0},
      uCompleted: {value: 0},
      uHide: {value: 1},
      uStrength: {value: 0},
      uViewportY: {value: window.innerHeight},
      uScrollPos: {value: 0},
      uScrollHeight: {value: 0},
      uOffsetY: {value: 0},
    }

    super.createMaterial({uniforms, vertex, fragment})
  }

  async createMesh() {
    await this.uploadTextures()
    super.createMesh()
  }

  get scrollHeight() {
    return window.ss?.max + window.innerHeight
  }

  get scrollPos() {
    return window.ss?.state?.scrolled
  }

  get velocity() {
    const target = window.ss?.state?.target ?? 0
    return this.isScrolling ? this.scrollPos - target : 0
  }

  get isScrolling() {
    return window.ss?.state?.scrolling ?? false
  }

  resize() {
    super.resize()

    if (this.material) {
      this.material.uniforms.uViewportY.value = window.innerHeight
    }
  }

  update() {
    super.update()

    if (this.material) {
      let strength = this.velocity / 250
      strength = lerp(this.material.uniforms.uStrength.value, strength, 0.08)
      this.material.uniforms.uStrength.value = strength
      this.material.uniforms.uScrollHeight.value = this.scrollHeight
      this.material.uniforms.uOffsetY.value = this.offset.y
    }
  }

  destroy() {
    this.mouse.removeEvents()
    this.disposeTexture(this.texture)
    super.destroy()
  }
}
