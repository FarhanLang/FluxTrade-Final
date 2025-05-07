// lib/wishlistAndNotifications.ts

// Define interface types for API responses and parameters
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
}

interface PopulatedListingInfo {
  _id: string;
  title: string;
  images: string[];
}

interface WishlistItem {
  _id: string;
  user: string;
  productName: string;
  createdAt: string;
}

interface Notification {
  _id: string;
  user: string;
  title: string;
  message: string;
  listingId: PopulatedListingInfo;
  isRead: boolean;
  createdAt: string;
}

// Helper function to create headers
const createAuthHeaders = (token: string) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}` // <--- CHANGED HERE
});

// Wishlist API functions
export async function addToWishlist(token: string, productName: string): Promise<ApiResponse<WishlistItem>> {
  console.log('addToWishlist - Token being sent:', token);
  try {
    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: createAuthHeaders(token), // Use helper
      body: JSON.stringify({ productName })
    });
    const data: ApiResponse<WishlistItem> = await response.json();
    
    if (!response.ok) {
      console.error('addToWishlist API Error:', data.message || response.statusText);
      throw new Error(data.message || 'Failed to add to wishlist');
    }
    
    return data;
  } catch (error) {
    console.error("addToWishlist fetch/parse error:", error);
    throw error;
  }
}

export async function getWishlist(token: string): Promise<WishlistItem[]> {
  console.log('getWishlist - Token being sent:', token);
  try {
    const response = await fetch('/api/wishlist', {
      method: 'GET',
      headers: createAuthHeaders(token) // Use helper, ensure Content-Type is not needed for GET if no body
    });
    const data: ApiResponse<WishlistItem[]> = await response.json();
    
    if (!response.ok) {
      console.error('getWishlist API Error:', data.message || response.statusText);
      throw new Error(data.message || 'Failed to get wishlist');
    }
    
    return data.data || [];
  } catch (error) {
    console.error("getWishlist fetch/parse error:", error);
    throw error;
  }
}

export async function removeFromWishlist(token: string, wishlistItemId: string): Promise<ApiResponse<void>> {
  console.log('removeFromWishlist - Token being sent:', token);
  try {
    const response = await fetch(`/api/wishlist/${wishlistItemId}`, {
      method: 'DELETE',
      headers: createAuthHeaders(token) // Use helper
    });
    const data: ApiResponse<void> = await response.json();
    
    if (!response.ok) {
      console.error('removeFromWishlist API Error:', data.message || response.statusText);
      throw new Error(data.message || 'Failed to remove from wishlist');
    }
    
    return data;
  } catch (error) {
    console.error("removeFromWishlist fetch/parse error:", error);
    throw error;
  }
}

// Notification API functions
export async function getNotifications(token: string): Promise<Notification[]> {
  console.log('getNotifications - Token being sent:', token);
  try {
    const response = await fetch('/api/notifications', {
      method: 'GET',
      headers: createAuthHeaders(token) // Use helper
    });
    const data: ApiResponse<Notification[]> = await response.json();
    
    if (!response.ok) {
      console.error('getNotifications API Error:', data.message || response.statusText);
      throw new Error(data.message || 'Failed to get notifications');
    }
    
    return data.data || [];
  } catch (error) {
    console.error("getNotifications fetch/parse error:", error);
    throw error;
  }
}

export async function markNotificationAsRead(token: string, notificationId: string): Promise<ApiResponse<Notification>> {
  console.log('markNotificationAsRead - Token being sent:', token);
  try {
    const response = await fetch(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: createAuthHeaders(token) // Use helper
    });
    const data: ApiResponse<Notification> = await response.json();
    
    if (!response.ok) {
      console.error('markNotificationAsRead API Error:', data.message || response.statusText);
      throw new Error(data.message || 'Failed to mark notification as read');
    }
    
    return data;
  } catch (error) {
    console.error("markNotificationAsRead fetch/parse error:", error);
    throw error;
  }
}

export async function deleteNotification(token: string, notificationId: string): Promise<ApiResponse<void>> {
  console.log('deleteNotification - Token being sent:', token);
  try {
    const response = await fetch(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: createAuthHeaders(token) // Use helper
    });
    const data: ApiResponse<void> = await response.json();
    
    if (!response.ok) {
      console.error('deleteNotification API Error:', data.message || response.statusText);
      throw new Error(data.message || 'Failed to delete notification');
    }
    
    return data;
  } catch (error) {
    console.error("deleteNotification fetch/parse error:", error);
    throw error;
  }
}