import { useState, useEffect } from 'react';
import Lanyard from './Lanyard';
import '../styles/TicketCard.css';

export default function TicketCard({ bookingData, onClose }) {
  const [showLanyard, setShowLanyard] = useState(false);
  const [enhancedBookingData, setEnhancedBookingData] = useState(null);
  
  useEffect(() => {
    // Enhance booking data with additional fields
    if (bookingData) {
      // Determine event type if not explicitly provided
      let eventType = bookingData.type || 'movie';
      if (!bookingData.type) {
        if (bookingData.artist) {
          eventType = 'concert';
        } else if (bookingData.comedian) {
          eventType = 'comedy';
        }
      }
      
      // Format date if needed
      const formattedDate = formatDate(bookingData.date);
      
      // Create enhanced booking data
      setEnhancedBookingData({
        ...bookingData,
        type: eventType,
        date: formattedDate,
        // If real image URLs are available, they would be used here
        posterUrl: bookingData.posterUrl || bookingData.imageUrl || bookingData.image
      });
    }
    
    // Show the lanyard with a slight delay for better visual effect
    const timer = setTimeout(() => {
      setShowLanyard(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [bookingData]);

  // Format the date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    // Check if date is already in a readable format with commas or slashes
    if (typeof dateString === 'string' && (dateString.includes(',') || dateString.includes('/'))) {
      return dateString;
    }
    
    try {
    const date = new Date(dateString);
      return date instanceof Date && !isNaN(date.getTime())
      ? date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
      : dateString; // Fallback to the original string if parsing fails
    } catch (e) {
      return dateString; // If there's an error parsing, return the original
    }
  };

  return (
    <div className="ticket-card-overlay">
      <div className="ticket-card-container">
        <button className="close-button" onClick={onClose}>×</button>
        <div className="lanyard-container">
          {showLanyard && enhancedBookingData && <Lanyard position={[0, 0, 20]} gravity={[0, -40, 0]} bookingData={enhancedBookingData} />}
        </div>
      </div>
    </div>
  );
} 