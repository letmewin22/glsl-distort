import cssWebP from '@/libs/testWebP'
import Scene from './Gl2/Scene'
import {SmoothScroll} from '@emotionagency/smoothscroll'

cssWebP()
const imgs = document.querySelectorAll('.js-gl-img')
window.addEventListener('load', () => {
  new SmoothScroll()
  setTimeout(() => {
    window.scene = new Scene('#gl', imgs)
  }, 500)
})
