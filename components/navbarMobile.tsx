import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Collapse } from "bootstrap"
import Image from "next/image"
import Link from "next/link"
import {
  BsListUl,
  BsClockHistory
} from "react-icons/bs"

import styles from "../styles/Home.module.css"

const Navbar = ({ isAdmin, profileUrl }: { isAdmin: boolean; profileUrl: string }) => {
  const { pathname } = useRouter()
  const [expandedMenu, setExpandedMenu] = useState(false)

  useEffect(() => {
    var myCollapse = document.getElementById("navbar")
    if (myCollapse) {
      var bsCollapse = new Collapse(myCollapse, { toggle: false })
      expandedMenu ? bsCollapse.show() : bsCollapse.hide()
    }

    return () => {
      bsCollapse?.dispose()
    }
  }, [expandedMenu])

  return (
    <nav className={`d-flex d-md-none bg-white border-top fixed-bottom m-0 mt-5 px-3 py-2 shadow shadow-md-none flex-row justify-content-around text-secondary`} style={{ zIndex: 10000 }}>
      <MenuItem name="Overzicht" href="/">
        <BsListUl className="fs-1" />
      </MenuItem>
      <MenuItem name="Historie" href="/verleden">
        <BsClockHistory className="fs-1" />
      </MenuItem>
      <MenuItem name="Profiel" href="/profiel">
        <Image
          src={profileUrl}
          height={32}
          width={32}
          className={`${styles.picture}`}
          objectFit='cover'
          alt='Profile picture'
        />
      </MenuItem>
    </nav>
  )
}

function MenuItem({ name, href, children }: { name: string; href: string; children: React.ReactNode }) {
  const { pathname } = useRouter()
  let link = <Link href={href} className='d-flex flex-column align-items-center justify-content-end gap-1 flex-grow-1' style={{ flexBasis: 0, fontSize: 14 }}>
    {children}
    {name}
  </Link>

  if (pathname === href) {
    link = (
      <Link href={href} className='d-flex flex-column align-items-center justify-content-end gap-1 flex-grow-1 active text-primary' aria-current='page'  style={{ flexBasis: 0, fontSize: 14 }}>
        {children}
        {name}
      </Link>
    )
  }

  return link
}

export default Navbar
