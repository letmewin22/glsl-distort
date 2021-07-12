import BaseFigure from './BaseFigure'
import {FigureMouse} from './Figure.mouse'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class Figure extends BaseFigure {
  constructor(scene, renderer, $img) {
    super(scene, renderer, $img)

    this.mouse = new FigureMouse(this)
    this.mouse.addEvents()
  }

  async createMesh() {
    this.texture = await this.uploadTexture(this.$img.getAttribute('src'))
    this.texture2 = await this.uploadTexture(this.$img.dataset.secondImage)

    const uniforms = {
      uTexture: {type: 't', value: this.texture},
      uColorTexture: {type: 't', value: this.texture2},
      uTime: {value: 0},
      uDistortion: {value: 0},
      uScale: {value: 0},
      uLongScale: {value: 0.1},
      uClicked: {value: 0},
      uHide: {value: 0},
    }

    super.createMesh({uniforms, vertex, fragment})
  }

  destroy() {
    this.mouse.removeEvents()
    super.destroy()
  }
}
