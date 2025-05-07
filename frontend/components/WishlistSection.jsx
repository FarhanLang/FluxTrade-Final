"use client"
// components/WishlistSection.jsx

import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { 
  addToWishlist, 
  getWishlist, 
  removeFromWishlist 
} from '@/lib/wishlistAndNotifications'

export function WishlistSection() {
  const [wishlistItems, setWishlistItems] = useState([])
  const [newItem, setNewItem] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('auth-token')
      if (!token) return
      
      const items = await getWishlist(token)
      setWishlistItems(items)
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch wishlist',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle add wishlist item
  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItem.trim()) return
    
    try {
      setSubmitting(true)
      const token = localStorage.getItem('auth-token')
      if (!token) return
      
      await addToWishlist(token, newItem.trim())
      
      toast({
        title: 'Success',
        description: 'Item added to wishlist',
      })
      
      // Reset form and refresh list
      setNewItem('')
      fetchWishlist()
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add item',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Handle remove wishlist item
  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) return
      
      await removeFromWishlist(token, itemId)
      
      // Update local state
      setWishlistItems(prev => prev.filter(item => item._id !== itemId))
      
      toast({
        title: 'Success',
        description: 'Item removed from wishlist',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove item',
        variant: 'destructive',
      })
    }
  }

  // Fetch wishlist on mount
  useEffect(() => {
    fetchWishlist()
  }, [])

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle>Your Wishlist</CardTitle>
        <CardDescription>
          Add items you're looking for and get notified when they're listed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
          <Input
            placeholder="Enter product name to watch for"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            disabled={submitting}
          />
          <Button 
            type="submit" 
            disabled={submitting || !newItem.trim()}
            className="bg-[#3661E8] hover:bg-[#05a8ff] text-white"
          >
            Add
          </Button>
        </form>
        
        <div className="space-y-2">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : wishlistItems.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Your wishlist is empty. Add items to get notified when they're listed!
            </p>
          ) : (
            wishlistItems.map((item) => (
              <div 
                key={item._id} 
                className="flex items-center justify-between p-2 border rounded group hover:bg-gray-50"
              >
                <span>{item.productName}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}