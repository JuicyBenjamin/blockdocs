import { PartialBlock } from '@blocknote/core'
import Dexie, { type EntityTable } from 'dexie'

interface Editor {
  id: number
  content: PartialBlock[]
}

const db = new Dexie('DocumentDatabase') as Dexie & {
  editor: EntityTable<Editor, 'id'>
}

// Schema declaration:
db.version(1).stores({
  editor: '++id, content',
})

export type { Editor }
export { db }
