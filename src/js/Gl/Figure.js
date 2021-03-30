import * as THREE from 'three'
import gsap from 'gsap'
import CustomEase from 'gsap/dist/CustomEase'

import emitter from 'tiny-emitter/instance'
import {cloneNode} from '@/utils/cloneNode'

import vertex from './shader/vertex2.glsl'
import fragment from './shader/fragment.glsl'

gsap.registerPlugin(CustomEase)

const ease = CustomEase.create(
  'custom',
  `M0,0 C0.097,0 
  0.151,0.006 0.186,0.019 
  0.227,0.034 0.255,0.045 
  0.288,0.078 0.367,0.157 
  0.46,0.355 0.502,0.504 
  0.551,0.679 0.594,0.816 
  0.654,0.882 0.726,0.961 
  0.734,1 1,1`,
)

export default class Figure {
  sizes = new THREE.Vector2(0, 0)
  offset = new THREE.Vector2(0, 0)
  time = 0
  rendering = false

  constructor(scene, $img) {
    this.scene = scene
    this.$img = $img

    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.mouseClick = this.mouseClick.bind(this)

    this.$img.addEventListener('mouseenter', this.mouseEnter)
    this.$img.addEventListener('mouseleave', this.mouseLeave)
    this.$img.addEventListener('click', this.mouseClick)

    this.loader = new THREE.TextureLoader()
    this.createMesh()
  }

  uploadTextures() {
    const p1 = new Promise((resolve) => {
      this.texture = this.loader.load(this.$img.getAttribute('src'), () => {
        resolve()
      })
    })
    const p2 = new Promise((resolve) => {
      this.texture2 = this.loader.load(this.$img.dataset.secondImage, () => {
        resolve()
      })
    })

    return Promise.all([p1, p2])
  }

  async createMesh() {
    await this.uploadTextures()
    this.rendering = true

    this.$img.classList.add('js-hidden')

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 128, 128)

    const uniforms = {
      uTexture: {type: 't', value: this.texture},
      uColorTexture: {type: 't', value: this.texture2},
      uResolution: {
        type: 'v2',
        value: new THREE.Vector2(
          this.getBoundingTexture.naturalWidth,
          this.getBoundingTexture.naturalHeight,
        ),
      },
      uSize: {
        type: 'v2',
        value: new THREE.Vector2(
          this.getBoundingTexture.width,
          this.getBoundingTexture.height,
        ),
      },
      uTime: {value: 0},
      uDistortion: {value: 0},
      uScale: {value: 0},
      uClicked: {value: 0},
    }
    this.material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: '#extension GL_OES_standard_derivatives : enable',
      },
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      side: THREE.DoubleSide,
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.getSizes()

    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, this.sizes.x / 2)
    this.scene.add(this.mesh)
  }

  getSizes(pos = 0) {
    if (!this.rendering) {
      return
    }
    const {width, height, top, left} = this.getBoundingTexture

    const ww = window.innerWidth
    const wh = window.innerHeight

    this.sizes.set(width, height)
    this.offset.set(left - ww / 2 + width / 2, pos + wh / 2 - top - height / 2)
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
    const m = this.mesh.material.uniforms
    m.uTime.value = this.time
  }

  resize() {
    if (!this.rendering) {
      return
    }
    this.getSizes()
    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)

    this.mesh.material.uniforms.uSize.value.x = this.getBoundingTexture.width
    this.mesh.material.uniforms.uSize.value.y = this.getBoundingTexture.height
  }

  mouseClick() {
    cloneNode(this.$img)
    emitter.emit('updateImages')

    const tl = gsap.timeline()
    const duration = 1.6

    tl.to(this.$img, {
      duration,
      width: 1126,
      height: 684,
      top: 500,
      left: 85,
      ease,
    })

    tl.to(
      this.mesh.material.uniforms.uClicked,
      {
        duration,
        value: 1,
        ease,
      },
      0,
    )

    this.mouseEnter()

    this.$img.removeEventListener('mouseleave', this.mouseLeave)
  }

  mouseEnter() {
    if (!this.rendering) {
      return
    }

    gsap.to(this.mesh.material.uniforms.uDistortion, {
      duration: 1.6,
      value: 1,
      overwrite: true,
      ease,
    })
    gsap.to(document.body, {
      duration: 1.6,
      background: this.$img.dataset.color,
      overwrite: true,
      ease,
    })
    gsap.to(this.mesh.material.uniforms.uScale, {
      duration: 1.5,
      value: 1,
      delay: 0.1,
      overwrite: true,
      ease,
    })
  }

  mouseLeave() {
    if (!this.rendering) {
      return
    }
    gsap.to(this.mesh.material.uniforms.uDistortion, {
      duration: 1.8,
      value: 0,
      overwrite: true,
      ease: 'power4.out',
    })
    gsap.to(this.mesh.material.uniforms.uScale, {
      duration: 2,
      value: 0,
      delay: 0,
      overwrite: true,
      ease: 'power4.out',
    })
    gsap.to(document.body, {
      duration: 1.8,
      background: '#d7d8dd',
      overwrite: true,
      ease: 'power4.out',
    })
  }

  destroy() {
    this.$img.removeEventListener('mouseenter', this.mouseEnter)
    this.$img.removeEventListener('mouseleave', this.mouseLeave)
    this.$img.removeEventListener('click', this.mouseClick)
    this.$img.classList.remove('js-hidden')

    this.scene.remove(this.mesh)

    this.geometry.dispose()
    this.material.dispose()
    this.texture.dispose()
    this.texture2.dispose()
  }
}
