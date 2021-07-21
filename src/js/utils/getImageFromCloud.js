export const getImageFromCloud = (opts = {}) => {
  const width = opts.width ?? null
  const quality = opts.quality ?? null
  const format = opts.format ?? null

  const baseURL = opts.baseURL || console.error('base URL not found')
  const fileName = opts.fileName || console.error('fileName not found')

  const paramsArray = []

  if (width) {
    paramsArray.push(`c_scale,w_${width}`)
  }

  if (quality) {
    paramsArray.push(`q_${quality}`)
  }

  if (format) {
    paramsArray.push(`f_${format}`)
  }

  const params = paramsArray.length ? paramsArray.join(',') : ''

  return `${baseURL}/${params}/${fileName}`
}
