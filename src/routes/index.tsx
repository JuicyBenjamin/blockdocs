import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RootLayout from './RootLayout'
import Home from './Home'
import Documents from './Documents/Documents'
import Document from './Documents/components/Document'
import { db } from '@/utils/db'
import GenerateBlocks from './Blocks/components/GenerateBlocks'
import Blocks from './Blocks'

const IndexRoutes = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: 'documents',
          children: [
            {
              index: true,
              element: <Documents />,
            },
            {
              path: ':documentId',
              loader: async ({ params }) => {
                const document = await db.document.get(
                  Number(params.documentId),
                )
                if (document == null) {
                  return null
                }
                return document
              },
              element: <Document />,
            },
          ],
        },
        {
          path: 'blocks',
          children: [
            {
              index: true,
              element: <Blocks />,
            },
            {
              path: ':blockId',
              loader: async ({ params }) => {
                const block = await db.customBlock.get(Number(params.blockId))
                if (block == null) {
                  return null
                }
                return block
              },
              element: <GenerateBlocks />,
            },
          ],
        },
      ],
    },
  ])
  return <RouterProvider router={router} />
}

export default IndexRoutes
