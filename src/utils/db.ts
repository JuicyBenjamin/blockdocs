import { PartialBlock } from '@blocknote/core'
import Dexie, { type EntityTable } from 'dexie'

interface IDocument {
  id: number
  title: string
  description: string
  content: PartialBlock[] | undefined
}

const db = new Dexie('DocumentDatabase') as Dexie & {
  document: EntityTable<IDocument, 'id'>
}

// Schema declaration:
db.version(1).stores({
  document: '++id, title, description, content',
})

export type { IDocument }
export { db }
