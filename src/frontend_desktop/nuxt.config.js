import colors from 'vuetify/es5/util/colors'

export default {
  loading: '~/components/loading.vue',
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - penhwang_frontend_desktop',
    title: 'penhwang_frontend_desktop',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {src: "~/plugins/vue2-google-maps.js"}
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    '@nuxtjs/dotenv',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    // '@nuxtjs/pwa',
    // '@nuxtjs/firebase'
  ],
  // firebase: {
  //   services: {
  //     auth: {
  //       ssr: true
  //     }
  //   }
  // },
  pwa: {
    // disable the modules you don't need
    meta: false,
    icon: false,
    // if you omit a module key form configuration sensible defaults will be applied
    // manifest: false,

    workbox: {
      importScripts: [
        // ...
        '/firebase-auth-sw.js'
      ],
      // by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
      // only set this true for testing and remember to always clear your browser cache in development
      dev: process.env.NODE_ENV === 'development',
    }
  },
  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},
  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      themes: {
        light: {
          primary: colors.brown.darken1,
          accent: colors.grey.darken3,
          secondary: colors.brown.darken1,
          info: colors.lightBlue.darken1,
          warning: colors.amber.darken1,
          error: colors.deepOrange.darken2,
          success: colors.green.darken1,
          purple: colors.purple.lighten2,
          lightBrown: colors.brown.darken1
        }
      }
    }
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    vendor: ["vue2-google-maps"]
  }
}
