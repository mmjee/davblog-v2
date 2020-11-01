<template>
  <loading
      v-if="loading"
      :active.sync="loading"
      :can-cancel="false"
      :is-full-page="true"
  />
  <div v-else>
    <div class="box" v-for="page in data">
      <a :href="genURL(page[1])" class="link"><code>{{ genURL(page[1]) }}</code></a>
      <PageContent :html="page[0]" :attr="page[1]" :disable-disqus="true" />
    </div>
    <nav class="pagination" role="navigation" aria-label="pagination">
      <a class="pagination-previous" v-on:click="goToPage(pageNo - 1)" v-if="(pageNo - 1) > 0">Previous</a>
      <a class="pagination-next" v-on:click="goToPage(pageNo + 1)" v-if="(pageNo + 1) < maxPagesPossible">Next page</a>
      <ul class="pagination-list">
        <!-- for no 2 it'll be displayed in the next column anyway -->
        <li v-if="pageNo !== 1 && pageNo !== 2">
          <a class="pagination-link" aria-label="Goto page 1" v-on:click="goToPage(1)">1</a>
        </li>
        <li v-if="pageNo !== 1 && pageNo !== 2">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="(pageNo - 1) > 0">
          <a class="pagination-link" :aria-label="'Goto page ' + (pageNo - 1)" v-on:click="goToPage(pageNo - 1)">{{ pageNo - 1}}</a>
        </li>
        <li>
          <a class="pagination-link is-current" :aria-label="'Page ' + pageNo" aria-current="page">{{ pageNo }}</a>
        </li>
        <li v-if="(pageNo + 1) < maxPagesPossible">
          <a class="pagination-link" :aria-label="'Goto page ' + (pageNo + 1)" v-on:click="goToPage(pageNo + 1)">{{ pageNo + 1}}</a>
        </li>
        <li v-if="pageNo !== maxPagesPossible">
          <span class="pagination-ellipsis">&hellip;</span>
        </li>
        <li v-if="pageNo !== maxPagesPossible">
          <a class="pagination-link" :aria-label="'Goto page ' + maxPagesPossible" v-on:click="goToPage(maxPagesPossible)">{{ maxPagesPossible }}</a>
        </li>
      </ul>
    </nav>
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

    goToPage (pg) {
      const USQ = window.location.search ? qs.parse(window.location.search, { ignoreQueryPrefix: true }) : {}

      USQ.page = pg
      const nu = new URL(window.location.href)
      nu.search = '?' + qs.stringify(USQ)
      window.location.href = nu.href
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

  computed: {
    pageNo () {
      const USQ = window.location.search ? qs.parse(window.location.search, { ignoreQueryPrefix: true }) : {}
      if (USQ.page) {
        USQ.page = Number(USQ.page)
      }
      if (!Number.isFinite(USQ.page)) {
        USQ.page = 1
      }

      return USQ.page
    },

    maxPagesPossible () {
      // not sure why - 1 but it's what it is
      return Number(((this.files.length - 1) / 2).toFixed(0))
    }
  },

  async mounted () {
    // see files, determine the top 2 to display, after skipping page * 2
    const totalFiles = this.files.length

    const USQ = window.location.search ? qs.parse(window.location.search, { ignoreQueryPrefix: true }) : {}
    let skip = 0
    if (USQ.page) {
      skip = Number(USQ.page - 1) * PAGESIZE
    }
    if (!Number.isFinite(skip)) {
      skip = 0
    }

    if ((PAGESIZE + skip) > totalFiles) {
      skip = 0
    }

    // sort
    const sortedFiles = this.files.sort((a, b) => {
      return this.parseDatePortion(b.basename).valueOf() - this.parseDatePortion(a.basename).valueOf()
    })
    const files = sortedFiles.slice(skip, skip + 2)

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
