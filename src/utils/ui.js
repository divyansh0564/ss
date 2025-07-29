// UI utility functions and helpers

export const ui = {
  // Toast notifications
  showToast(title, description, type = 'default') {
    console.log(`Toast [${type}]: ${title} - ${description}`);
    // This will be replaced with actual toast implementation
  },

  // Loading states
  showLoading(element) {
    if (element) {
      element.disabled = true;
      element.innerHTML = element.innerHTML.replace('Schedule Post', 'Scheduling...');
    }
  },

  hideLoading(element, originalText = 'Schedule Post') {
    if (element) {
      element.disabled = false;
      element.innerHTML = originalText;
    }
  },

  // Modal helpers
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  },

  // Form validation UI
  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
      field.classList.add('border-red-500');
    }
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.remove('hidden');
    }
  },

  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) {
      field.classList.remove('border-red-500');
    }
    
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.add('hidden');
    }
  },

  // Platform badge colors
  getPlatformBadgeClass(platform) {
    const classes = {
      instagram: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      twitter: 'bg-blue-500 text-white',
      linkedin: 'bg-blue-700 text-white',
      facebook: 'bg-blue-600 text-white'
    };
    return classes[platform] || 'bg-gray-500 text-white';
  },

  // Status badge colors
  getStatusBadgeClass(status) {
    const classes = {
      scheduled: 'bg-green-100 text-green-800 border-green-200',
      scheduling: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      published: 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  },

  // Date formatting
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  formatDateTime(dateString, timeString) {
    const datetime = new Date(`${dateString}T${timeString}`);
    return datetime.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatRelativeTime(dateString, timeString) {
    const datetime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const diffMs = datetime - now;
    
    if (diffMs < 0) {
      return 'Past due';
    }
    
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 7) {
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} away`;
    } else if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} away`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} away`;
    } else {
      return 'Soon';
    }
  },

  // Character count helpers
  updateCharacterCount(textareaId, counterId, maxLength = 2200) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    
    if (textarea && counter) {
      const currentLength = textarea.value.length;
      counter.textContent = `${currentLength}/${maxLength}`;
      
      if (currentLength > maxLength * 0.9) {
        counter.classList.add('text-red-500');
      } else {
        counter.classList.remove('text-red-500');
      }
    }
  },

  // File upload helpers
  previewImage(file, previewElementId) {
    const reader = new FileReader();
    const previewElement = document.getElementById(previewElementId);
    
    reader.onload = (e) => {
      if (previewElement) {
        previewElement.src = e.target.result;
        previewElement.classList.remove('hidden');
      }
    };
    
    reader.readAsDataURL(file);
  },

  validateFileSize(file, maxSizeMB = 50) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return {
      isValid: file.size <= maxSizeBytes,
      actualSize: (file.size / (1024 * 1024)).toFixed(2),
      maxSize: maxSizeMB
    };
  },

  validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/mov']) {
    return {
      isValid: allowedTypes.includes(file.type),
      actualType: file.type,
      allowedTypes
    };
  }
};

// Event handlers for common UI interactions
export const handlers = {
  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      ui.showToast('Copied!', 'Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      ui.showToast('Error', 'Failed to copy text', 'error');
    }
  },

  // Share post (Web Share API)
  async sharePost(postData) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Social Media Post',
          text: postData.caption,
          url: window.location.href
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback for browsers without Web Share API
      handlers.copyToClipboard(postData.caption);
    }
  },

  // Download as image/PDF (placeholder)
  downloadPost(postData, format = 'image') {
    console.log(`Downloading post as ${format}:`, postData);
    ui.showToast('Download', `Post ${format} will be available soon`, 'info');
  },

  // Bulk operations
  selectAllPosts(checkboxes) {
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
  },

  deselectAllPosts(checkboxes) {
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  },

  getSelectedPosts(checkboxes) {
    return Array.from(checkboxes)
      .filter(checkbox => checkbox.checked)
      .map(checkbox => checkbox.getAttribute('data-post-id'));
  }
};

// Analytics helpers
export const analytics = {
  trackEvent(eventName, eventData = {}) {
    console.log('Analytics Event:', eventName, eventData);
    // Placeholder for analytics tracking (Google Analytics, Mixpanel, etc.)
  },

  trackPageView(pageName) {
    console.log('Page View:', pageName);
    // Placeholder for page view tracking
  },

  trackPostScheduled(platform, postType) {
    this.trackEvent('post_scheduled', {
      platform,
      post_type: postType,
      timestamp: new Date().toISOString()
    });
  },

  trackUserAction(action, details = {}) {
    this.trackEvent('user_action', {
      action,
      details,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    });
  }
};