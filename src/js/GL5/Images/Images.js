import {Figure} from '@emotionagency/glhtml'
import {clamp} from '@emotionagency/utils'
import gsap from 'gsap'

import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export default class Images extends Figure {
  constructor(scene, renderer, $el) {
    super(scene, renderer, $el)
  }

  createMaterial() {
    const uniforms = {
      uTexture: {type: 't', value: this.texture},
      effectVelocity: {value: 0},
    }

    super.createMaterial({uniforms, vertex, fragment})
  }

  async createMesh() {
    this.texture = await this.uploadTexture(this.$el.dataset.secondImage)

    super.createMesh()
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

  update() {
    super.update()
    if (this.material) {
      const bottomDist =
        this.$el.getBoundingClientRect().bottom -
        this.$el.getBoundingClientRect().height
      const value = {
        top: 0,
      }

      if (bottomDist > 0) {
        gsap.to(value, {
          duration: 0.1,
          top: -this.velocity / 10,
          overwrite: true,
          onUpdate: () => {
            this.material.uniforms.effectVelocity.value =
              (value.top * bottomDist) / 300
          },
        })
      } else {
        this.material.uniforms.effectVelocity.value = 0
      }
    }
  }

  destroy() {
    this.mouse.removeEvents()
    this.disposeTexture(this.texture)
    this.disposeTexture(this.texture2)
    super.destroy()
  }
}
