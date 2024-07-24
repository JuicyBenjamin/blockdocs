import { Tag, TagInput } from 'emblor'
import { Dispatch, FC, useState } from 'react'

interface AddOptionsProps {
  options: Tag[]
  onValueChange: Dispatch<React.SetStateAction<Tag[]>>
}

const AddOptions: FC<AddOptionsProps> = ({ options, onValueChange }) => {
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null)

  return (
    <TagInput
      placeholder="Add options..."
      tags={options}
      setTags={(newTags) => {
        onValueChange(newTags)
      }}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
    />
  )
}

export default AddOptions
