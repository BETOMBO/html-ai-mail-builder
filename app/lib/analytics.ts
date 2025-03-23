// Google Analytics event tracking
export const trackEvent = (action: string, category: string, label?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
    });
  }
};

// Track page views
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    });
  }
};

// Common events
export const trackUserAction = {
  login: () => trackEvent('login', 'user'),
  signup: () => trackEvent('signup', 'user'),
  logout: () => trackEvent('logout', 'user'),
  createTemplate: () => trackEvent('create_template', 'template'),
  saveTemplate: () => trackEvent('save_template', 'template'),
  deleteTemplate: () => trackEvent('delete_template', 'template'),
  generateEmail: () => trackEvent('generate_email', 'email'),
  copyToClipboard: () => trackEvent('copy_to_clipboard', 'email'),
  downloadHTML: () => trackEvent('download_html', 'email'),
}; 