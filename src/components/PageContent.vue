<template>
  <div class="container content mt-4 mb-4">
    <div>
      <p>Last Modified: {{ localizedModified }}</p>
    </div>
    <div v-html="html" />
    <Disqus v-if="isEmbedded !== true" />
  </div>
</template>

<script>
export default {
  name: 'PageContent',
  props: ['html', 'attr', 'isEmbedded'],

  methods: {
    localizeDate (dt) {
      const date = new Date(dt)
      const dtAPI = new Intl.DateTimeFormat([], {
        dateStyle: 'full',
        timeStyle: 'full',
        hour12: true
      })

      return dtAPI.format(date)
    }
  },

  computed: {
    localizedModified () {
      return this.localizeDate(this.attr.lastmod)
    }
  }
}
</script>
