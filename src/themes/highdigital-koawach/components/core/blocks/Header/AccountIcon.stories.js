import { storiesOf } from '@storybook/vue'
import AccountIcon from './AccountIcon'
import { action } from '@storybook/addon-actions'

console.log(23, AccountIcon)

storiesOf('Design System|Atoms/AccountIcon', module)
  .add('default', () => {
    return {
      components: { AccountIcon },
      template: `<div style="text-align: right;"><AccountIcon @goToAccount="this.onGoToAccount" /></div>`,
      data: () => ({}),
      methods: {
        onGoToAccount: action('goToAccount')
      }
    }
  })
