import { Outlet } from 'react-router'
import { Link } from 'react-router-dom'

const RootLayout = () => {
  return (
    <>
      <header className="p-4">
        <Link to="/">
          <h3>Block Docs</h3>
        </Link>
      </header>
      <main className="flex flex-col p-4 justify-center">
        <Outlet />
      </main>
    </>
  )
}

export default RootLayout
