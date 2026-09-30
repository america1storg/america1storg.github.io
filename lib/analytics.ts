import { track } from '@vercel/analytics';

// Custom event tracking for America First site
export const analytics = {
  // Article interactions
  articleView: (articleId: string, articleTitle: string) => {
    track('article_view', {
      article_id: articleId,
      article_title: articleTitle,
    });
  },

  articleShare: (articleId: string, articleTitle: string, platform: string) => {
    track('article_share', {
      article_id: articleId,
      article_title: articleTitle,
      platform,
    });
  },

  articleReadTime: (articleId: string, timeInSeconds: number) => {
    track('article_read_time', {
      article_id: articleId,
      duration_seconds: timeInSeconds,
    });
  },

  // Newsletter
  newsletterSubscribe: (source: string) => {
    track('newsletter_subscribe', {
      source, // e.g., 'footer', 'homepage', 'article_page'
    });
  },

  // Navigation
  ctaClick: (ctaName: string, location: string) => {
    track('cta_click', {
      cta_name: ctaName, // e.g., 'get_involved', 'donate', 'volunteer'
      location, // e.g., 'header', 'footer', 'homepage'
    });
  },

  externalLinkClick: (url: string, linkText: string) => {
    track('external_link_click', {
      url,
      link_text: linkText,
    });
  },

  // Search
  searchPerformed: (query: string, resultsCount: number) => {
    track('search_performed', {
      query,
      results_count: resultsCount,
    });
  },

  searchResultClick: (query: string, resultTitle: string, position: number) => {
    track('search_result_click', {
      query,
      result_title: resultTitle,
      position,
    });
  },

  // Forms
  contactFormSubmit: (formType: string) => {
    track('contact_form_submit', {
      form_type: formType,
    });
  },

  // Engagement metrics
  scrollDepth: (percentage: number, page: string) => {
    track('scroll_depth', {
      percentage,
      page,
    });
  },

  timeOnPage: (page: string, timeInSeconds: number) => {
    track('time_on_page', {
      page,
      duration_seconds: timeInSeconds,
    });
  },

  // Theme
  themeToggle: (newTheme: 'light' | 'dark') => {
    track('theme_toggle', {
      theme: newTheme,
    });
  },
};
