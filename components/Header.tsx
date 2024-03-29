import React from "react";
import Link from "@/components/Link";
import Logo from "@/components/Logo";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Accounts",
    href: "/",
    description: "View your multi-factor accounts and their key shares.",
  },
  {
    title: "Create",
    href: "/keys/create",
    description:
      "Create a new multi-factor account using distributed key generation.",
  },
  {
    title: "Settings",
    href: "/settings",
    description: "Choose the relay server and protocol.",
  },
  {
    title: "About",
    href: "/about",
    description: "Learn more about how multi-factor accounts work.",
  },
  {
    title: "Source Code",
    href: "https://github.com/mpc-sdk/multi-factor-accounts",
    description: "Get the source code for this snap on Github.",
  },
  {
    title: "Snaps",
    href: "https://snaps.metamask.io/",
    description: "Find more Snaps to extend the functionality of MetaMask.",
  },
];

export default function Header() {
  return (
    <header className="fixed z-20 w-full border-b bg-background py-4">
      <div className="flex justify-between px-4 md:px-6 xl:px-8">
        <Link href="/" className="">
          <span className="flex items-center">
            <Logo />
            <h3 className="ml-4 font-semibold tracking-tight">
              Multi-Factor Accounts
            </h3>
          </span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}

/* eslint-disable react/prop-types */
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
