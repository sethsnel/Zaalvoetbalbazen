import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Collapse } from "bootstrap"
import Link from "next/link"

const Navbar = ({ logout, isAdmin }: { logout: () => void, isAdmin: boolean }) => {
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
            <MenuItem name="Overzicht" href='/' currentPath={pathname} />
          </li>
          <li className="nav-item">
            <MenuItem name="Verleden" href='/verleden' currentPath={pathname} />
          </li>
          <li className="nav-item">
            <MenuItem name="Mijn profiel" href='/profiel' currentPath={pathname} />
          </li>
          {
            isAdmin && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-expanded="false">Beheer</a>
                <ul className="dropdown-menu">
                  <li><DropdownItem name="Sessies" href='/sessie-management' currentPath={pathname} /></li>
                  <li><DropdownItem name="Aanwezigheid" href='/aanwezigheid' currentPath={pathname} /></li>
                </ul>
              </li>
            )
          }
        </ul>
      </div>
      <button className="btn btn-outline-danger position-absolute end-0 top-0  me-3" onClick={logout} type="button">Afmelden</button>
    </div>
  </nav>
}

function MenuItem({ name, href, currentPath }: { name: string, href: string, currentPath: string }) {
  if (currentPath === href) {
    return <Link href={href}><a className="nav-link active" aria-current="page">{name}</a></Link>
  }
  else {
    return <Link href={href}><a className="nav-link" href={href}>{name}</a></Link>
  }
}

function DropdownItem({ name, href, currentPath }: { name: string, href: string, currentPath: string }) {
  if (currentPath === href) {
    return <Link href={href}><a className="dropdown-item active" aria-current="page">{name}</a></Link>
  }
  else {
    return <Link href={href}><a className="dropdown-item" href={href}>{name}</a></Link>
  }
}

export default Navbar