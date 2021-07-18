import gsap from 'gsap'
import CustomEase from 'gsap/dist/CustomEase'

gsap.registerPlugin(CustomEase)

export const ease = CustomEase.create(
  'custom',
  `M0,0 C0.097,0 
  0.151,0.006 0.186,0.019 
  0.227,0.034 0.255,0.045 
  0.288,0.078 0.367,0.157 
  0.46,0.355 0.502,0.504 
  0.551,0.679 0.594,0.816 
  0.654,0.882 0.726,0.961 
  0.734,1 1,1`,
)
