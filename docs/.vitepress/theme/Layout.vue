<!-- Procedencia: plantilla skill site-web · Layout fanzine
     Fecha: 2026-07-22 · mundo=aleph-null
     N0-04: banner cabecera + footer marca+licencia (mínimo cableado).
     Home con piel real (stamp/washi/callout). Sin shell DefaultTheme. -->
<script setup>
import DefaultTheme from 'vitepress/theme'
import { useData, withBase } from 'vitepress'
import { computed } from 'vue'

const { Layout: DefaultLayout } = DefaultTheme
const { frontmatter } = useData()

/** Portada fanzine: layout home | piel:fanzine | layout:fanzine */
const isFanzineHome = computed(() => {
  const fm = frontmatter.value || {}
  return (
    fm.piel === 'fanzine' ||
    fm.layout === 'fanzine' ||
    (fm.layout === 'home' && fm.piel !== 'default')
  )
})

const bannerSrc = computed(() => withBase('/banner-fundacion-web.png'))
const licenciaHref = computed(() => withBase('/licencia'))
const footerText = computed(
  () => frontmatter.value?.footer || 'aleph-null · scriptorium'
)
</script>

<template>
  <div v-if="isFanzineHome" class="zine-shell">
    <div class="brand-banner" role="banner">
      <img
        :src="bannerSrc"
        alt="aleph-null · banner fundación"
        class="brand-banner__img"
        width="1190"
        height="auto"
      />
    </div>
    <header class="header">
      <div class="stamp">{{ frontmatter.stamp || 'ZINE' }}</div>
      <h1>{{ frontmatter.title || frontmatter.hero?.name || 'Portal' }}</h1>
      <div v-if="frontmatter.sub" class="sub">{{ frontmatter.sub }}</div>
      <div v-if="frontmatter.sub2" class="sub2">{{ frontmatter.sub2 }}</div>
      <div v-if="frontmatter.issue" class="issue">{{ frontmatter.issue }}</div>
    </header>
    <div class="washi" aria-hidden="true"></div>
    <div v-if="frontmatter.callout" class="callout tilt-r">
      {{ frontmatter.callout }}
    </div>
    <main class="zine-main">
      <Content />
    </main>
    <footer class="footer brand-footer">
      <span class="brand-footer__mark">{{ footerText }}</span>
      <span aria-hidden="true"> · </span>
      <a class="brand-footer__license" :href="licenciaHref">Licencia</a>
      <span aria-hidden="true"> · </span>
      <span class="brand-footer__spdx">GPL-3.0-or-later + Animus Iocandi</span>
    </footer>
  </div>
  <DefaultLayout v-else />
</template>
