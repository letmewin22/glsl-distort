import {Plane, Program, Mesh, TextureLoader, Vec2} from 'ogl'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'
import {FigureMouse} from './Figure.mouse'

export default class Figure {
  sizes = new Vec2(0, 0)
  offset = new Vec2(0, 0)
  time = 0
  rendering = false

  constructor(scene, renderer, $img) {
    this.scene = scene
    this.renderer = renderer
    this.gl = this.renderer.gl
    this.$img = $img

    this.mouse = new FigureMouse(this)
    this.mouse.addEvents()

    this.loader = TextureLoader
    this.createMesh()
  }

  uploadTextures() {
    this.texture = this.loader.load(this.gl, {
      src: this.$img.getAttribute('src'),
    })

    this.texture2 = this.loader.load(this.gl, {
      src: this.$img.dataset.secondImage,
    })
  }

  createMesh() {
    this.uploadTextures()
    this.rendering = true

    this.$img.classList.add('js-hidden')

    this.geometry = new Plane(this.renderer.gl, {
      width: 1,
      height: 1,
      widthSegments: 128,
      heightSegments: 128,
    })

    const uniforms = {
      uTexture: {type: 't', value: this.texture},
      uColorTexture: {type: 't', value: this.texture2},
      uResolution: {
        type: 'v2',
        value: new Vec2(
          this.getBoundingTexture.naturalWidth,
          this.getBoundingTexture.naturalHeight,
        ),
      },
      uSize: {
        type: 'v2',
        value: new Vec2(
          this.getBoundingTexture.width,
          this.getBoundingTexture.height,
        ),
      },
      uTime: {value: 0},
      uDistortion: {value: 0},
      uScale: {value: 0},
      uLongScale: {value: 0.1},
      uClicked: {value: 0},
      uHide: {value: 0},
    }

    this.material = new Program(this.renderer.gl, {
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      vertex,
      fragment,
      transparent: true,
      cullFace: null,
      uniforms,
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
    const {width, height, top, left} = this.$img.getBoundingClientRect()
    const {naturalWidth, naturalHeight} = this.$img
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

    this.material.uniforms.uSize.value.x = this.getBoundingTexture.width
    this.material.uniforms.uSize.value.y = this.getBoundingTexture.height
  }

  destroy() {
    this.mouse.removeEvents()
    this.$img.classList.remove('js-hidden')

    this.scene.removeChild(this.mesh)

    this.geometry.remove()
    this.material.remove()
  }
}
