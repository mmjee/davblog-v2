<script>
import marked from 'marked'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

// Custom
import { DAVUtil } from './lib/dav'
import FourZeroFour from './components/FourZeroFour'
import GenericErrorMessage from './components/GenericErrorMessage'
import PageContent from './components/PageContent'
import DirectoryBasedListing from './components/DirectoryBasedListing'

export default {
  name: 'App',
  components: {
    Loading,
    FourZeroFour,
    GenericErrorMessage,
    PageContent,
    DirectoryBasedListing
  },
  data () {
    return {
      loading: true,
      errored: false,
      errorMessage: null,

      // Main stuff
      attr: null,
      data: null,
      navhtml: null
    }
  },

  methods: {
    async getFile (fullFN, isDir) {
      let v
      try {
        if (isDir) {
          v = await DAVUtil.listPages(fullFN)
        } else {
          v = await DAVUtil.getPage(fullFN)
        }
        return v
      } catch (e) {
        if (e.isAxiosError && e.response.status === 404) {
          this.errored = 404
        } else {
          this.errored = true
          this.errorMessage = e.message
        }
      }
    },

    async getAttrs (fullFN) {
      // silently fail if request fails, assuming getPage will set error data instead
      try {
        this.attr = await DAVUtil.statFile(fullFN)
      } catch (e) {
        console.warn('Caught error while stat\'ng file', e)
        this.stat = {
          lastmod: null
        }
      }
    }
  },

  async created () {
    let isDir = false

    let filenameParts = window.location.pathname.split('/').slice(1)
    // handle /
    if (filenameParts.length === 1 && filenameParts[0].length === 0) {
      filenameParts = ['index.md']
    // normal file, not a directory
    } else if (filenameParts[filenameParts.length - 1].length !== 0) {
      filenameParts[filenameParts.length - 1] += '.md'
    } else {
      isDir = true
    }

    const fullFN = filenameParts.join('/')

    const v = await Promise.all([
      this.getFile(fullFN, isDir),
      this.getAttrs(fullFN),
      this.getFile('navigation.html')
    ])

    const pathname = window.location.pathname

    document.title = 'DAVBlog: ' + (pathname === '/' ? 'Index' : pathname)
    this.loading = false
    this.data = v[0] && !isDir ? marked(v[0]) : v[0]
    this.navhtml = v[2]
  }
}
</script>

<template>
  <div class="App">
    <div v-html="navhtml" />
    <loading
        v-if="loading"
        :active.sync="loading"
        :can-cancel="false"
        :is-full-page="true"
    />
    <FourZeroFour v-else-if="errored === 404" />
    <GenericErrorMessage v-else-if="errored === true" :error-message="errorMessage" />
    <DirectoryBasedListing v-else-if="attr.type === 'directory'" :files="data" />
    <PageContent v-else :html="data" :attr="attr" />
  </div>
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&family=Raleway&display=swap');
  .content {
    font-family: 'Poppins', sans-serif;
    font-size: 1.125rem;
  }

  .content a, .link {
    color: black;
    text-decoration: underline;
    text-decoration-style: dashed;
    text-decoration-width: 2px;
    text-decoration-thickness: 2px;
    text-decoration-color: mediumvioletred;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Raleway', sans-serif;
  }

  .App {
    background: linear-gradient(0deg, rgba(156,18,222,0.15) 0%, rgba(255,255,255,0) 100%);
    min-height: 100vh;
  }
</style>
