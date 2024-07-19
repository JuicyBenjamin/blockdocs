import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <Link to="/documents">List of documents</Link>
      <Link to="/blocks">List of created block elemenets</Link>
      <Link to="/form-flows">List of all form flows generated</Link>
    </div>
  )
}

export default Home
