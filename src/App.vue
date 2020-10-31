<script>
import marked from 'marked'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

// Custom
import { DAVUtil } from './lib/dav'

export default {
  name: 'App',
  components: {
    Loading
  },
  data () {
    return {
      loading: false,
      data: null
    }
  },

  async created () {
    this.loading = false
    this.data = marked('# HI\n\nMasonry Road.')

    const v = await DAVUtil.listPages()
    debugger
  }
}
</script>

<template>
  <div v-if="loading">
    <loading :active.sync="loading"
             :can-cancel="false"
             :is-full-page="true" />
  </div>
  <div v-else v-html="data" class="content" />
</template>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&family=Raleway&display=swap');
  .content {
    font-family: 'Poppins', sans-serif;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Raleway', sans-serif;
  }

  @media only screen and (min-width: 720px)  {
    .content {
      padding-left: 20vw;
      padding-right: 20vw;
    }
  }
</style>
