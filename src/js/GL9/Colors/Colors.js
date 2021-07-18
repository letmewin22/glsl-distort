import {Figure, OGL} from '@emotionagency/glhtml'
import gsap from 'gsap'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class Colors extends Figure {
  constructor(scene, renderer, $el) {
    super(scene, renderer, $el)

    this.onClick = this.onClick.bind(this)

    document.body.addEventListener('click', this.onClick)
  }

  createMaterial() {
    const uniforms = {
      uColor1: {value: new OGL.Color('#FDFAF3')},
      uColor2: {value: new OGL.Color('#1F1F1F')},
      uClicked: {value: 0},
    }

    super.createMaterial({uniforms, vertex, fragment})
  }

  createMesh() {
    super.createMesh()
  }

  onClick() {
    let to = 1
    if (this.material.uniforms.uClicked.value === 0) {
      to = 1
    } else {
      to = 0
    }
    gsap.to(this.material.uniforms.uClicked, {
      duration: 1,
      value: to,
      overwrite: true,
    })
  }

  destroy() {
    super.destroy()
  }
}
