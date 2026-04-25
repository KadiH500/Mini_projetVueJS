<template>
  <section class="page">
    <!-- titre mta3 page -->
    <h1>Book Details</h1>

    <!-- n'affichi id mta3 lbook li jé mel route -->
    <p>Selected book ID: {{ $route.params.id }}</p>

    <!-- message temporaire (placeholder) 7atta na3mlou page detail kima yelzem-->
    <p>This page is a placeholder for a detailed book view.</p>
  </section>
</template>

<style scoped>
/* style mta3 container principal */
.page {
  max-width: 900px; /* largeur max */
  margin: 0 auto; /* centrage */
  padding: 32px 20px; /* espace interne */
}
</style>