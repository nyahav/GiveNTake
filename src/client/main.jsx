import './index.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import RequireAuth from './components/Auth/RequireAuth'
import PersistLogin from './components/Auth/PersistLogin'
import Root from './components/Layout/Root'
import ErrorPage from './routes/ErrorPage'
import ForYou from './routes/ForYou'
import Explore from './routes/Explore'
import Auth from './routes/Auth'
import Profile from './routes/Profile'
import Messages from './routes/Messages'
import Missing from './routes/Missing'
import Dashboard from './routes/dashboard/Dashboard'
import Admin from './routes/Admin'
import Unauthorized from './components/Auth/Unauthorized'
import SavedPosts from './routes/SavedPosts'
import CreatePost from './routes/CreatePost'
import HomeV2 from './routes/HomeV2'
import ReportedPosts from './routes/dashboard/ReportedPosts/ReportedPosts'
import Menu from './routes/dashboard/Menu'

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150
}

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: (
      <Root>
        <ErrorPage />
      </Root>
    ),
    children: [
      // public routes
      { path: '/auth', element: <Auth /> },
      { path: '/unauthorized', element: <Unauthorized /> },
      // protected routes
      {
        element: <PersistLogin />,
        children: [
          { path: '/', element: <HomeV2 /> },
          { path: '/explore', element: <Explore /> },
          { path: '/profile/:id', element: <Profile /> },
          {
            element: <RequireAuth allowedRoles={[ROLES.User]} />,
            children: [
              { path: '/feed', element: <ForYou /> },
              { path: '/saved', element: <SavedPosts /> },
              { path: '/profile', element: <Profile isMyProfile={true} /> },
              { path: '/create-post', element: <CreatePost /> },
              { path: '/messages', element: <Messages /> }
            ]
          },
          {
            element: <RequireAuth allowedRoles={[ROLES.Editor]} />,
            children: [
              {
                path: '/dashboard',
                element: <Dashboard />,
                children: [
                  { path: '/dashboard', element: <Menu /> },
                  { path: '/dashboard/reported-posts', element: <ReportedPosts /> }
                ]
              }
            ]
          },
          {
            element: <RequireAuth allowedRoles={[ROLES.Admin]} />,
            children: [{ path: '/admin', element: <Admin /> }]
          }
        ]
      },

      // catch all
      { path: '*', element: <Missing /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
