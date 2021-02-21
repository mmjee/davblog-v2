import { createClient } from 'webdav/web'

class DAVUtil {
  constructor () {
    const baseURL = `https://dav.${window.location.host}`

    this.client = createClient(
      process.env.NODE_ENV === 'development' ? '/dav' : baseURL
    )
  }

  listPages (path) {
    return this.client.getDirectoryContents('/' + path)
  }

  getPage (filename) {
    return this.client.getFileContents('/' + filename, { format: 'text' })
  }

  async getJSON (filename) {
    return JSON.parse(await this.client.getFileContents('/' + filename, {
      format: 'text'
    }))
  }

  statFile (filename) {
    return this.client.stat('/' + filename)
  }
}

const du = new DAVUtil()
export {
  du as DAVUtil
}
