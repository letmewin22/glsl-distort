/* eslint-disable max-len */
import cssWebP from '@/libs/testWebP'
import {Scetch} from '@emotionagency/glhtml'
import Images from './GL9/Images/Images'
import Colors from './GL9/Colors/Colors'
import Noisy from './GL2/Noisy/Noisy'
import {SmoothScroll} from '@emotionagency/smoothscroll'
import {raf} from '@emotionagency/utils'

cssWebP()
const imgs = [...document.querySelectorAll('.js-gl-img')]
const noisy = document.querySelector('.noisy')
const colors = document.querySelector('.bg')

let nodes = imgs.map((img) => ({
  $el: img,
  Figure: Images,
}))

nodes = [
  ...nodes,
  {
    $el: noisy,
    Figure: Noisy,
  },
]

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
      ],
      raf,
    })
    // window.scetch = new Scene('#gl', imgs)
  }, 500)
})
