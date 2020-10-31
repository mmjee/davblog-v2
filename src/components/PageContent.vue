<template>
  <div class="container content mt-4">
    <div>
      Last Modified: {{ localizedDT }}
    </div>
    <div v-html="html" />
  </div>
</template>

<script>
export default {
  name: 'PageContent',
  props: ['html', 'attr'],

  computed: {
    localizedDT () {
      const date = new Date(this.attr.lastmod)
      const dtAPI = new Intl.DateTimeFormat([], {
        dateStyle: 'full',
        timeStyle: 'full',
        hour12: true
      })

      return dtAPI.format(date)
    }
  }
}
</script>
