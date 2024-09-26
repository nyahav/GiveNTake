import { Card } from 'flowbite-react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'

const Dashboard = () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <section>
      <div className="flex">
        {pathname !== '/dashboard' && (
          <IoArrowBack
            size="2em"
            className="mr-2"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/dashboard')}
          />
        )}
        <h4>Moderator Dashboard</h4>
      </div>
      <Outlet />
    </section>
  )
}

export default Dashboard
