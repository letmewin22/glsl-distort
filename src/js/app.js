import cssWebP from '@/libs/testWebP'
import Scene from './dom-gl/Scene'
import Figure from './Gl2/Figure'
import {SmoothScroll} from '@emotionagency/smoothscroll'

cssWebP()
const imgs = document.querySelectorAll('.js-gl-img')
window.addEventListener('load', () => {
  new SmoothScroll()
  window.scene = new Scene('#gl', imgs, {Figure})
})
