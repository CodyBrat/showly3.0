import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import '../styles/ComedyBookingPage.css';
import TicketCard from '../components/TicketCard';

// Conversion rate from USD to INR
const USD_TO_INR = 83.5;

export default function ComedyBookingPage() {
  const location = useLocation();
  const [show, setShow] = useState(location.state?.show || null);
  const [dominantColor, setDominantColor] = useState('rgba(255, 87, 87, 0.9)');
  const [secondaryColor, setSecondaryColor] = useState('rgba(255, 150, 150, 0.8)');
  const [accentColor, setAccentColor] = useState('#FFCC29');
  const [textColor, setTextColor] = useState('#ffffff');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [animateClass, setAnimateClass] = useState('');
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [showTicket, setShowTicket] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Available dates for the next 7 days
  const getDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Available showtimes
  const getShowtimes = () => {
    return ['6:00 PM', '7:00 PM', '8:30 PM', '9:30 PM'];
  };

  // Generate theater seats
  const generateSeats = () => {
    const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 12;
    const seats = [];
    
    seatRows.forEach(row => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${row}${i}`;
        let seatType = 'standard';
        let status = 'available';
        
        // Make premium seats
        if (row >= 'C' && row <= 'F' && i >= 4 && i <= 9) {
          seatType = 'premium';
        }
        
        // Randomly mark some seats as unavailable
        if (Math.random() < 0.2) {
          status = 'unavailable';
        }
        
        seats.push({
          id: seatId,
          row: row,
          number: i,
          type: seatType,
          status: status
        });
      }
    });
    
    return seats;
  };

  const dates = getDates();
  const showtimes = getShowtimes();
  const [seats, setSeats] = useState(generateSeats());

  // Initialize on load
  useEffect(() => {
    if (show) {
      // Set the date from the show if available, otherwise use the first available date
      if (show.date) {
        const showDate = new Date(show.date);
        setSelectedDate(showDate.toLocaleDateString());
      } else {
        setSelectedDate(dates[0].toLocaleDateString());
      }
      
      // Set the time from the show if available, otherwise use the first available time
      if (show.time) {
        setSelectedTime(show.time);
      } else {
        setSelectedTime(showtimes[0]);
      }
      
      // Simulate loading with a delay
      setTimeout(() => {
        setLoading(false);
      }, 1200);
    }
  }, [show, dates, showtimes]);

  // Animation effect for step transition
  const handleStepChange = (newStep) => {
    setAnimateClass('slide-out');
    
    setTimeout(() => {
      setStep(newStep);
      setAnimateClass('slide-in');
      
      // Scroll to top of content area
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }, 300);
  };

  // Handle seat selection
  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat && seat.status === 'available') {
      if (selectedSeats.includes(seatId)) {
        setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  // Get seat status for rendering
  const getSeatStatus = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return 'unavailable';
    if (seat.status === 'unavailable') return 'unavailable';
    return selectedSeats.includes(seatId) ? 'selected' : 'available';
  };

  // Get seat type for rendering
  const getSeatType = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return seat ? seat.type : 'standard';
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date.toLocaleDateString());
  };

  // Handle time selection
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Navigation to next step
  const nextStep = () => {
    if (step === 1 && selectedDate && selectedTime) {
      handleStepChange(2);
    } else if (step === 2 && selectedSeats.length > 0) {
      handleStepChange(3);
    }
  };

  // Navigation to previous step
  const prevStep = () => {
    if (step > 1) {
      handleStepChange(step - 1);
    }
  };

  // Handle booking completion
  const handleBooking = () => {
    setAnimateClass('success-animation');
    
    // Create the booking data object for the ticket
    const newBookingData = {
      title: show.name,
      performer: show.performer || show.name,
      date: selectedDate,
      time: selectedTime,
      venue: show.location,
      seatsInfo: selectedSeats.join(', '),
      bookingId: Math.random().toString(36).substring(2, 10).toUpperCase(),
      type: 'comedy',
      posterUrl: show.image,
      comedian: show.performer || show.name
    };
    
    setBookingData(newBookingData);
    
    setTimeout(() => {
      setShowTicket(true);
    }, 800);
  };

  // Close ticket modal
  const handleCloseTicket = () => {
    setShowTicket(false);
  };

  // Calculate ticket prices
  const getTicketPrice = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return seat && seat.type === 'premium' ? 14.99 : 9.99;
  };

  // Convert USD to INR
  const convertToINR = (usdPrice) => {
    return Math.round(usdPrice * USD_TO_INR);
  };

  // Calculate total price
  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      return total + getTicketPrice(seatId);
    }, 0);
  };

  // Show error if no show data is available
  if (!show) {
    return (
      <div className="comedy-booking-page-error">
        <h2>Comedy show information not found</h2>
        <p>Please go back to the comedy page and select a show.</p>
        <Link to="/comedy" className="back-button">Return to Comedy</Link>
      </div>
    );
  }

  return (
    <div 
      className={`comedy-booking-page ${loading ? 'loading' : ''}`}
      style={{
        '--dominant-color': dominantColor,
        '--secondary-color': secondaryColor,
        '--accent-color': accentColor,
        '--text-color': textColor
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {loading && (
        <div className="comedy-booking-loader">
          <div className="loader-spinner"></div>
          <p>Preparing your comedy booking experience...</p>
        </div>
      )}
      
      <div className="comedy-booking-backdrop" style={{ backgroundImage: `url(${show.image})` }}></div>
      
      <div className="comedy-booking-container">
        <div className="comedy-booking-header">
          <div className="header-top">
            <Link to="/comedy" className="back-button">
              <span className="back-icon">←</span>
            </Link>
            <div className="show-headline">
              <h1>{show.name}</h1>
              <div className="show-meta">
                <span className="performer">{show.performer || "Comedy Show"}</span>
                <span className="dot">•</span>
                <span className="runtime">2h</span>
                <div className="rating">
                  <span className="star">★</span>
                  <span>8.4</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="booking-progress">
            <div 
              className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}
              onClick={() => step > 1 && handleStepChange(1)}
            >
              <div className="step-number">1</div>
              <div className="step-label">Date & Time</div>
            </div>
            <div className={`progress-line ${step > 1 ? 'active' : ''}`}></div>
            <div 
              className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}
              onClick={() => step > 2 && handleStepChange(2)}
            >
              <div className="step-number">2</div>
              <div className="step-label">Seats</div>
            </div>
            <div className={`progress-line ${step > 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Payment</div>
            </div>
          </div>
        </div>
        
        <div className="comedy-booking-content" ref={contentRef}>
          <div className="comedy-booking-sidebar">
            <div className="show-poster">
              <img src={show.image} alt={show.name} />
              <div className="poster-caption">
                <div className="caption-item">
                  <span className="caption-icon">📅</span>
                  <span className="caption-text">{show.date}</span>
                </div>
                <div className="caption-item">
                  <span className="caption-icon">🎭</span>
                  <span className="caption-text">Comedy</span>
                </div>
                <div className="caption-item">
                  <span className="caption-icon">⏱️</span>
                  <span className="caption-text">2h</span>
                </div>
              </div>
            </div>
            
            {step > 1 && (
              <div className="booking-summary-sidebar">
                <div className="summary-item">
                  <span className="label">Date:</span>
                  <span className="value">{selectedDate}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Time:</span>
                  <span className="value">{selectedTime}</span>
                </div>
                {step > 2 && (
                  <div className="summary-item">
                    <span className="label">Seats:</span>
                    <span className="value">{selectedSeats.join(', ')}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={`comedy-booking-steps ${animateClass}`}>
            {step === 1 && (
              <div className="date-time-selection">
                <div className="date-selection">
                  <h3>Select Date</h3>
                  <div className="date-options">
                    {dates.map((date, index) => (
                      <div 
                        key={index}
                        className={`date-option ${selectedDate === date.toLocaleDateString() ? 'selected' : ''}`}
                        onClick={() => handleDateSelect(date)}
                      >
                        <div className="day">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="date">{date.getDate()}</div>
                        <div className="month">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="time-selection">
                  <h3>Select Time</h3>
                  <div className="time-options">
                    {showtimes.map((time, index) => (
                      <div 
                        key={index}
                        className={`time-option ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        <span className="time-text">{time}</span>
                        <span className="seats-left">36 seats</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="show-description">
                  <h3>About the Show</h3>
                  <p>{show.description}</p>
                  
                  <div className="show-features">
                    <div className="feature">
                      <span className="feature-icon">🎭</span>
                      <span className="feature-text">Live Comedy</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">🍺</span>
                      <span className="feature-text">Bar Service</span>
                    </div>
                    <div className="feature">
                      <span className="feature-icon">🎟️</span>
                      <span className="feature-text">Reserved Seating</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="seat-selection">
                <h3>Select Your Seats</h3>
                <div className="seat-selection-note">
                  <p>Select one or more seats for the show. Premium seats offer better viewing angle and service.</p>
                </div>
                
                <div className="theater-layout">
                  <div className="stage">
                    <div className="stage-label">STAGE</div>
                  </div>
                  
                  <div className="seats-container">
                    {seats.map((seat) => (
                      <div 
                        key={seat.id}
                        className={`seat ${getSeatStatus(seat.id)} ${getSeatType(seat.id)}`}
                        onClick={() => handleSeatClick(seat.id)}
                      >
                        <span className="seat-label">{seat.id}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="seat-legend">
                    <div className="legend-item">
                      <div className="legend-box available"></div>
                      <span>Available</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box selected"></div>
                      <span>Selected</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box unavailable"></div>
                      <span>Unavailable</span>
                    </div>
                    <div className="legend-item">
                      <div className="legend-box premium available"></div>
                      <span>Premium</span>
                    </div>
                  </div>
                </div>
                
                <div className="selected-seats-summary">
                  <h4>Selected Seats</h4>
                  {selectedSeats.length > 0 ? (
                    <div className="selected-seats-list">
                      {selectedSeats.map((seatId) => (
                        <div key={seatId} className="selected-seat-item">
                          <span className="seat-id">{seatId}</span>
                          <span className="seat-type">{getSeatType(seatId) === 'premium' ? 'Premium' : 'Standard'}</span>
                          <span className="seat-price">
                            ${getTicketPrice(seatId).toFixed(2)} 
                            <span className="price-inr">
                              (₹{convertToINR(getTicketPrice(seatId))})
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-seats-message">No seats selected yet</p>
                  )}
                </div>
              </div>
            )}
            
            {step === 3 && (
              <div className="payment-section">
                <h3>Complete Your Booking</h3>
                
                <div className="booking-summary">
                  <div className="summary-card">
                    <div className="summary-header">
                      <h3 className="summary-heading">Booking Details</h3>
                    </div>
                    
                    <div className="summary-content">
                      <div className="summary-row">
                        <span className="detail-label">Show</span>
                        <span className="detail-value">{show.name}</span>
                      </div>
                      
                      <div className="summary-row">
                        <span className="detail-label">Performer</span>
                        <span className="detail-value">{show.performer || "Various Artists"}</span>
                      </div>
                      
                      <div className="summary-row">
                        <span className="detail-label">Date</span>
                        <span className="detail-value">{selectedDate}</span>
                      </div>
                      
                      <div className="summary-row">
                        <span className="detail-label">Time</span>
                        <span className="detail-value">{selectedTime}</span>
                      </div>
                      
                      <div className="summary-row">
                        <span className="detail-label">Venue</span>
                        <span className="detail-value">{show.location}</span>
                      </div>
                      
                      <div className="summary-row">
                        <span className="detail-label">Seats</span>
                        <span className="detail-value">{selectedSeats.join(', ')}</span>
                      </div>
                      
                      <div className="price-breakdown">
                        <div className="price-row">
                          <span className="price-label">Ticket Price</span>
                          <span className="price-value">
                            ${calculateTotal().toFixed(2)}
                            <span className="price-inr">(₹{convertToINR(calculateTotal())})</span>
                          </span>
                        </div>
                        
                        <div className="price-row">
                          <span className="price-label">Booking Fee</span>
                          <span className="price-value">
                            ${(calculateTotal() * 0.1).toFixed(2)}
                            <span className="price-inr">(₹{convertToINR(calculateTotal() * 0.1)})</span>
                          </span>
                        </div>
                        
                        <div className="price-row">
                          <span className="price-label">Tax</span>
                          <span className="price-value">
                            ${(calculateTotal() * 0.05).toFixed(2)}
                            <span className="price-inr">(₹{convertToINR(calculateTotal() * 0.05)})</span>
                          </span>
                        </div>
                        
                        <div className="price-row total">
                          <span className="price-label">Total Amount</span>
                          <span className="price-value">
                            ${(calculateTotal() * 1.15).toFixed(2)}
                            <span className="price-inr">(₹{convertToINR(calculateTotal() * 1.15)})</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="customer-card">
                    <div className="payment-section">
                      <h4>Payment Method</h4>
                      <div className="payment-methods">
                        <div className="payment-options">
                          <div className="payment-option selected">
                            <div className="payment-icon credit-card"></div>
                            <span>Credit Card</span>
                          </div>
                          <div className="payment-option">
                            <div className="payment-icon paypal"></div>
                            <span>PayPal</span>
                          </div>
                          <div className="payment-option">
                            <div className="payment-icon apple-pay"></div>
                            <span>UPI</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="booking-navigation">
              {step > 1 && (
                <button className="prev-button" onClick={prevStep}>
                  <span className="btn-icon">←</span>
                  <span className="btn-text">Back</span>
                </button>
              )}
              
              {step < 3 ? (
                <button 
                  className="next-button" 
                  onClick={nextStep}
                  disabled={(step === 1 && (!selectedDate || !selectedTime)) || 
                           (step === 2 && selectedSeats.length === 0)}
                >
                  <span className="btn-text">Continue</span>
                  <span className="btn-icon">→</span>
                </button>
              ) : (
                <button className="book-button" onClick={handleBooking}>
                  <span className="btn-text">Confirm Booking</span>
                  <span className="btn-icon">✓</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {showTicket && bookingData && (
        <TicketCard 
          bookingData={bookingData} 
          onClose={handleCloseTicket} 
        />
      )}
    </div>
  );
} 