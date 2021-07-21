/* eslint-disable max-len */
import {Scetch} from '@emotionagency/glhtml'
import {SmoothScroll} from '@emotionagency/smoothscroll'
import {raf} from '@emotionagency/utils'

import cssWebP from '@/libs/testWebP'
import Images from './GL9/Images/Images'
import Colors from './GL9/Colors/Colors'
import Noisy from './GL2/Noisy/Noisy'
import textAnimate from './textAnimate'
import {Loader} from './components/Loader'

cssWebP()
const imgs = [...document.querySelectorAll('.js-gl-img')]
const noisy = document.querySelector('.noisy')
const colors = document.querySelector('.bg')

let nodes = imgs.map((img) => ({
  $el: img,
  Figure: Images,
  cover: {
    state: true,
    positionY: +JSON.parse(img.dataset.cover).y,
    positionX: +JSON.parse(img.dataset.cover).x,
  },
}))

nodes = [...nodes]

window.addEventListener('load', () => {
  setTimeout(() => {
    window.ss = new SmoothScroll()
    window.scetch = new Scetch('#gl', {
      nodes,
      raf,
    })

    window.scetch2 = new Scetch('#gl-2', {
      nodes: [
        {
          $el: colors,
          Figure: Colors,
        },
        {
          $el: noisy,
          Figure: Noisy,
        },
      ],
      raf,
    })

    const loadingAnim = () => {
      setTimeout(() => {
        textAnimate.in()
      }, 500)
      const c = document.querySelector('#gl')
      c.style.opacity = 1
      let state = true
      document.body.addEventListener('click', (e) => {
        state ? textAnimate.out() : textAnimate.in()
        state = !state
      })
    }

    const l = new Loader(loadingAnim, 'webgl')
    l.init()
  }, 500)
})
