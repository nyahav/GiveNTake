import { Card } from 'flowbite-react'
import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <Card>
      <h5>All Operations:</h5>
      <ul>
        <li>
          <Link to="/dashboard/reported-posts">Reported posts</Link>
        </li>
      </ul>
    </Card>
  )
}

export default Menu
