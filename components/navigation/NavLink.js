import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavLink({ href, icon, name, open }) {
  const [show, setShow] = useState(open);

  const path = usePathname();

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        setShow(open);
      }, 150);
    } else {
      setShow(open);
    }
  }, [open]);

  return (
    <Link
      href={href}
      className={`nav__links--link ${path === href ? "nav__selected" : ""}`}
    >
      <Image src={icon} width={25} height={25} alt="icon1" />
      {show && <span>{name}</span>}
    </Link>
  );
}
