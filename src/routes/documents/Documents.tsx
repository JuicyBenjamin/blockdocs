import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/utils/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { Link, useNavigate } from 'react-router-dom'

const Documents = () => {
  const navigate = useNavigate()
  const documents = useLiveQuery(() => db.document.toArray())

  const handleClick = async () => {
    const documentId = await db.document.add({
      title: 'Untitled',
      description: 'No description provided',
      content: undefined,
    })
    navigate(`/documents/${documentId}`)
  }

  return (
    <div className="grid gap-2">
      {documents?.map((document) => (
        <Link key={document.id} to={`/documents/${document.id}`}>
          <Card>
            <CardHeader>
              <CardTitle>{document.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{document.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
      <Card className="cursor-pointer" onClick={handleClick}>
        <CardHeader>
          <CardTitle>Create new document</CardTitle>
        </CardHeader>
        <CardContent>
          <p>+</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Documents
