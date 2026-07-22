// PORT look familia-vp · shell DefaultTheme (DA-S18 / WP-REST-SHELL).
// Visual = codebase/z-sdk/docs · banner en shell = patrón o-sdk (layout-top).
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'
import Banner from './Banner.vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'layout-top': () => h(Banner)
    })
  }
}
