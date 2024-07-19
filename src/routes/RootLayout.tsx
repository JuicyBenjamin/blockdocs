import { Outlet } from 'react-router'

const RootLayout = () => {
  return (
    <main className="grid p-4 justify-center">
      <Outlet />
    </main>
  )
}

export default RootLayout
