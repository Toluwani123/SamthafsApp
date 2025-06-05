// src/components/QuoteModal.jsx
import React, {use, useEffect} from 'react';
import { FaTimes, FaCheckCircle } from 'react-icons/fa';
export const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
export const TEMPLATE_ID_QUOTE = import.meta.env.VITE_TEMPLATE_ID_QUOTE;
export const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

// (Assumes you have a separate EmailJS template for “quote”
//  whose template parameters are: name, email, phone, project_type, location, budget, description)

export default function QuoteModal({
  isOpen,
  onClose,
  formData,
  onChange,
  onSuccess,       // rename from “onSubmit” → “onSuccess”
  isQuoteSent      // boolean flag from parent that tells us “EmailJS succeeded”
}) {

  useEffect(() => {
    if(!isOpen && isQuoteSent) {
    }
  },[isOpen]);
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Browser‐native HTML5 validation (type="email" and required) 
    // will block if any <input required> is blank or email is invalid.
    // However, we can double‐check:
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.projectType.trim() ||
      !formData.location.trim() ||
      !formData.budget.trim() ||
      !formData.description.trim()
    ) {
      alert('Please fill in all required fields.');
      return;
    }
    // (Email format is already enforced by type="email" on that <input>)

    const payload = {
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID_QUOTE,
      user_id: PUBLIC_KEY,
      template_params: {
        name:         formData.name,
        email:        formData.email,
        phone:        formData.phone,
        project_type: formData.projectType,
        location:     formData.location,
        budget:       formData.budget,
        description:  formData.description
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
        // If EmailJS returns an error status (e.g. 400, 500), parse it & alert:
        let errInfo = {};
        try {
          errInfo = await response.json();
        } catch {
          /* ignore JSON parse error */
        }
        console.error('EmailJS error details:', errInfo);
        alert('Sorry, we could not send your quote request. Please try again in a moment.');
        return;
      }

      // Success!
      alert('✔ Your quote request has been sent. We’ll be in touch soon.');
      onSuccess(); // Tell parent “quote was sent” so isQuoteSent=true

    } catch (err) {
      console.error('Network / JS error sending quote:', err);
      alert('Network error: could not send quote. Please check your connection and try again.');
    }
  };

  const handleClose = () => {
    onClose(); // Close the modal
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close quote form"
        >
          <FaTimes className="text-xl" />
        </button>

        <h2 className="text-3xl font-bold mb-6 text-gray-800">Request a Quote</h2>

        {isQuoteSent ? (
          <div className="text-center py-8">
            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
            <p className="text-xl text-gray-800">Thank you! Your quote request has been sent.</p>
            <p className="text-gray-600">We’ll be in touch very soon.</p>
          </div>
        ) : (
          <form id="quote-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Email + Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'quote-name',   name: 'name',        label: 'Name',        type: 'text' },
                { id: 'quote-email',  name: 'email',       label: 'Email',       type: 'email' },
                { id: 'quote-phone',  name: 'phone',       label: 'Phone',       type: 'tel' },
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

            {/* Project Type → select, Location, Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Project Type Dropdown */}
              <div>
                <label htmlFor="quote-project-type" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Type
                </label>
                <select
                  id="quote-project-type"
                  name="projectType"
                  required
                  value={formData.projectType}
                  onChange={onChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a type…</option>
                  {['commercial', 'residential', 'industrial', 'exterior', 'interior'].map(opt => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="quote-location" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Location
                </label>
                <input
                  id="quote-location"
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={onChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Budget */}
              <div className="md:col-span-2">
                <label htmlFor="quote-budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Budget Range
                </label>
                <input
                  id="quote-budget"
                  type="text"
                  name="budget"
                  required
                  value={formData.budget}
                  onChange={onChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="quote-description" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description
              </label>
              <textarea
                id="quote-description"
                name="description"
                required
                value={formData.description}
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
                Send Quote Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
