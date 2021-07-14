import {Program, Mesh, Vec2, Text, Geometry} from 'ogl'
import {TextureLoader} from './TextureLoader/TextureLoader'
import {generateID} from './utils/generateID'

import defaultFragment from './defaultShaders/fragment.glsl'
import defaultVertex from './defaultShaders/vertex.glsl'

export default class TextFigure {
  sizes = new Vec2(0, 0)
  offset = new Vec2(0, 0)
  time = 0
  rendering = false

  constructor({scene, renderer, el}) {
    this.scene = scene
    this.renderer = renderer
    this.gl = this.renderer.gl
    this.$el = el

    this._id = generateID(12)
    this.loader = new TextureLoader({gl: this.gl})

    this.$el.setAttribute('data-gl-id', this._id)

    this.createMesh()
  }

  async uploadTexture(src) {
    return new Promise((resolve) => {
      const texture = this.loader.load(src, () => resolve(texture))
    })
  }

  async createMaterial(opts = {}) {
    this.texture = await this.uploadTexture('/assets/fonts/font.png')

    const baseUniforms = {
      uTime: {value: 0},
      tMap: {value: this.texture},
    }

    const uniforms = baseUniforms
    const vertex = defaultVertex
    const fragment = defaultFragment

    this.material = new Program(this.renderer.gl, {
      vertex,
      fragment,
      uniforms,
      transparent: true,
      cullFace: null,
    })

    const font = await (await fetch('/assets/fonts/font.json')).json()

    this.text = new Text({
      font,
      ...this.textSyles,
    })

    this.geometry = new Geometry(this.gl, {
      position: {size: 3, data: this.text.buffers.position},
      uv: {size: 2, data: this.text.buffers.uv},
      // id provides a per-character index, for effects that may require it
      id: {size: 1, data: this.text.buffers.id},
      index: {data: this.text.buffers.index},
    })
  }
  async createMesh() {
    this.$el.classList.add('js-hidden')

    await this.createMaterial()

    this.setSizes()

    this.mesh = new Mesh(this.renderer.gl, {
      geometry: this.geometry,
      program: this.material,
    })

    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(0.8, 0.8, 0.8)

    this.mesh.setParent(this.scene)

    this.rendering = true
  }

  update() {
    if (!this.rendering) {
      return
    }
    this.time++
    const m = this.material.uniforms
    m.uTime.value = this.time
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
    const {width, height, top, left} = this.$el.getBoundingClientRect()

    return {width, height, top, left}
  }

  get textSyles() {
    const styles = window.getComputedStyle(this.$el)
    const text = this.$el.innerText

    let textAlign

    switch (styles.textAlign) {
      case 'start':
        textAlign = 'right'
        break
      case 'center':
        textAlign = 'center'
        break
      case 'end':
        textAlign = 'left'
        break
      default:
        textAlign = 'right'
        break
    }

    let letterSpacing

    switch (styles.letterSpacing) {
      case 'normal':
        letterSpacing = 0
        break
      default:
        letterSpacing = parseInt(styles.letterSpacing)
        break
    }

    const textStyles = {
      text,
      align: textAlign,
      letterSpacing: letterSpacing,
      size: parseInt(styles.fontSize),
      lineHeight: parseInt(styles.lineHeight),
    }

    return textStyles
  }

  resize() {
    if (!this.rendering) {
      return
    }

    this.setSizes()
    this.mesh.position.set(this.offset.x, this.offset.y, 0)

    this.text.width = this.sizes.x
    this.text.height = this.sizes.y

    this.text.text = this.textSyles.text
    this.text.align = this.textSyles.align
    this.text.letterSpacing = this.textSyles.letterSpacing
    this.text.size = this.textSyles.size
    this.text.lineHeight = this.textSyles.lineHeight

    this.mesh.geometry.attributes.position.data = this.text.buffers.position
    this.mesh.geometry.attributes.uv.data = this.text.buffers.uv
    this.mesh.geometry.attributes.id.data = this.text.buffers.id
    this.mesh.geometry.attributes.index.data = this.text.buffers.index

    this.mesh.geometry.attributes.position.needsUpdate = true
    this.mesh.geometry.attributes.uv.needsUpdate = true
    this.mesh.geometry.attributes.id.needsUpdate = true
    this.mesh.geometry.attributes.index.needsUpdate = true
  }

  destroy() {
    this.$el.classList.remove('js-hidden')
    this.$el.removeAttribute('data-gl-id')
    this.geometry.remove()
    this.material.remove()

    this.scene.removeChild(this.mesh)
  }
}
