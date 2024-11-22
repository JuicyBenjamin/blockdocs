import { TFormBlock } from '@/routes/Blocks/components/GenerateBlocks/GenerateBlocks'
import { PartialBlock } from '@blocknote/core'
import Dexie, { type EntityTable } from 'dexie'

interface IDocument {
  id: number
  title: string
  description: string
  content: PartialBlock[] | undefined
}

type TExtendedFormBlock = TFormBlock & {
  id: number
}

const db = new Dexie('DocumentDatabase') as Dexie & {
  document: EntityTable<IDocument, 'id'>
  customBlock: EntityTable<TExtendedFormBlock, 'id'>
}

// Schema declaration:
db.version(1).stores({
  document: '++id, title, description, content',
  customBlock:
    '++id, label, type, isRequired, options, placeholder, isInputMask, mask, replacement, isMaskNumber, isShowMask',
})

export type { IDocument }
export { db }
