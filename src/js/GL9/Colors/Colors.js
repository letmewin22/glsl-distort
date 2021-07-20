import {Figure, Color} from '@emotionagency/glhtml'
import gsap from 'gsap'
import emitter from 'tiny-emitter/instance'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class Colors extends Figure {
  constructor(scene, renderer, $el) {
    super(scene, renderer, $el)

    this.onDark = this.onDark.bind(this)
    this.onLight = this.onLight.bind(this)
    const dark = document.querySelector('#dark')
    const light = document.querySelector('#light')

    dark.addEventListener('click', this.onDark)
    light.addEventListener('click', this.onLight)
  }

  createGeometry() {
    super.createGeometry({widthSegments: 1, heightSegments: 1})
  }

  createMaterial() {
    const uniforms = {
      uColor1: {value: new Color('#FDFAF3')},
      uColor2: {value: new Color('#1F1F1F')},
      uClicked: {value: 0},
    }

    super.createMaterial({uniforms, vertex, fragment})
  }

  createMesh() {
    super.createMesh()
  }

  onDark(e) {
    e.stopPropagation()
    gsap.to(this.material.uniforms.uClicked, {
      duration: 1,
      value: 1,
      overwrite: true,
    })
    document.body.setAttribute('data-dark', 'true')
    emitter.emit('changeTheme', 1)
  }

  onLight(e) {
    e.stopPropagation()
    gsap.to(this.material.uniforms.uClicked, {
      duration: 1,
      value: 0,
      overwrite: true,
    })
    document.body.removeAttribute('data-dark')
    emitter.emit('changeTheme', 0)
  }

  destroy() {
    super.destroy()
  }
}
