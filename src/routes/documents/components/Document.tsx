import '@blocknote/core/fonts/inter.css'

import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/mantine/style.css'
import { db, IDocument } from '@/utils/db'
import { Link, useLoaderData } from 'react-router-dom'
import { useCreateBlockNote } from '@blocknote/react'
import { useEffect, useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

const Document = () => {
  const initialContentData = useLoaderData() as IDocument | null
  const [description, setDescription] = useState<string>(
    initialContentData?.description ?? '',
  )
  const titleRef = useRef<HTMLSpanElement>(null)

  const editor = useCreateBlockNote({
    initialContent: initialContentData?.content,
  })

  useEffect(() => {
    titleRef.current!.innerText = initialContentData?.title ?? ''
  }, [titleRef, initialContentData?.title])

  if (initialContentData == null) {
    return <div>Document not found</div>
  }

  const addContent = async () => {
    const currentContent = editor.document

    await db.document.update(initialContentData.id, { content: currentContent })
  }

  const handleChangeTitle = (e: React.ChangeEvent<HTMLSpanElement>) => {
    const newTitle = e.target.innerText
    db.document.update(initialContentData.id, {
      title: newTitle,
    })
  }

  const handleChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const newDescription = e.target.value
    setDescription(newDescription)
    db.document.update(initialContentData.id, {
      description: newDescription,
    })
  }

  // Renders the editor instance using a React component.
  return (
    <div className="p-2 flex flex-col gap-2">
      <div>
        <Button asChild variant="secondary">
          <Link to="/documents">Back to documents</Link>
        </Button>
      </div>
      <h1 className="text-4xl">
        <span
          className="cursor-pointer"
          ref={titleRef}
          contentEditable
          onInput={handleChangeTitle}
        />
        : {initialContentData.id}
      </h1>
      <div>
        <h4>Description</h4>
        <Textarea
          placeholder="Provide description of document"
          onChange={handleChangeDescription}
          value={description}
        />
      </div>
      <BlockNoteView editor={editor} onChange={addContent} />
    </div>
  )
}

export default Document
