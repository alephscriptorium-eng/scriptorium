<!-- Banner en shell · patrón o-sdk (slot layout-top). Asset N0/WP-XS conservado. -->
<script setup>
import { withBase } from 'vitepress'
const src = withBase('/banner-scriptorium-web.png')
</script>

<template>
  <div class="brand-banner-shell" role="banner">
    <img
      :src="src"
      alt="aleph-null · banner scriptorium"
      class="brand-banner-shell__img"
      width="1190"
      height="220"
    />
  </div>
</template>
