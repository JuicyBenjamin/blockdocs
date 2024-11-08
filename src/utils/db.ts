import { FormBlockType } from '@/routes/GenerateBlocks/GenerateBlocks'
import { PartialBlock } from '@blocknote/core'
import Dexie, { type EntityTable } from 'dexie'
import { Tag } from 'emblor'

interface IDocument {
  id: number
  title: string
  description: string
  content: PartialBlock[] | undefined
}

interface ICustomBlock {
  id: number
  label: string
  type: FormBlockType
  isRequired: boolean
  options: Tag[]
  placeholder: string
  isInputMask: boolean
  mask: string
  replacement: string
  isMaskNumber: boolean
  isShowMask: boolean
}

const db = new Dexie('DocumentDatabase') as Dexie & {
  document: EntityTable<IDocument, 'id'>
  customBlock: EntityTable<ICustomBlock, 'id'>
}

// Schema declaration:
db.version(1).stores({
  document: '++id, title, description, content',
  customBlock:
    '++id, label, type, isRequired, options, placeholder, isInputMask, mask, replacement, isMaskNumber, isShowMask',
})

export type { IDocument }
export { db }
