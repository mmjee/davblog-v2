<template>
  <loading
      v-if="loading"
      :active.sync="loading"
      :can-cancel="false"
      :is-full-page="true"
  />
  <div v-else>
    <div class="box" v-for="page in data">
      <router-link :to="convFilenameToDAVURL(page[1].filename)">{{ genURL(page[1]) }}</router-link>
      <PageContent :html="page[0]" :attr="page[1]" :is-embedded="true" />
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
    <div class="columns">
      <div class="column"></div>
      <div class="column"></div>
      <div class="column">
        <label>
          <input class="input" type="number" v-model="inputPageNo" placeholder="Page" />
        </label>
      </div>
      <div class="column">
        <button class="button is-info" @click="inputPageNo < maxPagesPossible && inputPageNo > 0 ? goToPage(inputPageNo) : goToPage(maxPagesPossible)">Goto Page {{ inputPageNo }}</button>
      </div>
    </div>
  </div>
</template>

<script>
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
      data: null,

      inputPageNo: ''
    }
  },

  methods: {
    convFilenameToDAVURL (fn) {
      return fn.replace(/\/+/, '/').replace('.md', '')
    },

    genURL (page) {
      return window.location.origin + this.convFilenameToDAVURL(page.filename)
    },

    goToPage (pg) {
      this.$router.push({
        query: {
          page: pg
        }
      })
    },

    parseDatePortion (filename) {
      const parts = filename.split('-')
      if (parts.length <= 3) {
        // wow, invalid?
        return 0
      } else {
        return new Date(Number(parts[0]), Number(parts[1]), Number(parts[2]))
      }
    },

    async syncData () {
      // see files, determine the top 2 to display, after skipping page * 2
      const totalFiles = this.files.length

      const USQ = this.$route.query
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
  },

  computed: {
    pageNo () {
      const USQ = this.$route.query
      if (USQ.page) {
        return Number(USQ.page)
      }
      if (!Number.isFinite(USQ.page)) {
        return 1
      }
    },

    maxPagesPossible () {
      // not sure why - 1 but it's what it is
      return Number((this.files.length / 2).toFixed(0))
    }
  },

  watch: {
    $route: 'syncData'
  },
  async mounted () {
    await this.syncData()
  }
}
</script>
