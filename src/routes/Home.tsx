import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="flex gap-2">
      <Button asChild>
        <Link to="/documents">List of documents</Link>
      </Button>
      <Button asChild>
        <Link to="/blocks">List of created block elemenets</Link>
      </Button>
      <Button asChild>
        <Link to="/form-flows">List of all form flows generated</Link>
      </Button>
    </div>
  )
}

export default Home
