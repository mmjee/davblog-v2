<template>
  <loading
      v-if="loading"
      :active.sync="loading"
      :can-cancel="false"
      :is-full-page="true"
  />
  <div v-else>
    <div class="box" v-for="page in data">
      <a :href="genURL(page[1])"><code>{{ genURL(page[1]) }}</code></a>
      <PageContent :html="page[0]" :attr="page[1]" :disable-disqus="true" />
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import marked from 'marked'
import Loading from 'vue-loading-overlay'

import { DAVUtil } from '../lib/dav'
import PageContent from '../components/PageContent'

const PAGESIZE = 2

export default {
  name: 'DirectoryBasedListing',
  props: ['files'],
  components: {
    Loading,
    PageContent
  },

  data () {
    return {
      loading: true,
      data: null
    }
  },

  methods: {
    genURL (page) {
      return window.location.origin + page.filename.replace(/\/+/, '/').replace('.md', '')
    },

    parseDatePortion (filename) {
      const parts = filename.split('-')
      if (parts.length <= 3) {
        // wow, invalid?
        return 0
      } else {
        return new Date(Number(parts[0]), Number(parts[1]), Number(parts[2]))
      }
    }
  },

  async mounted () {
    // see files, determine the top 2 to display, after skipping page * 2
    const totalFiles = this.files.length

    const USQ = window.location.search ? qs.parse(window.location.search, { ignoreQueryPrefix: true }) : {}
    let skip = 0
    if (USQ.page) {
      skip = Number(USQ.page) * PAGESIZE
    }
    if (!Number.isFinite(skip)) {
      skip = 0
    }

    if ((PAGESIZE + skip) > totalFiles) {
      skip = 0
    }

    // sort
    const files = this.files.sort((a, b) => {
      return this.parseDatePortion(b.basename).valueOf() - this.parseDatePortion(a.basename).valueOf()
    }).slice(skip, 2)

    // I would not really expect any error here. 404 is impossible since the data is sent by the server itself
    // And any network error or something is beyond our scope right now.
    const fdata = await Promise.all(files.map(f => {
      return Promise.all([DAVUtil.getPage(f.filename).then(d => marked(d)), DAVUtil.statFile(f.filename)])
    }))
    this.loading = false
    this.data = fdata
  }
}
</script>
