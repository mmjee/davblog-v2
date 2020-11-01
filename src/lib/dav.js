import { createClient } from 'webdav/web'

class DAVUtil {
  constructor () {
    this.client = createClient(
      '/dav'
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
