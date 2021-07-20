import gsap from 'gsap'

import emitter from 'tiny-emitter/instance'
import {cloneNode} from '../../utils/cloneNode'

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
    this.instance.$el.addEventListener('mouseenter', this.mouseEnter)
    this.instance.$el.addEventListener('mouseleave', this.mouseLeave)
    this.instance.$el.addEventListener('click', this.mouseClick)
  }

  removeEvents() {
    this.instance.$el.removeEventListener('mouseenter', this.mouseEnter)
    this.instance.$el.removeEventListener('mouseleave', this.mouseLeave)
    this.instance.$el.removeEventListener('click', this.mouseClick)
  }

  mouseClick() {
    this.instance.material.uniforms.uTexture.value = this.instance.bigTexture
    cloneNode(this.instance.$el)
    emitter.emit('animateImages')

    window.ss.reset()
    window.ss.state.scrolled = 0
    window.ss.scrollbar.setHeight()
    window.ss.isFixed = false

    const to = document.querySelector('.to')
    const items = document.querySelectorAll('.cols')
    const {width, height, top, left} = to.getBoundingClientRect()

    const tl = gsap.timeline()
    const duration = 1.6

    const otherImages = document.querySelectorAll('.js-gl-img:not(.js-cloned)')

    otherImages.forEach((el) => {
      if (this.instance._id !== el.dataset.glId) {
        window.scetch.removeFigure(el.dataset.glId)
      }
    })

    tl.to(this.instance.$el, {
      duration,
      width,
      height,
      top,
      left,
      ease: 'power2.out',
      onComplete: () => {
        to.appendChild(this.instance.$el)
        this.instance.$el.style.position = 'static'
      },
    })

    tl.to(
      this.instance.material.uniforms.uCompleted,
      {
        value: 1,
        duration,
        ease,
      },
      duration,
    )

    tl.to(
      items,
      {
        opacity: 0,
        duration,
        ease,
      },
      0,
    )

    tl.to(
      this.instance.material.uniforms.uClicked,
      {
        duration,
        value: 1,
        ease: 'power2.inOut',
      },
      0.1,
    )

    this.mouseEnter()

    this.instance.$el.removeEventListener('mouseleave', this.mouseLeave)
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

    gsap.to(this.instance.material.uniforms.uScale, {
      duration: 1.5,
      value: 1,
      delay: 0.1,
      overwrite: true,
      ease,
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
  }
}
