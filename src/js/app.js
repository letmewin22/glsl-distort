import cssWebP from '@/libs/testWebP'
import Scetch from './dom-gl/Scetch'
// import Scene from './GL/Scene'
import Images from './GL2/Images/Images'
import Text from './dom-gl/Text'
import Noisy from './GL2/Noisy/Noisy'
import {SmoothScroll} from '@emotionagency/smoothscroll'
// import './text'

cssWebP()
const imgs = [...document.querySelectorAll('.js-gl-img')]
const text = [...document.querySelectorAll('.img-text')]
const noisy = document.querySelector('.noisy')

let nodes = imgs.map((img) => ({
  $el: img,
  Figure: Images,
}))

const textNodes = text.map((t) => ({
  $el: t,
  Figure: Text,
}))

nodes = [
  ...nodes,
  {
    $el: noisy,
    Figure: Noisy,
  },
  ...textNodes,
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
