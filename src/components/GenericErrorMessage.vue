<template>
  <section class="hero is-medium is-danger is-bold">
    <div class="hero-body">
      <div class="container">
        <h1 class="title">
          Oops!
        </h1>
        <h2 class="subtitle">
          Caught this error: <code>{{ errorMessage }}</code>
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'GenericErrorMessage',
  props: ['errorMessage']
}
</script>
