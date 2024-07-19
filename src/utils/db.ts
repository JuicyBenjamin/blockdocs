import { PartialBlock } from '@blocknote/core'
import Dexie, { type EntityTable } from 'dexie'

interface IDocument {
  id: number
  content: PartialBlock[] | undefined
  name: string
}

const db = new Dexie('DocumentDatabase') as Dexie & {
  document: EntityTable<IDocument, 'id'>
}

// Schema declaration:
db.version(1).stores({
  document: '++id, name, content',
})

export type { IDocument }
export { db }
