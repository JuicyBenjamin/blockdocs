import { Dispatch, FC, useState } from 'react'

import { Label } from '@/components/ui/label'
import { Tag, TagInput } from 'emblor'

interface AddOptionsProps {
  options: Tag[]
  onValueChange: Dispatch<React.SetStateAction<Tag[]>>
}

const AddOptions: FC<AddOptionsProps> = ({ options, onValueChange }) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="options">Options:</Label>
      <TagInput
        id="options"
        placeholder="Add options..."
        tags={options}
        setTags={(newTags) => {
          onValueChange(newTags)
        }}
        activeTagIndex={activeTagIndex}
        setActiveTagIndex={setActiveTagIndex}
      />
    </div>
  )
}

export default AddOptions
