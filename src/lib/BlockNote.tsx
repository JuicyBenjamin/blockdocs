import { FC } from 'react'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { BlockNoteView } from '@blocknote/mantine'
import {
  BlockNoteEditor,
  BlockNoteSchema,
  defaultBlockSpecs,
  filterSuggestionItems,
  insertOrUpdateBlock,
  PartialBlock,
} from '@blocknote/core'
import {
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react'
import InsertBlock from '@/components/InsertBlock'

const schema = BlockNoteSchema.create({
  blockSpecs: {
    // Adds all default blocks.
    ...defaultBlockSpecs,
    // Adds the Alert block.
    alert: InsertBlock,
  },
})

export type blockEditorSchema = typeof schema.BlockNoteEditor

const insertAlert = (editor: typeof schema.BlockNoteEditor) => ({
  title: 'Alert',
  onItemClick: () => {
    insertOrUpdateBlock(editor, {
      type: 'alert',
    })
  },
  aliases: [
    'alert',
    'notification',
    'emphasize',
    'warning',
    'error',
    'info',
    'success',
  ],
  group: 'Other',
  // icon: <RiAlertFill />,
})

interface IBlockNoteProps {
  onChange: (editor: blockEditorSchema) => void
  initialContent?: PartialBlock[]
}

const BlockNote: FC<IBlockNoteProps> = ({ onChange, initialContent }) => {
  const editor = useCreateBlockNote({
    schema,
    initialContent,
  })
  const handleChange = () => {
    onChange(editor)
  }

  return (
    <BlockNoteView editor={editor} onChange={handleChange}>
      <SuggestionMenuController
        triggerCharacter={'/'}
        getItems={async (query) =>
          // Gets all default slash menu items and `insertAlert` item.
          filterSuggestionItems(
            [...getDefaultReactSlashMenuItems(editor), insertAlert(editor)],
            query,
          )
        }
      />
    </BlockNoteView>
  )
}

export default BlockNote
