import {Program, Text, Geometry} from 'ogl'
import BaseFigure from './BaseFigure'

export default class TextFigure extends BaseFigure {
  constructor({scene, renderer, el}) {
    super({scene, renderer, el})
  }

  async createMaterial(opts = {}) {
    super.createMaterial(opts)
    this.texture = await this.uploadTexture('/assets/fonts/font.png')

    const baseUniforms = {
      tMap: {value: this.texture},
    }

    this.uniforms = {...this.uniforms, ...baseUniforms}

    this.material = new Program(this.renderer.gl, {
      vertex: this.vertex,
      fragment: this.fragment,
      uniforms: this.uniforms,
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
    super.createMesh()
    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(0.8, 0.8, 0.8)

    this.mesh.setParent(this.scene)

    this.rendering = true
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
    super.resize()

    this.mesh.position.set(this.offset.x, this.offset.y, 0)

    this.text.width = this.sizes.x
    this.text.height = this.sizes.y

    this.text.text = this.textSyles.text
    this.text.align = this.textSyles.align
    this.text.letterSpacing = this.textSyles.letterSpacing
    this.text.size = this.textSyles.size
    this.text.lineHeight = this.textSyles.lineHeight
  }
}
