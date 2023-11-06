import Link from '@/components/Link';
import Logo  from '@/components/Logo';

import {Link as RouterLink} from 'react-router-dom';
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

function Menu() {
  return <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <RouterLink to="/keys">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Keys
          </NavigationMenuLink>
        </RouterLink>
        <RouterLink to="/sign">
          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
            Sign
          </NavigationMenuLink>
        </RouterLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>;
}

export default function Header() {
  return (
    <header
      className="fixed z-20 w-full border-b bg-background py-4">
      <div
        className="container mx-auto flex justify-between px-4">
        <div className="flex items-center">
          <Link href="#/">
            <Logo />
          </Link>
          <h3 className="ml-4 font-semibold tracking-tight">
            Threshold signatures
          </h3>
        </div>
        <Menu />
      </div>
    </header>
  )
}
