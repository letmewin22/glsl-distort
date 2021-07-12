import gsap from 'gsap'

import emitter from 'tiny-emitter/instance'
import {cloneNode} from '../utils/cloneNode'

export const ease = 'power2.out'

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
    emitter.emit('animateImages')
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
      onComplete: () => {
        to.appendChild(this.instance.$img)
        this.instance.$img.style.position = 'static'
      },
    })

    tl.to(
      this.instance.material.uniforms.uClicked,
      {
        duration,
        value: 1,
        ease,
      },
      0,
    )

    this.mouseEnter()

    gsap.to(this.instance.material.uniforms.uLongScale, {
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

    gsap.to(this.instance.material.uniforms.uDistortion, {
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
    gsap.to(this.instance.material.uniforms.uScale, {
      duration: 1.5,
      value: 1,
      delay: 0.1,
      overwrite: true,
      ease,
    })
    gsap.to(this.instance.material.uniforms.uLongScale, {
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
    gsap.to(this.instance.material.uniforms.uDistortion, {
      duration: 1.8,
      value: 0,
      overwrite: true,
      ease: 'power4.out',
    })
    gsap.to(this.instance.material.uniforms.uScale, {
      duration: 2,
      value: 0,
      delay: 0,
      overwrite: true,
      ease: 'power4.out',
    })
    gsap.to(this.instance.material.uniforms.uLongScale, {
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
