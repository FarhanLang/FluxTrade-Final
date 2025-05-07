"use client"
// components/NotificationBell.jsx

import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { getNotifications, markNotificationAsRead } from '@/lib/wishlistAndNotifications'

export function NotificationBell() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const menuRef = useRef(null)

  // Fetch notifications when the dropdown is opened
  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth-token')
      if (!token) return
      
      const notificationsData = await getNotifications(token)
      setNotifications(notificationsData)
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch notifications',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return
      
      // Mark as read in the backend
      await markNotificationAsRead(token, notification._id)
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(n => 
          n._id === notification._id ? { ...n, isRead: true } : n
        )
      )
      
      // Navigate to the listing
      setOpen(false)
      router.push(`/listings/${notification.listingId._id}`)
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process notification',
        variant: 'destructive',
      })
    }
  }

  // Poll for new notifications every minute
  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) return
    
    // Initial fetch 
    fetchNotifications()
    
    // Set up polling
    const interval = setInterval(() => {
      fetchNotifications()
    }, 10000) // Every minute
    
    return () => clearInterval(interval)
  }, [])

  // Handle dropdown menu open/close
  useEffect(() => {
    if (open) {
      fetchNotifications()
    }
  }, [open])

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80" ref={menuRef}>
        <div className="p-2 font-semibold border-b">
          Notifications
        </div>
        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification._id}
                className={`p-3 cursor-pointer ${!notification.isRead ? 'bg-muted' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex flex-col gap-1 w-full">
                  <div className="font-medium flex justify-between">
                    <span>{notification.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}