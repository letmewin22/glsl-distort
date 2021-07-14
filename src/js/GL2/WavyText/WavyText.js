import Text from '../../dom-gl/Text'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class WavyText extends Text {
  constructor(scene, renderer, $el) {
    super(scene, renderer, $el)
  }

  createMaterial() {
    const uniforms = {
      uAlpha: {value: 0.06},
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
