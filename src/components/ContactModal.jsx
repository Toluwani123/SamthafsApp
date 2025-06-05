// src/components/ContactModal.jsx
import React, { useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

export const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
export const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
export const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

export default function ContactModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSuccess,      // parent sets isMessageSent → true
  isMessageSent   // boolean from parent
}) {
  // Reset isMessageSent when modal closes:
  useEffect(() => {
    if (!isOpen && isMessageSent) {
      // Parent’s onClose should reset `isMessageSent = false`.
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Double‐check required fields (HTML5 `required` on each input already blocks empty):
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: {
        name:    formData.name,
        email:   formData.email,
        phone:   formData.phone,
        subject: formData.subject,
        message: formData.message
      }
    };

    try {
      const response = await fetch(
        'https://api.emailjs.com/api/v1.0/email/send',
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        let errInfo = {};
        try {
          errInfo = await response.json();
        } catch {}
        console.error('EmailJS error details:', errInfo);
        alert('Sorry, we could not send your message. Please try again later.');
        return;
      }

      alert('✔ Thank you! Your message has been sent. We’ll get back to you soon.');
      onSuccess();

    } catch (err) {
      console.error('Network / JS error sending message:', err);
      alert('Network error: could not send message. Please check your connection and try again.');
    }
  };

  const handleClose = () => {
    onClose(); // parent must then do setIsMessageSent(false)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close contact form"
        >
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>

        {!isMessageSent && (
          <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'contact-name',  name: 'name',  label: 'Name',  type: 'text'  },
                { id: 'contact-email', name: 'email', label: 'Email', type: 'email' }
              ].map(({ id, name, label, type }) => (
                <div key={name}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    name={name}
                    required
                    value={formData[name]}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            {/* Phone + Subject */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'contact-phone',   name: 'phone',   label: 'Phone',   type: 'tel'  },
                { id: 'contact-subject', name: 'subject', label: 'Subject', type: 'text' }
              ].map(({ id, name, label, type }) => (
                <div key={name}>
                  <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                  </label>
                  <input
                    id={id}
                    type={type}
                    name={name}
                    required
                    value={formData[name]}
                    onChange={onChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                required
                value={formData.message}
                onChange={onChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="!rounded-button whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-medium transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
