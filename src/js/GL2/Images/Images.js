import gsap from 'gsap'
import Figure from '../../dom-gl/Figure'
import {FigureMouse} from './Figure.mouse'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class Images extends Figure {
  constructor(scene, renderer, $el) {
    super(scene, renderer, $el)

    this.mouse = new FigureMouse(this)
    this.mouse.addEvents()
  }

  createMaterial() {
    const uniforms = {
      uTexture: {type: 't', value: this.texture},
      uColorTexture: {type: 't', value: this.texture2},
      uDistortion: {value: 0},
      uScale: {value: 0},
      uLongScale: {value: 0.1},
      uClicked: {value: 0},
      uHide: {value: 1},
    }

    super.createMaterial({uniforms, vertex, fragment})
  }

  async createMesh() {
    this.texture = await this.uploadTexture(this.$el.dataset.src)
    this.texture2 = await this.uploadTexture(this.$el.dataset.secondImage)

    super.createMesh()

    gsap.to(this.material.uniforms.uHide, {duration: 1, value: 0})
  }

  destroy() {
    this.mouse.removeEvents()
    this.disposeTexture(this.texture)
    this.disposeTexture(this.texture2)
    super.destroy()
  }
}
