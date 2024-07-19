import '@blocknote/core/fonts/inter.css'

import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { db, IDocument } from '@/utils/db'
import { useLoaderData } from 'react-router-dom'
import { useCreateBlockNote } from '@blocknote/react'
import { useEffect, useRef } from 'react'

const Document = () => {
  const initialContentData = useLoaderData() as IDocument | null
  const titleRef = useRef<HTMLSpanElement>(null)

  const editor = useCreateBlockNote({
    initialContent: initialContentData?.content,
  })

  useEffect(() => {
    titleRef.current!.innerText = initialContentData?.name ?? ''
  }, [titleRef, initialContentData?.name])

  if (initialContentData == null) {
    return <div>Document not found</div>
  }

  const addContent = async () => {
    const currentContent = editor.document

    await db.document.update(initialContentData.id, { content: currentContent })
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLSpanElement>) => {
    const newName = e.target.innerText
    console.log({ newName })
    db.document.update(initialContentData.id, {
      name: newName,
    })
  }

  // Renders the editor instance using a React component.
  return (
    <div className="p-2">
      <h1 className="text-4xl">
        <span
          className="cursor-pointer"
          ref={titleRef}
          contentEditable
          onInput={handleChangeTitle}
        />
        : {initialContentData.id}
      </h1>
      <BlockNoteView editor={editor} onChange={addContent} />
    </div>
  )
}

export default Document
