import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RootLayout from './RootLayout'
import Home from './Home'

const IndexRoutes = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default IndexRoutes
