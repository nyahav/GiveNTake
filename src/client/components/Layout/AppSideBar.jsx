import { Link, NavLink, useLocation } from 'react-router-dom'
import { Tooltip } from 'flowbite-react'
import { useMediaQuery } from '@uidotdev/usehooks'
import styles from './AppSideBar.module.scss'
import { IoSearchSharp } from 'react-icons/io5'
import SearchInput from '../Search/SearchInput'
import { useState } from 'react'

export default function AppSideBar({ children, Icon, title, search, nav, currentPathName }) {
  const isSmallDevice = useMediaQuery('only screen and (max-width: 767px)')
  const isWideDevice = useMediaQuery('only screen and (min-width: 1264px)')

  const [isSearchActive, setIsSearchActive] = useState(false)

  //sidebar/ bottom buttons
  const navLinksMapped = nav.map((item, index) => {
    const topClass = item.showOnTop ? styles.showOnTop : ''

    const content = (
      <>
        {(item.link && item.link.startsWith(currentPathName) && currentPathName !== '/') ||
        currentPathName === item.link ? (
          <item.iconActive size="1.5em" />
        ) : (
          <item.icon size="1.5em" />
        )}

        {/* <img src={item.icon} className={styles.icon} /> */}
        <div className={styles.title}>{item.title}</div>
      </>
    )

    let navlink = (
      <NavLink to={item.link} className={styles.linkWrap}>
        {item?.numUnreadConversations ? (
          <span className={styles.newMsgIndicator}>{item.numUnreadConversations}</span>
        ) : (
          <></>
        )}
        <span className="flex gap-2">{content}</span>
      </NavLink>
    )

    navlink = isWideDevice ? (
      navlink
    ) : (
      <Tooltip
        content={item.title}
        style="light"
        placement={isSmallDevice ? 'top' : 'right'}
        className={styles.tooltipCard}>
        {navlink}
      </Tooltip>
    )
    navlink = item.popover?.(<div className={styles.linkWrap}>{content}</div>) || navlink
    return (
      <div className={topClass} key={index}>
        {navlink}
      </div>
    )
  })

  //top nav buttons
  const topNavLinksMapped = nav.map((item, index) => {
    if (item.showOnTop)
      return (
        <NavLink to={item.link} className={styles.linkWrap} key={index}>
          <item.icon size="1.5em" />
          {/* <img src={item.icon} className={styles.icon} /> */}
        </NavLink>
      )
  })

  return (
    <>
      <div className={styles.baseCols}>
        <div className={styles.appSideBarWrap}>
          <Link to="/">
            <div className={styles.logo}>
              <Icon size={70} color="#fff" />
            </div>
          </Link>
          <nav className={styles.navWrap}>{navLinksMapped}</nav>
        </div>
        <div className={styles.pageWrap}>
          {!isSmallDevice && (
            <div className={styles.secondaryNav}>
              <h1 className={styles.logo}>{title}</h1>
              <SearchInput />
            </div>
          )}
          <div className={styles.innerWrap}>{children}</div>
        </div>
        <div className={styles.topBar}>
          {!isSearchActive && (
            <Link to="/">
              <div className={styles.logo}>
                <Icon size={70} />
                <span>{title}</span>
              </div>
            </Link>
          )}

          <div className={styles.searchWrap}>
            {isSearchActive && <SearchInput active={isSearchActive} onBlur={() => setIsSearchActive(false)} />}
          </div>

          {!isSearchActive && (
            <div className={styles.topNavButtons}>
              {topNavLinksMapped}

              <IoSearchSharp size="1.5em" style={{ cursor: 'pointer' }} onClick={() => setIsSearchActive(true)} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
