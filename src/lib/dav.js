import { createClient } from 'webdav/web'

class DAVUtil {
  constructor () {
    const baseURL = `https://dav.${window.location.host}`

    this.client = createClient(
      baseURL
    )
  }

  listPages (path) {
    return this.client.getDirectoryContents('/' + path)
  }

  getPage (filename) {
    return this.client.getFileContents('/' + filename, { format: 'text' })
  }

  statFile (filename) {
    return this.client.stat('/' + filename)
  }
}

const du = new DAVUtil()
export {
  du as DAVUtil
}
