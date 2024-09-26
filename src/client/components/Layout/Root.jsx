import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import AppSideBar from './AppSideBar'
import { useUser } from '../../api/users/useUser'
import styles from './Root.module.scss'
import ScrollToTop from '../../hooks/ScrollToTop'
import { Popover } from 'flowbite-react'
import { MdOutlinePerson, MdOutlineLogout, MdOutlineAddModerator } from 'react-icons/md'
import { TbHeartHandshake } from 'react-icons/tb'
import useLogout from '../../api/auth/useLogout'
import { HiNewspaper, HiOutlineNewspaper } from 'react-icons/hi2'

import { FaCompass } from 'react-icons/fa6'
import { FaRegCompass } from 'react-icons/fa'
import { AiOutlineMessage, AiFillMessage } from 'react-icons/ai'
import { TbSquareRoundedPlus, TbSquareRoundedPlusFilled } from 'react-icons/tb'
import { HiOutlineLockClosed, HiLockClosed } from 'react-icons/hi'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import { FaCircleUser, FaRegCircleUser } from 'react-icons/fa6'
import useHasUnreadMessages from '../../api/messages/useHasUnreadMessages'
import { ROLES } from '../../utils/staticData'

export default function Root({ children }) {
  const { isLoggedIn, data: user, isUserAuthorized } = useUser()
  const { mutate: logout } = useLogout()
  const { pathname } = useLocation()
  const numUnreadConversations = useHasUnreadMessages()

  // extract user roles

  const profilePopover = children => {
    const content = (
      <div className={styles.popoverWrap}>
        <NavLink to="/profile">
          <MdOutlinePerson size="1.2em" />
          Profile
        </NavLink>
        {isUserAuthorized([ROLES.Editor]) && (
          <NavLink to="/dashboard">
            <MdOutlineAddModerator size="1.2em" />
            Moderator dashboard
          </NavLink>
        )}
        <NavLink onClick={logout}>
          <MdOutlineLogout size="1.2em" />
          Logout
        </NavLink>
      </div>
    )
    return <Popover trigger="click" aria-labelledby="profile-popover" {...{ content, children }} />
  }
  const navlinks = [
    ...(isLoggedIn ? [{ icon: HiOutlineNewspaper, iconActive: HiNewspaper, title: 'For You', link: '/feed' }] : []),
    { icon: FaRegCompass, iconActive: FaCompass, title: 'Explore', link: '/explore' },
    ...(isLoggedIn
      ? [
        {
          icon: AiOutlineMessage,
          iconActive: AiFillMessage,
          title: 'Messages',
          link: '/messages',
          numUnreadConversations
        },
        { icon: FaRegBookmark, iconActive: FaBookmark, title: 'Saved', link: '/saved', showOnTop: true },
        {
          icon: TbSquareRoundedPlus,
          iconActive: TbSquareRoundedPlusFilled,
          title: 'Create Post',
          link: '/create-post',
          showOnTop: true
        },
        {
          icon: FaRegCircleUser,
          iconActive: FaCircleUser,
          title: `${user.firstName} ${user.lastName}`,
          link: '/profile',
          popover: profilePopover
        }
      ]
      : [{ icon: HiOutlineLockClosed, iconActive: HiLockClosed, title: 'Sign in/up', link: '/auth?mode=login' }])
  ]

  return (
    <>
      <ScrollToTop />
      <AppSideBar Icon={TbHeartHandshake} title="Given'take" nav={navlinks} currentPathName={pathname}>
        {children}
        <SnackbarProvider autoHideDuration={5000} anchorOrigin={{ horizontal: 'center', vertical: 'top' }}>
          <Outlet />
        </SnackbarProvider>
      </AppSideBar>
    </>
  )
}
