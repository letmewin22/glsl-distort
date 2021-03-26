import * as THREE from 'three'
import gsap from 'gsap'

import vertex from './shader/vertex.glsl'
import fragment from './shader/fragment.glsl'

export default class Figure {
  constructor(scene, $img, $cimg) {
    this.scene = scene
    this.$img = $img
    this.$cimg = $cimg

    this.time = 0

    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)

    this.$img.addEventListener('mouseenter', this.mouseEnter)
    this.$img.addEventListener('mouseleave', this.mouseLeave)

    this.loader = new THREE.TextureLoader()
    this.createMesh()
  }

  createMesh() {
    this.image = this.loader.load(this.$img.getAttribute('src'))
    this.image2 = this.loader.load(this.$cimg.getAttribute('src'))
    this.$img.classList.add('js-hidden')

    this.sizes = new THREE.Vector2(0, 0)
    this.offset = new THREE.Vector2(0, 0)

    this.geometry = new THREE.PlaneBufferGeometry(1, 1, 80, 80)

    const uniforms = {
      uTexture: {type: 't', value: this.image},
      uResolution: {
        type: 'v2',
        value: new THREE.Vector2(
          this.getBoundingTexture.width,
          this.getBoundingTexture.height,
        ),
      },
      uColorTexture: {type: 't', value: this.image2},
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
    const {width, height, top, left} = this.getBoundingTexture
    this.sizes.set(width, height)
    this.offset.set(
      left - window.innerWidth / 2 + width / 2,
      currentScroll + window.innerHeight / 2 - top - height / 2,
    )
  }

  get getBoundingTexture() {
    const {width, height, top, left} = this.$img.getBoundingClientRect()
    return {width, height, top, left}
  }

  update() {
    this.time++
    const m = this.mesh.material.uniforms
    m.uTime.value = this.time
  }

  resize() {
    this.getSizes()
    this.mesh.position.set(this.offset.x, this.offset.y, 0)
    this.mesh.scale.set(this.sizes.x, this.sizes.y, this.sizes.x / 2)
    this.mesh.material.uniforms.uResolution.x = this.getBoundingTexture.width
    this.mesh.material.uniforms.uResolution.y = this.getBoundingTexture.height
  }

  mouseEnter() {
    gsap.to(this.mesh.material.uniforms.uDistortion, {
      duration: 1.8,
      value: 1,
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
  }
}
