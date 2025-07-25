import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.800}',
          activeColor: '{zinc.800}',
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{zinc.50}',
          inverseColor: '{zinc.950}',
          hoverColor: '{zinc.200}',
          activeColor: '{zinc.200}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
  components: {
    card: {
      colorScheme: {
        light: {
          root: {
            // background: '{surface.50}',
            // shadow: 'none'
          },
          body: {
            padding: '2rem',
          },
        },
        // dark: {
        //   root: {
        //     background: '{surface.950}',
        //   },
        // }
      },
    },
    // inputtext: {
    //   colorScheme: {
    //     dark: {
    //       root: {
    //         background: '{surface.700}',
    //       },
    //     }
    //   }
    // }
    breadcrumb: {
      colorScheme: {
        light: {
          root: {
            background: 'transparent',
          },
        },
      },
    },
  },
})

export default Noir
