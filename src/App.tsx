import { useEffect, useMemo, useState } from 'react'
import '@blocknote/core/fonts/inter.css'

import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { db } from './utils/db'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'

const getContent = async () => {
  const data = await db.editor.get({ id: 1 })
  console.log({ data })
  if (data == null) {
    return null
  }
  return data.content as PartialBlock[]
}

const createContent = async () => {
  const editorId = await db.editor.add({
    id: 1,
    content: [
      {
        id: 'ma mana',
        content: 'Hello, world!',
      },
    ],
  })
  console.log({ editorId })
}

export default function App() {
  const [initialContent, setInitialContent] = useState<
    PartialBlock[] | undefined | 'loading'
  >('loading')

  useEffect(() => {
    getContent().then((content) => {
      console.log({ content })

      if (content == null) {
        createContent()
        setInitialContent([])
      } else {
        setInitialContent(content)
      }
    })
  }, [])

  // Creates a new editor instance.
  // We use useMemo + createBlockNoteEditor instead of useCreateBlockNote so we
  // can delay the creation of the editor until the initial content is loaded.
  const editor = useMemo(() => {
    if (initialContent === 'loading') {
      return undefined
    }
    return BlockNoteEditor.create({
      initialContent: initialContent,
    })
  }, [initialContent])

  if (editor == null) {
    return 'Loading content...'
  }
  const addContent = async () => {
    const currentContent = editor.document

    await db.editor.put({ id: 1, content: currentContent })
  }

  // Renders the editor instance using a React component.
  return (
    <div className="p-2">
      <h1 className="text-4xl">Block Docs</h1>
      <BlockNoteView editor={editor} onChange={addContent} />
    </div>
  )
}
