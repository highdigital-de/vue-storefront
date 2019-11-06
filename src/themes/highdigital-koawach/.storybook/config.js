import { configure , addDecorator} from '@storybook/vue';
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { withContexts } from 'addon-contexts/vue';

Vue.use(VueI18n)

const i18n = new VueI18n()
const localeContext = {
  name: 'I18NProvider',
  props: ['locale'],
  watch: {
    locale: function(newValue) {
      this.$root.$i18n.locale = newValue;
    }
  },
  i18n,
  beforeCreate: function() {
    this.$root._i18n = this.$i18n;
  },
  template: '<div><slot /></div>',
};
const topLevelContexts = [
  {
    icon: 'globe',
    title: 'Locale',
    components: [localeContext],
    params: [
      {
        name: 'English',
        props: {
          locale: 'en'
        },
        default: true,
      },
      {
        name: 'Deutsch',
        props: {
          locale: 'de'
        },
      },
    ],
  },
];
addDecorator(withContexts(topLevelContexts));

const req = require.context('../components', true, /\.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);