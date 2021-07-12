import {Plane, Program, Mesh, Vec2} from 'ogl'
import {TextureLoader} from './TextureLoader/TextureLoader'
import {generateID} from './utils/generateID'

// shaders
import baseFragment from './baseShaders/fragment.glsl'
import bgCover from './baseShaders/bgCover.glsl'
import vertexShader from './baseShaders/vertex.glsl'

const baseVertex = bgCover + '\n' + vertexShader

export default class BaseFigure {
  sizes = new Vec2(0, 0)
  offset = new Vec2(0, 0)
  time = 0
  rendering = false

  constructor(scene, renderer, $el) {
    this.scene = scene
    this.renderer = renderer
    this.gl = this.renderer.gl
    this.$el = $el
    this._id = generateID(12)
    this.$el.setAttribute('data-gl-id', this._id)
    console.log(this.$el)

    this.loader = new TextureLoader({gl: this.gl})
    this.createMesh()
  }

  uploadTexture(src) {
    return new Promise((resolve) => {
      const texture = this.loader.load(src, () => {
        resolve(texture)
      })
    })
  }

  createMesh(opts = {}) {
    this.rendering = true

    this.$el.classList.add('js-hidden')

    this.geometry = new Plane(this.renderer.gl, {
      width: 1,
      height: 1,
      widthSegments: 128,
      heightSegments: 128,
    })

    const baseUniforms = {
      resolution: {
        type: 'v2',
        value: new Vec2(
          this.getBoundingTexture.naturalWidth,
          this.getBoundingTexture.naturalHeight,
        ),
      },
      size: {
        type: 'v2',
        value: new Vec2(
          this.getBoundingTexture.width,
          this.getBoundingTexture.height,
        ),
      },
    }

    const uniforms = {...baseUniforms, ...opts?.uniforms}
    const vertex = baseVertex + '\n' + opts?.vertex
    const fragment = baseFragment + '\n' + opts?.fragment

    this.material = new Program(this.renderer.gl, {
      vertex,
      fragment,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })

    this.setSizes()

    this.mesh = new Mesh(this.renderer.gl, {
      geometry: this.geometry,
      program: this.material,
    })

    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, this.sizes.x / 2)

    this.mesh.setParent(this.scene)
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
    let naturalWidth
    let naturalHeight

    if (this.texture) {
      naturalWidth = this.texture.image.naturalWidth
      naturalHeight = this.texture.image.naturalHeight
    }

    return {width, height, top, left, naturalWidth, naturalHeight}
  }

  update() {
    if (!this.rendering) {
      return
    }
    this.time++
    const m = this.material.uniforms
    m.uTime.value = this.time
  }

  resize() {
    if (!this.rendering) {
      return
    }
    this.setSizes()
    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

    this.material.uniforms.size.value.x = this.getBoundingTexture.width
    this.material.uniforms.size.value.y = this.getBoundingTexture.height
  }

  destroy() {
    this.$el.classList.remove('js-hidden')
    this.$el.removeAttribute('data-gl-id')

    this.scene.removeChild(this.mesh)

    this.geometry.remove()
    this.material.remove()
  }
}
