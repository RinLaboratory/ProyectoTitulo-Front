/**
 *
 * @param {string} url
 * @param {Object} data
 * @returns {Object}
 */
export default async function postFile(url, data) {
    const formData = new FormData()
    formData.append('archivo', data)

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'content-length': `${data.size}`
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: formData,
    })
    return response.json()
  }
  