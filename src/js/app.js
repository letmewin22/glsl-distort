import cssWebP from '@/libs/testWebP'
import Scene from './Gl/Scene'
import {SmoothScroll} from '@emotionagency/smoothscroll'

cssWebP()
// const imgs = document.querySelectorAll('.js-gl-img')
;(window.scene = new Scene('#gl', document.querySelectorAll('.js-gl-img'))),
new SmoothScroll()
