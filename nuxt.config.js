export default {
  // Server configuration
  server: {
    port: 8000,
  },

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Tags',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '@/assets/main.css',
    '@/assets/scrollbar.css',
    '@/assets/virtual-scroll.css',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: '~/plugins/infiniteloading', ssr: false },
    { src: '~/plugins/virtualscroller', ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['@nuxtjs/apollo'],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          test: /\.worker\.js$/,
          loader: 'worker-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },

  ssr: false,
  // Apollo configuration
  apollo: {
    clientConfigs: {
      default: {
        httpEndpoint: process.env.GRAPHQL_ENDPOINT,
        wsEndpoint: process.env.GRAPHQL_WS_ENDPOINT,
      },
    },
  },

  env: {
    graphqlHttpEndPoint: process.env.GRAPHQL_ENDPOINT,
    graphqlWsEndpoint: process.env.GRAPHQL_WS_ENDPOINT,
  },
};
