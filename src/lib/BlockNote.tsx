import { FC } from 'react'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { BlockNoteView } from '@blocknote/mantine'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import {
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems,
} from '@blocknote/react'

interface IBlockNoteProps {
  onChange: (editor: BlockNoteEditor) => void
  initialContent?: PartialBlock[]
}

const BlockNote: FC<IBlockNoteProps> = ({ onChange, initialContent }) => {
  const editor = useCreateBlockNote({
    initialContent,
  })
  const handleChange = () => {
    onChange(editor)
  }

  return <BlockNoteView editor={editor} onChange={handleChange} />
}

export default BlockNote
