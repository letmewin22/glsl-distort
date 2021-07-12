import cssWebP from '@/libs/testWebP'
import Scetch from './dom-gl/Scetch'
import Figure from './Gl2/Figure'
import {SmoothScroll} from '@emotionagency/smoothscroll'

cssWebP()
const imgs = document.querySelectorAll('.js-gl-img')
window.addEventListener('load', () => {
  setTimeout(() => {
    new SmoothScroll()
    window.scetch = new Scetch('#gl', imgs, {Figure})
  }, 500)
})
