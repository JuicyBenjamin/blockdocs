import { defaultProps } from '@blocknote/core'
import { createReactBlockSpec } from '@blocknote/react'

const InsertBlock = createReactBlockSpec(
  {
    type: 'alert',
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: 'warning',
        values: ['warning', 'error', 'info', 'success'],
      },
    },
    content: 'inline',
  },
  {
    render: () => <div>InsertBlock</div>,
  },
)

export default InsertBlock
