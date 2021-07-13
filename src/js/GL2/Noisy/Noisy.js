import BaseFigure from '../../dom-gl/BaseFigure'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class Noisy extends BaseFigure {
  constructor(scene, renderer, $el) {
    super(scene, renderer, $el)
  }

  createMaterial() {
    const uniforms = {
      uAlpha: {value: 0.26},
    }

    super.createMaterial({uniforms, vertex, fragment})
  }

  createMesh() {
    super.createMesh()
  }

  destroy() {
    super.destroy()
  }
}
