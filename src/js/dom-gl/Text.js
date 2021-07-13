import {Program, Mesh, Vec2, Text, Geometry} from 'ogl'
import {TextureLoader} from './TextureLoader/TextureLoader'

import {generateID} from './utils/generateID'

import baseFragment from './baseShaders/fragment.glsl'
import baseVertex from './baseShaders/vertex.glsl'

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
    this.texture = await this.uploadTexture('/assets/fonts/FiraSans-Bold.png')

    const font = await (await fetch('/assets/fonts/FiraSans-Bold.json')).json()

    this.text = new Text({
      font,
      text: "don't panic",
      width: 4,
      align: 'center',
      letterSpacing: -0.05,
      size: 1,
      lineHeight: 1.1,
    })

    // console.log(text)
    // console.log(font)
    // this.text = new Text(this.renderer.gl, {
    //   font: font,
    //   text: 'Test',
    // })

    this.geometry = new Geometry(this.gl, {
      position: {size: 3, data: this.text.buffers.position},
      uv: {size: 2, data: this.text.buffers.uv},
      // id provides a per-character index, for effects that may require it
      id: {size: 1, data: this.text.buffers.id},
      index: {data: this.text.buffers.index},
    })

    const baseUniforms = {
      uTime: {value: 0},
      tMap: {value: this.texture},
    }

    const uniforms = baseUniforms
    const vertex = baseVertex + '\n' + defaultVertex
    const fragment = baseFragment + '\n' + defaultFragment

    this.material = new Program(this.renderer.gl, {
      vertex,
      fragment,
      uniforms,
      transparent: true,
      cullFace: null,
    })
  }
  createMesh() {
    this.rendering = true

    this.$el.classList.add('js-hidden')

    this.createMaterial()

    this.setSizes()

    this.mesh = new Mesh(this.renderer.gl, {
      geometry: this.geometry,
      program: this.material,
    })

    // console.log(this.text)
    // this.mesh.position.set(this.offset.x, this.offset.y, 0)
    // this.mesh.scale.set(this.sizes.x, this.sizes.y, this.sizes.x / 2)
    // this.mesh.position.y = this.text.height * 0.5
    this.mesh.setParent(this.scene)
    console.log(this.mesh)
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

  update() {
    if (!this.rendering) {
      return
    }
    this.time++
    // const m = this.material.uniforms
    // m.uTime.value = this.time
  }

  resize() {
    if (!this.rendering) {
      return
    }
    this.setSizes()
    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

    // this.material.uniforms.size.value.x = this.getBoundingTexture.width
    // this.material.uniforms.size.value.y = this.getBoundingTexture.height
  }

  destroy() {
    this.$el.classList.remove('js-hidden')
    this.$el.removeAttribute('data-gl-id')
    this.geometry.remove()
    this.material.remove()

    this.scene.removeChild(this.mesh)
  }
}
