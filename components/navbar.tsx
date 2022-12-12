import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Collapse } from "bootstrap"
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

const Navbar = ({ logout, isAdmin, profileUrl }: { logout: () => void, isAdmin: boolean, profileUrl: string }) => {
  const { pathname } = useRouter()
  const [expandedMenu, setExpandedMenu] = useState(false)

  useEffect(() => {
    var myCollapse = document.getElementById('navbar')
    if (myCollapse) {
      var bsCollapse = new Collapse(myCollapse, { toggle: false })
      expandedMenu ? bsCollapse.show() : bsCollapse.hide()
    }

    return () => {
      bsCollapse?.dispose()
    }
  }, [expandedMenu])

  return <nav className="navbar fixed-top navbar-expand-sm navbar-light bg-light">
    <div className="container-fluid position-relative">
      <button className="navbar-toggler" onClick={() => setExpandedMenu(!expandedMenu)} type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse justify-content-center" id="navbar">
        <ul className="navbar-nav">
          <li className="nav-item">
            <MenuItem name="Overzicht" href='/' currentPath={pathname} onClick={() => setExpandedMenu(false)} />
          </li>
          <li className="nav-item">
            <MenuItem name="Verleden" href='/verleden' currentPath={pathname} onClick={() => setExpandedMenu(false)} />
          </li>
          <li className="nav-item">
            <MenuItem name="Mijn profiel" href='/profiel' currentPath={pathname} onClick={() => setExpandedMenu(false)} />
          </li>
          <li className="nav-item">
            <MenuItem name="Voorkeuren" href='/voorkeuren' currentPath={pathname} onClick={() => setExpandedMenu(false)} />
          </li>
          {
            isAdmin && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Beheer</a>
                <ul className="dropdown-menu">
                  <li><DropdownItem name="Sessies" href='/sessie-management' currentPath={pathname} onClick={() => setExpandedMenu(false)} /></li>
                  <li><DropdownItem name="Aanwezigheid" href='/aanwezigheid' currentPath={pathname} onClick={() => setExpandedMenu(false)} /></li>
                </ul>
              </li>
            )
          }
          <li>
          <button className="btn btn-outline-secondary" onClick={logout} type="button">Uitloggen</button>
          </li>
        </ul>
      </div>
      <div className="position-absolute end-0 top-0 me-3">
        <Link href="/profiel">
          <Image src={profileUrl} height={40} width={40} className={styles.picture} objectFit='cover' />
        </Link>
      </div>
    </div>
  </nav>
}

function MenuItem({ name, href, currentPath, onClick }: { name: string, href: string, currentPath: string, onClick: () => void }) {
  if (currentPath === href) {
    return <Link href={href}><a className="nav-link active" aria-current="page" onClick={onClick}>{name}</a></Link>
  }
  else {
    return <Link href={href}><a className="nav-link" href={href} onClick={onClick}>{name}</a></Link>
  }
}

function DropdownItem({ name, href, currentPath, onClick }: { name: string, href: string, currentPath: string, onClick: () => void }) {
  if (currentPath === href) {
    return <Link href={href}><a className="dropdown-item active" aria-current="page" onClick={onClick}>{name}</a></Link>
  }
  else {
    return <Link href={href}><a className="dropdown-item" href={href} onClick={onClick}>{name}</a></Link>
  }
}

export default Navbar
