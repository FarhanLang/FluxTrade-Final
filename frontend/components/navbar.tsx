"use client"

import { JSX, useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { NotificationBell } from '@/components/NotificationBell'
import { isAuthenticated, logout } from "@/lib/auth"
import { isAdminAuthenticated } from "@/lib/admin"
import { 
  ShieldAlert, 
  ListPlus, 
  Search, 
  LogIn, 
  MessageSquare, 
  LogOut, 
  User, 
  Home,
  Menu 
} from "lucide-react"

// Define TypeScript interface for nav items
interface NavItem {
  name: string;
  href: string;
  icon?: JSX.Element;
}

export default function Navbar(): JSX.Element {
  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Check authentication both ways for compatibility
    const token = localStorage.getItem('auth-token')
    const isAuth = isAuthenticated()
    
    setAuthenticated(!!token || isAuth)
    setIsAdmin(isAdminAuthenticated())
  }, [pathname])

  const handleLogout = (): void => {
    logout()
    setAuthenticated(false)
    router.push("/login")
  }

  // Don't show navbar on admin pages
  if (pathname?.startsWith("/admin")) {
    return <></>
  }

  // Define navigation items
  const navItems: NavItem[] = [
    { name: 'Home', href: '/', icon: <Home className="h-4 w-4 mr-1" /> },
    { name: 'Browse Listings', href: '/listings', icon: <Search className="h-4 w-4 mr-1" /> },
    { name: 'Forum', href: '/forum', icon: <MessageSquare className="h-4 w-4 mr-1" /> },
    ...(authenticated 
      ? [
          { name: 'Profile', href: '/profile', icon: <User className="h-4 w-4 mr-1" /> },
          { name: 'Create Listing', href: '/listings/create', icon: <ListPlus className="h-4 w-4 mr-1" /> }
        ] 
      : [
          { name: 'Login', href: '/login', icon: <LogIn className="h-4 w-4 mr-1" /> },
          { name: 'Register', href: '/register' }
        ]
    )
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-blue-200 bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
              FluxTrade
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 mx-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-blue-600 flex items-center ${
                pathname === item.href || 
                (item.href !== '/' && pathname?.startsWith(item.href)) 
                  ? 'text-blue-600' 
                  : 'text-gray-600'
              }`}
            >
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-3">
          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {authenticated ? (
              <>
                <NotificationBell />
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50" asChild>
                  <Link href="/login">
                    <LogIn className="h-4 w-4 mr-2" /> Login
                  </Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white"
                  asChild
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )}

            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="ml-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                asChild
              >
                <Link href="/admin/dashboard">
                  <ShieldAlert className="h-4 w-4 mr-2" /> Admin
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-3">
            {authenticated && <NotificationBell />}
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-sm font-medium transition-colors flex items-center hover:text-blue-600 ${
                        pathname === item.href || 
                        (item.href !== '/' && pathname?.startsWith(item.href))
                          ? 'text-blue-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.icon} {item.name}
                    </Link>
                  ))}
                  
                  {authenticated && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                  )}
                  
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                      asChild
                    >
                      <Link href="/admin/dashboard">
                        <ShieldAlert className="h-4 w-4 mr-2" /> Admin
                      </Link>
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}