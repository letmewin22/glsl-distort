import SplitType from 'split-type'
import gsap from 'gsap'

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const textAnimate = () => {
  const h1 = document.querySelector('.h1')

  const text = new SplitType(h1, {types: 'words, chars', tagName: 'span'})

  text.chars.forEach((char) => {
    char.innerHTML = `<span class="char-inner">${char.innerHTML}</span>`
  })

  let $toAnimate = [...document.querySelectorAll('.char-inner')]
  $toAnimate = shuffle($toAnimate)

  return {
    in: () => {
      h1.style.opacity = 1

      gsap.to($toAnimate, {
        duration: 1,
        y: '0%',
        scaleY: 1,
        opacity: 1,
        ease: 'expo.out',
        stagger: 0.02,
        overwrite: true,
      })
    },
    out: () => {
      gsap.to($toAnimate, {
        duration: 1,
        y: '110%',
        scaleY: 1.4,
        opacity: 0,
        ease: 'expo.out',
        stagger: 0.01,
        overwrite: true,
      })
    },
  }
}

export default textAnimate()
