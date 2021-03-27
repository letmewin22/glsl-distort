import * as THREE from 'three'
import gsap from 'gsap'

import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'

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
      this.image = this.loader.load(this.$img.getAttribute('src'), () => {
        resolve()
      })
    })
    const p2 = new Promise((resolve) => {
      this.image2 = this.loader.load(this.$img.dataset.secondImage, () => {
        resolve()
      })
    })

    return Promise.all([p1, p2])
  }

  async createMesh() {
    await this.uploadTextures()
    this.rendering = true

    this.$img.classList.add('js-hidden')

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

    const uniforms = {
      uTexture: {type: 't', value: this.image},
      uColorTexture: {type: 't', value: this.image2},
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
      uState: {value: 0},
      uDistortion: {value: 0},
      uScale: {value: 0},
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

  getSizes(currentScroll = 0) {
    if (!this.rendering) {
      return
    }
    const {width, height, top, left} = this.getBoundingTexture
    this.sizes.set(width, height)
    this.offset.set(
      left - window.innerWidth / 2 + width / 2,
      currentScroll + window.innerHeight / 2 - top - height / 2,
    )
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
    const m = this.mesh?.material?.uniforms
    if (m) m.uTime.value = this.time
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
    gsap.to(this.$img, {
      duration: 1,
      width: 300,
      height: 400,
      overwrite: true,
      ease: 'power3.inOut',
    })
  }

  mouseEnter() {
    gsap.to(this.mesh.material.uniforms.uDistortion, {
      duration: 1.8,
      value: 1,
      overwrite: true,
      ease: 'power3.inOut',
    })
    gsap.to(document.body, {
      duration: 1.8,
      background: this.$img.dataset.color,
      overwrite: true,
      ease: 'power3.inOut',
    })
    gsap.to(this.mesh.material.uniforms.uScale, {
      duration: 1.7,
      value: 1,
      delay: 0.1,
      overwrite: true,
      ease: 'power3.inOut',
    })
  }

  mouseLeave() {
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
}
