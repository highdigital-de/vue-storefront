import { storiesOf } from '@storybook/vue'
import AccountIcon from './AccountIcon'

console.log(23, AccountIcon)

storiesOf('Design System|Atoms/AccountIcon', module)
  .add('default', () => {
    return {
      components: { AccountIcon },
      template: `<div style="text-align: right;"><AccountIcon /></div>`,
      data: () => ({})
    }
  })
