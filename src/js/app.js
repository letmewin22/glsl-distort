import cssWebP from '@/libs/testWebP'
import Scetch from './dom-gl/Scetch'

import Images from './GL2/Images/Images'
import Noisy from './GL2/Noisy/Noisy'
import {SmoothScroll} from '@emotionagency/smoothscroll'

cssWebP()
const imgs = [...document.querySelectorAll('.js-gl-img')]
const noisy = document.querySelector('.noisy')

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
    new SmoothScroll()
    window.scetch = new Scetch('#gl', {
      nodes,
    })
    // window.scetch = new Scene('#gl', imgs)
  }, 500)
})
