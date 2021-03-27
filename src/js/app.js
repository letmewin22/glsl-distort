/* eslint-disable max-len */

import cssWebP from '@/libs/testWebP'
import Scene from './Gl/Scene'
import {SmoothScroll} from '@emotionagency/smoothscroll'

cssWebP()
const imgs = document.querySelectorAll('.js-gl-img')
window.scene = new Scene('#gl', imgs)

new SmoothScroll()

// const view = document.querySelector('[data-scroll]')
// const r = rolly({
//   view,
//   native: false,
//   change(pos) {
//     window.scene && window.scene.updatePos(pos.current)
//   },
// })
// r.init()
