'use client';

import { useState, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { useTheme } from './ThemeProvider';

export function ContactForm() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name: string, value: string): string => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      subject: validateField('subject', formData.subject),
      message: validateField('message', formData.message)
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      return;
    }

    setIsSubmitting(true);
    setStatus({ message: '', type: '' });

    try {
      // Initialize EmailJS (you'll need to replace these with your actual values)
      await emailjs.send(
        'YOUR_SERVICE_ID',  // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'americafirstusateam@gmail.com'
        },
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );

      setStatus({
        message: 'Thank you! Your message has been sent successfully.',
        type: 'success'
      });

      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Hide success message after 6 seconds
      setTimeout(() => {
        setStatus({ message: '', type: '' });
      }, 6000);

    } catch (error) {
      console.error('EmailJS Error:', error);
      setStatus({
        message: 'Oops! Something went wrong. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-lg font-medium mb-2"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)' }}
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            border: errors.name
              ? '1px solid #ef4444'
              : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDark ? '#fff' : '#000'
          }}
          placeholder="Your name"
        />
        {errors.name && (
          <span className="text-red-500 text-sm mt-1 block">{errors.name}</span>
        )}
      </div>

      {/* Email Field */}
      <div>
        <label
          htmlFor="email"
          className="block text-lg font-medium mb-2"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)' }}
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            border: errors.email
              ? '1px solid #ef4444'
              : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDark ? '#fff' : '#000'
          }}
          placeholder="Your email"
        />
        {errors.email && (
          <span className="text-red-500 text-sm mt-1 block">{errors.email}</span>
        )}
      </div>

      {/* Subject Field */}
      <div>
        <label
          htmlFor="subject"
          className="block text-lg font-medium mb-2"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)' }}
        >
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            border: errors.subject
              ? '1px solid #ef4444'
              : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDark ? '#fff' : '#000'
          }}
          placeholder="Subject"
        />
        {errors.subject && (
          <span className="text-red-500 text-sm mt-1 block">{errors.subject}</span>
        )}
      </div>

      {/* Message Field */}
      <div>
        <label
          htmlFor="message"
          className="block text-lg font-medium mb-2"
          style={{ color: isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)' }}
        >
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className="w-full px-4 py-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          style={{
            background: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
            border: errors.message
              ? '1px solid #ef4444'
              : isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)',
            color: isDark ? '#fff' : '#000'
          }}
          placeholder="Your message"
        />
        {errors.message && (
          <span className="text-red-500 text-sm mt-1 block">{errors.message}</span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {/* Status Message */}
      {status.message && (
        <div
          className={`text-center font-semibold text-lg p-4 rounded-lg ${
            status.type === 'success'
              ? 'bg-green-500/20 text-green-400'
              : 'bg-red-500/20 text-red-400'
          }`}
        >
          {status.message}
        </div>
      )}
    </form>
  );
}
