import { createClient } from 'webdav/web'

class DAVUtil {
  constructor () {
    this.client = createClient(
      '/dav'
    )
  }

  listPages () {
    return this.client.getDirectoryContents('/')
  }

  ge
}
const du = new DAVUtil()
export {
  du as DAVUtil
}
