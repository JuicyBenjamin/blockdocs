import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { db } from '@/utils/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router'
import { Link } from 'react-router-dom'

const Blocks = () => {
  const navigate = useNavigate()
  const blocks = useLiveQuery(() => db.customBlock.toArray())

  const handleClick = async () => {
    const blockId = await db.customBlock.add({
      type: 'input',
      isRequired: false,
      options: [],
      label: '',
      placeholder: '',
      isInputMask: false,
      mask: '',
      replacement: '',
      isMaskNumber: false,
      isShowMask: false,
    })
    navigate(`/blocks/${blockId}`)
  }

  return (
    <div className="grid gap-2">
      {blocks?.map((block) => (
        <Link key={block.id} to={`/blocks/${block.id}`}>
          <Card>
            <CardHeader>
              <CardTitle>{`${block.label} (Id: ${block.id})`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{block.label}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
      <Card className="cursor-pointer" onClick={handleClick}>
        <CardHeader>
          <CardTitle>Create new Block</CardTitle>
        </CardHeader>
        <CardContent>
          <p>+</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Blocks
