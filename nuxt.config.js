import GetCandyConfig from './getcandy.config'
require('dotenv').config()

export default {
  ssr: false,

  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: (titleChunk) => {
      // If undefined or blank then we don't need the hyphen
      return titleChunk ? `GetCandy // ${titleChunk} ` : 'GetCandy';
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'shortcut icon', type: 'image/png', href: '/favicon.png' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/css/app.scss',
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    //  '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/tailwindcss',
    ['@getcandy/js-client-nuxt', {
      "host": process.env.API_HOST
    }]
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    ['@getcandy/hub-products', {
      'preview_url': process.env.PRODUCT_PREVIEW_URL,
      'allow_variant_options': true
    }],
    ['@getcandy/hub-categories', {
      'preview_url': process.env.CATEGORY_PREVIEW_URL
    }],
    ['@getcandy/hub-collections', {
      'preview_url': process.env.COLLECTION_PREVIEW_URL
    }],
    '@getcandy/hub-orders',
    '@getcandy/hub-customers',
    '@getcandy/hub-shipping',
    '@getcandy/hub-reports',
    ['@getcandy/hub-core', {
      auth: 'sanctum'
    }]
  ],

  router: {
    middleware: ['auth', 'hub']
  },

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    baseURL: process.env.API_BASE,
    credentials: true,
    headers: {
      common: {
        'X-CANDY-HUB': true
      }
    }
  },

  /**
   * Auth module configuration
   * See https://auth.nuxtjs.org
   */
  auth: {
    strategies: {
      local: {
        _scheme: '@getcandy/hub-core/src/modules/sanctum-scheme.js',
        tokenRequired: false,
        tokenType: false,
        endpoints: {
          login: {
            url: process.env.AUTH_LOGIN_ENDPOINT,
            method: 'post',
            withCredentials: true,
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/json'
            }
          },
          logout: {
            url: process.env.AUTH_LOGOUT_ENDPOINT,
            method: 'post',
            withCredentials: true,
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/json'
            }
          },
          user: {
            url: process.env.AUTH_USER_ENDPOINT,
            method: 'get',
            propertyName: 'data',
            withCredentials: true,
            params: {
              includes: 'roles.permissions,customer'
            },
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/json'
            }
          }
        }
      }
    }
  },
  purgeCSS: {
    enabled: false
  },
  generate: {
    fallback: true
  },
  /*
  ** Build configuration
  */
  build: {
    transpile: [
      '@neondigital/vue-draggable-nested-tree',
      '@getcandy/node-client',
    ],
    postcss: {
      preset: {
        features: {
          // Fixes: https://github.com/tailwindcss/tailwindcss/issues/1190#issuecomment-546621554
          "focus-within-pseudo-class": false
        }
      }
    },
    extend(config, { isDev, isClient }) {
      config.resolve.alias["vue"] = "vue/dist/vue.common";
    }
  }
}
