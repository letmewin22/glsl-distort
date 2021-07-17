import {Figure} from '@emotionagency/glhtml'
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
    }

    super.createMaterial({uniforms, vertex, fragment})
  }

  async createMesh() {
    this.texture = await this.uploadTexture(this.$el.dataset.src)
    this.texture2 = await this.uploadTexture(this.$el.dataset.secondImage)

    super.createMesh()
  }

  destroy() {
    this.disposeTexture(this.texture)
    super.destroy()
  }
}
