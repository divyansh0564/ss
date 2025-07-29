// Mock API module for future backend integration
// Replace these with actual API calls when backend is ready

export const api = {
  // Authentication endpoints
  async loginWithGoogle() {
    console.log('API: Login with Google');
    // Placeholder for: await fetch('/api/auth/google', { method: 'POST' })
    return Promise.resolve({ success: true, token: 'mock_token' });
  },

  async loginWithFacebook() {
    console.log('API: Login with Facebook');
    // Placeholder for: await fetch('/api/auth/facebook', { method: 'POST' })
    return Promise.resolve({ success: true, token: 'mock_token' });
  },

  async loginWithInstagram() {
    console.log('API: Login with Instagram');
    // Placeholder for: await fetch('/api/auth/instagram', { method: 'POST' })
    return Promise.resolve({ success: true, token: 'mock_token' });
  },

  // Post management endpoints
  async schedulePost(postData) {
    console.log('API: Schedule post', postData);
    // Placeholder for: await fetch('/api/schedule-post', { method: 'POST', body: JSON.stringify(postData) })
    return Promise.resolve({ success: true, postId: Date.now().toString() });
  },

  async getPosts() {
    console.log('API: Get posts');
    // Placeholder for: await fetch('/api/posts')
    const savedPosts = localStorage.getItem('scheduledPosts');
    return Promise.resolve(savedPosts ? JSON.parse(savedPosts) : []);
  },

  async updatePost(postId, updatedData) {
    console.log('API: Update post', postId, updatedData);
    // Placeholder for: await fetch(`/api/posts/${postId}`, { method: 'PUT', body: JSON.stringify(updatedData) })
    return Promise.resolve({ success: true });
  },

  async deletePost(postId) {
    console.log('API: Delete post', postId);
    // Placeholder for: await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
    return Promise.resolve({ success: true });
  },

  async reschedulePost(postId, newDate, newTime) {
    console.log('API: Reschedule post', postId, newDate, newTime);
    // Placeholder for: await fetch(`/api/posts/${postId}/reschedule`, { method: 'PUT', body: JSON.stringify({ date: newDate, time: newTime }) })
    return Promise.resolve({ success: true });
  },

  // Platform status endpoints
  async getPlatformStatus() {
    console.log('API: Get platform status');
    // Placeholder for: await fetch('/api/platforms/status')
    return Promise.resolve({
      instagram: { connected: true, token_expires: '2024-12-31' },
      twitter: { connected: true, token_expires: '2024-12-31' },
      linkedin: { connected: false, token_expires: null }
    });
  },

  async connectPlatform(platform) {
    console.log('API: Connect platform', platform);
    // Placeholder for: await fetch(`/api/platforms/${platform}/connect`, { method: 'POST' })
    return Promise.resolve({ success: true, authUrl: `https://oauth.${platform}.com/authorize` });
  },

  async disconnectPlatform(platform) {
    console.log('API: Disconnect platform', platform);
    // Placeholder for: await fetch(`/api/platforms/${platform}/disconnect`, { method: 'POST' })
    return Promise.resolve({ success: true });
  },

  // Analytics endpoints
  async getAnalytics(startDate, endDate) {
    console.log('API: Get analytics', startDate, endDate);
    // Placeholder for: await fetch(`/api/analytics?start=${startDate}&end=${endDate}`)
    return Promise.resolve({
      totalPosts: 45,
      successfulPosts: 42,
      failedPosts: 3,
      engagement: {
        instagram: { likes: 1250, comments: 89, shares: 34 },
        twitter: { likes: 890, retweets: 45, replies: 23 },
        linkedin: { likes: 234, comments: 12, shares: 8 }
      }
    });
  }
};

// Validation utilities
export const validation = {
  validatePost(postData) {
    const errors = [];
    
    if (!postData.platform) {
      errors.push('Platform is required');
    }
    
    if (!postData.caption || postData.caption.trim().length === 0) {
      errors.push('Caption is required');
    }
    
    if (postData.caption && postData.caption.length > 2200) {
      errors.push('Caption must be less than 2200 characters');
    }
    
    if (!postData.scheduledDate) {
      errors.push('Scheduled date is required');
    }
    
    if (!postData.scheduledTime) {
      errors.push('Scheduled time is required');
    }
    
    // Check if date is in the future
    if (postData.scheduledDate && postData.scheduledTime) {
      const scheduledDateTime = new Date(`${postData.scheduledDate}T${postData.scheduledTime}`);
      if (scheduledDateTime <= new Date()) {
        errors.push('Scheduled time must be in the future');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  checkDailyLimit(platform, date, existingPosts = []) {
    const postsForDate = existingPosts.filter(post => 
      post.platform === platform && 
      post.scheduledDate === date
    );
    
    return {
      isWithinLimit: postsForDate.length < 3,
      currentCount: postsForDate.length,
      maxLimit: 3
    };
  }
};

// Storage utilities
export const storage = {
  savePosts(posts) {
    localStorage.setItem('scheduledPosts', JSON.stringify(posts));
  },

  loadPosts() {
    const saved = localStorage.getItem('scheduledPosts');
    return saved ? JSON.parse(saved) : [];
  },

  saveUserPreferences(preferences) {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  },

  loadUserPreferences() {
    const saved = localStorage.getItem('userPreferences');
    return saved ? JSON.parse(saved) : {
      defaultPlatform: '',
      autoSave: true,
      notifications: true
    };
  },

  clearAll() {
    localStorage.removeItem('scheduledPosts');
    localStorage.removeItem('userPreferences');
  }
};