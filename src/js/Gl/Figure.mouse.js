import gsap from 'gsap'
import CustomEase from 'gsap/dist/CustomEase'

import emitter from 'tiny-emitter/instance'
import {cloneNode} from '@/utils/cloneNode'

gsap.registerPlugin(CustomEase)

export const ease = CustomEase.create(
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

export class FigureMouse {
  constructor(instance) {
    this.instance = instance
    this.bounds()
  }

  bounds() {
    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.mouseClick = this.mouseClick.bind(this)
  }

  addEvents() {
    this.instance.$img.addEventListener('mouseenter', this.mouseEnter)
    this.instance.$img.addEventListener('mouseleave', this.mouseLeave)
    this.instance.$img.addEventListener('click', this.mouseClick)
  }

  removeEvents() {
    this.instance.$img.removeEventListener('mouseenter', this.mouseEnter)
    this.instance.$img.removeEventListener('mouseleave', this.mouseLeave)
    this.instance.$img.removeEventListener('click', this.mouseClick)
  }

  mouseClick() {
    cloneNode(this.instance.$img)
    emitter.emit('updateImages')
    const to = document.querySelector('.to')
    const {width, height, top, left} = to.getBoundingClientRect()

    const tl = gsap.timeline()
    const duration = 1.6

    tl.to(this.instance.$img, {
      duration,
      width,
      height,
      top,
      left,
      ease,
      onUpdate: () => {
        this.instance.proxy.progress += 1
      },
      onComplete: () => {
        to.appendChild(this.instance.$img)
        this.instance.$img.style.position = 'static'
      },
    })

    tl.to(
      this.instance.mesh.material.uniforms.uClicked,
      {
        duration,
        value: 1,
        ease,
      },
      0,
    )

    this.mouseEnter()

    gsap.to(this.instance.mesh.material.uniforms.uLongScale, {
      duration: 1,
      value: 0,
      delay: 0,
      overwrite: true,
      ease,
    })

    this.instance.$img.removeEventListener('mouseleave', this.mouseLeave)
  }

  mouseEnter() {
    if (!this.instance.rendering) {
      return
    }

    gsap.to(this.instance.mesh.material.uniforms.uDistortion, {
      duration: 1.6,
      value: 1,
      overwrite: true,
      ease,
    })
    // gsap.to(document.body, {
    //   duration: 1.6,
    //   background: this.instance.$img.dataset.color,
    //   overwrite: true,
    //   ease,
    // })
    gsap.to(this.instance.mesh.material.uniforms.uScale, {
      duration: 1.5,
      value: 1,
      delay: 0.1,
      overwrite: true,
      ease,
    })
    gsap.to(this.instance.mesh.material.uniforms.uLongScale, {
      duration: 10,
      value: 0,
      overwrite: true,
      ease: 'power1.out',
    })
  }

  mouseLeave() {
    if (!this.instance.rendering) {
      return
    }
    gsap.to(this.instance.mesh.material.uniforms.uDistortion, {
      duration: 1.8,
      value: 0,
      overwrite: true,
      ease: 'power4.out',
    })
    gsap.to(this.instance.mesh.material.uniforms.uScale, {
      duration: 2,
      value: 0,
      delay: 0,
      overwrite: true,
      ease: 'power4.out',
    })
    gsap.to(this.instance.mesh.material.uniforms.uLongScale, {
      duration: 2,
      value: 0.1,
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
