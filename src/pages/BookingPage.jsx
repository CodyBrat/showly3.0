import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import '../styles/BookingPage.css';
import TicketCard from '../components/TicketCard';

// Conversion rate from USD to INR
const USD_TO_INR = 83.5;

export default function BookingPage() {
  const location = useLocation();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [dominantColor, setDominantColor] = useState('rgba(20, 20, 30, 0.9)');
  const [secondaryColor, setSecondaryColor] = useState('rgba(60, 60, 80, 0.8)');
  const [accentColor, setAccentColor] = useState('#ff3366');
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

  // Generate dates for the next 7 days
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

  // Generate showtimes
  const getShowtimes = () => {
    return ['10:00 AM', '12:30 PM', '3:00 PM', '6:30 PM', '9:00 PM'];
  };

  // Generate theater seats (5 rows of 8 seats)
  const generateSeats = () => {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seats = [];
    
    // VIP rows (first two rows)
    for (const row of rows.slice(0, 2)) {
      for (let i = 1; i <= 8; i++) {
        const seatId = `${row}${i}`;
        const randomUnavailable = Math.random() < 0.2; // 20% chance a seat is unavailable
        seats.push({
          id: seatId,
          row: row,
          number: i,
          status: randomUnavailable ? 'unavailable' : 'available',
          type: 'vip'
        });
      }
    }
    
    // Standard rows
    for (const row of rows.slice(2)) {
      for (let i = 1; i <= 8; i++) {
        const seatId = `${row}${i}`;
        const randomUnavailable = Math.random() < 0.2; // 20% chance a seat is unavailable
        seats.push({
          id: seatId,
          row: row,
          number: i,
          status: randomUnavailable ? 'unavailable' : 'available',
          type: 'standard'
        });
      }
    }
    
    return seats;
  };

  const [dates] = useState(getDates());
  const [showtimes] = useState(getShowtimes());
  const [seats] = useState(generateSeats());

  // Extract dominant color from image
  useEffect(() => {
    if (movie && movie.image) {
      setLoading(true);
      
      // Using canvas to extract colors
      const getImageColors = () => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = movie.image;
        
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          // Set canvas size to match image
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Draw image to canvas
          ctx.drawImage(img, 0, 0, img.width, img.height);
          
          // Sample colors from different parts of the image
          const topData = ctx.getImageData(0, 0, img.width, Math.floor(img.height * 0.3)).data;
          const middleData = ctx.getImageData(0, Math.floor(img.height * 0.3), img.width, Math.floor(img.height * 0.4)).data;
          const bottomData = ctx.getImageData(0, Math.floor(img.height * 0.7), img.width, Math.floor(img.height * 0.3)).data;
          
          // Calculate average colors from different parts of the image
          const topColor = getAverageColor(topData);
          const middleColor = getAverageColor(middleData);
          const bottomColor = getAverageColor(bottomData);
          
          // Use the darkest color as dominant and lightest as secondary
          const colors = [topColor, middleColor, bottomColor].sort((a, b) => 
            (a.r + a.g + a.b) - (b.r + b.g + b.b)
          );
          
          const dominant = colors[0];
          const secondary = colors[2];
          
          // Create a vibrant accent color
          let accent;
          if (movie.genre.includes('Action')) {
            accent = { r: 255, g: 60, b: 60 }; // Red
          } else if (movie.genre.includes('Adventure')) {
            accent = { r: 30, g: 144, b: 255 }; // Bright blue
          } else if (movie.genre.includes('Drama')) {
            accent = { r: 155, g: 89, b: 182 }; // Purple
          } else if (movie.genre.includes('Sci-Fi')) {
            accent = { r: 0, g: 210, b: 211 }; // Teal
          } else if (movie.genre.includes('Comedy')) {
            accent = { r: 255, g: 175, b: 25 }; // Orange
          } else {
            accent = { r: 255, g: 51, b: 102 }; // Pink
          }
          
          // Set colors with proper opacity
          setDominantColor(`rgba(${dominant.r}, ${dominant.g}, ${dominant.b}, 0.95)`);
          setSecondaryColor(`rgba(${secondary.r}, ${secondary.g}, ${secondary.b}, 0.85)`);
          setAccentColor(`rgb(${accent.r}, ${accent.g}, ${accent.b})`);
          
          // Set text color based on luminance of dominant color
          const luminance = (0.299 * dominant.r + 0.587 * dominant.g + 0.114 * dominant.b) / 255;
          setTextColor(luminance > 0.5 ? '#000000' : '#ffffff');
          
          setLoading(false);
          setAnimateClass('fade-in');
        };
        
        img.onerror = () => {
          console.error("Error loading image for color extraction");
          setLoading(false);
          
          // Fallback colors
          if (movie.genre.includes('Action')) {
            setDominantColor('rgba(120, 20, 20, 0.95)');
            setSecondaryColor('rgba(180, 50, 50, 0.85)');
            setAccentColor('#ff3333');
          } else if (movie.genre.includes('Adventure')) {
            setDominantColor('rgba(20, 60, 100, 0.95)');
            setSecondaryColor('rgba(40, 90, 150, 0.85)');
            setAccentColor('#3399ff');
          } else if (movie.genre.includes('Drama')) {
            setDominantColor('rgba(50, 30, 80, 0.95)');
            setSecondaryColor('rgba(90, 60, 120, 0.85)');
            setAccentColor('#9b59b6');
          } else if (movie.genre.includes('Sci-Fi')) {
            setDominantColor('rgba(15, 60, 60, 0.95)');
            setSecondaryColor('rgba(30, 90, 90, 0.85)');
            setAccentColor('#00d2d3');
          } else {
            setDominantColor('rgba(30, 30, 45, 0.95)');
            setSecondaryColor('rgba(60, 60, 80, 0.85)');
            setAccentColor('#ff3366');
          }
        };
      };
      
      getImageColors();
    }
  }, [movie]);

  // Helper function to get average color from image data
  const getAverageColor = (data) => {
    let r = 0, g = 0, b = 0, count = 0;
    
    // Sample every 20th pixel to improve performance
    for (let i = 0; i < data.length; i += 80) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    
    return {
      r: Math.floor(r / count),
      g: Math.floor(g / count),
      b: Math.floor(b / count)
    };
  };

  // Transition to next step with animation
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

  const getSeatStatus = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat) return 'unavailable';
    if (seat.status === 'unavailable') return 'unavailable';
    return selectedSeats.includes(seatId) ? 'selected' : 'available';
  };

  const getSeatType = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return seat ? seat.type : 'standard';
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.toLocaleDateString());
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const nextStep = () => {
    if (step === 1 && selectedDate && selectedTime) {
      handleStepChange(2);
    } else if (step === 2 && selectedSeats.length > 0) {
      handleStepChange(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      handleStepChange(step - 1);
    }
  };

  const handleBooking = () => {
    setAnimateClass('success-animation');
    
    // Create the booking data object for the ticket
    const newBookingData = {
      title: movie.title,
      date: selectedDate,
      time: selectedTime,
      venue: movie.location || 'Cinema City',
      seatsInfo: selectedSeats.join(', '),
      bookingId: Math.random().toString(36).substring(2, 10).toUpperCase(),
      type: 'movie',
      posterUrl: movie.poster_path || movie.backdrop_path || movie.imageUrl,
      director: movie.director
    };
    
    setBookingData(newBookingData);
    
    setTimeout(() => {
      setShowTicket(true);
    }, 800);
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
  };

  // Calculate ticket prices
  const getTicketPrice = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return seat && seat.type === 'vip' ? 16.99 : 12.99;
  };

  // Convert USD to INR
  const convertToINR = (usdPrice) => {
    return Math.round(usdPrice * USD_TO_INR);
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      return total + getTicketPrice(seatId);
    }, 0);
  };

  if (!movie) {
    return (
      <div className="booking-page-error">
        <h2>Movie information not found</h2>
        <p>Please go back to the movies page and select a movie.</p>
        <Link to="/movies" className="back-button">Return to Movies</Link>
      </div>
    );
  }

  return (
    <div 
      className={`booking-page ${loading ? 'loading' : ''}`}
      style={{
        '--dominant-color': dominantColor,
        '--secondary-color': secondaryColor,
        '--accent-color': accentColor,
        '--text-color': textColor
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {loading && (
        <div className="booking-loader">
          <div className="loader-spinner"></div>
          <p>Preparing your booking experience...</p>
        </div>
      )}
      
      <div className="booking-backdrop" style={{ backgroundImage: `url(${movie.bannerImage || movie.image})` }}></div>
      
      <div className="booking-container">
        <div className="booking-header">
          <div className="header-top">
          <Link to="/movies" className="back-button">
            <span className="back-icon">←</span>
          </Link>
          <div className="movie-headline">
            <h1>{movie.title}</h1>
              <div className="movie-meta">
                <span className="genre">{movie.genre}</span>
                <span className="dot">•</span>
                <span className="runtime">2h 15min</span>
                <div className="rating">
                  <span className="star">★</span>
                  <span>8.6</span>
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
        
        <div className="booking-content" ref={contentRef}>
          <div className="booking-sidebar">
            <div className="movie-poster">
              <img src={movie.image} alt={movie.title} />
              <div className="poster-caption">
                <div className="caption-item">
                  <span className="caption-icon">📅</span>
                  <span className="caption-text">{movie.caption}</span>
                </div>
                <div className="caption-item">
                  <span className="caption-icon">🎭</span>
                  <span className="caption-text">{movie.genre}</span>
                </div>
                <div className="caption-item">
                  <span className="caption-icon">⏱️</span>
                  <span className="caption-text">2h 15min</span>
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
          
          <div className={`booking-steps ${animateClass}`}>
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
                        <span className="seats-left">42 seats</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="theater-info">
                  <div className="theater-name">
                    <span className="theater-icon">🎬</span>
                    <span>Cineplex IMAX - Screen 4</span>
                  </div>
                  <div className="theater-amenities">
                    <span className="amenity">Dolby Atmos</span>
                    <span className="amenity">4K</span>
                    <span className="amenity">Recliners</span>
                  </div>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <div className="seat-selection">
                <div className="seat-pricing-legend">
                  <div className="pricing-item">
                    <div className="pricing-color vip"></div>
                    <div className="pricing-details">
                      <div className="pricing-label">VIP</div>
                      <div className="pricing-value">₹{convertToINR(16.99)}</div>
                    </div>
                  </div>
                  <div className="pricing-item">
                    <div className="pricing-color standard"></div>
                    <div className="pricing-details">
                      <div className="pricing-label">Standard</div>
                      <div className="pricing-value">₹{convertToINR(12.99)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="screen-container">
                  <div className="screen">Screen</div>
                  <div className="screen-shadow"></div>
                </div>
                
                <div className="seating-plan">
                  {seats.map((seat) => (
                    <div 
                      key={seat.id}
                      className={`seat ${getSeatStatus(seat.id)} ${getSeatType(seat.id)}`}
                      onClick={() => handleSeatClick(seat.id)}
                    >
                      {seat.id}
                    </div>
                  ))}
                </div>
                
                <div className="seat-legend">
                  <div className="legend-item">
                    <div className="seat-sample available"></div>
                    <span>Available</span>
                  </div>
                  <div className="legend-item">
                    <div className="seat-sample selected"></div>
                    <span>Selected</span>
                  </div>
                  <div className="legend-item">
                    <div className="seat-sample unavailable"></div>
                    <span>Unavailable</span>
                  </div>
                </div>

                <div className="selected-seats-summary">
                  {selectedSeats.length > 0 ? (
                    <>
                      <div className="summary-title">
                        <h3>Selected Seats</h3>
                        <span className="count">{selectedSeats.length}</span>
                      </div>
                      <div className="selected-seats-grid">
                        {selectedSeats.map(seatId => (
                          <div key={seatId} className={`selected-seat-item ${getSeatType(seatId)}`}>
                            <span className="selected-seat-id">{seatId}</span>
                            <span className="selected-seat-price">₹{convertToINR(getTicketPrice(seatId))}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="no-seats-selected">
                      <p>No seats selected</p>
                      <p className="hint">Select your preferred seats from the seating plan</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="booking-summary">
                <div className="summary-container">
                  <div className="summary-details">
                    <div className="summary-section">
                      <h3 className="summary-heading">Booking Details</h3>
                      <div className="summary-item">
                        <span className="label">Movie:</span>
                        <span className="value">{movie.title}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Date:</span>
                        <span className="value">{selectedDate}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Time:</span>
                        <span className="value">{selectedTime}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Theater:</span>
                        <span className="value">Cineplex IMAX - Screen 4</span>
                      </div>
                    </div>
                    
                    <div className="summary-section">
                      <h3 className="summary-heading">Your Seats</h3>
                      <div className="selected-seats-grid summary-seats">
                        {selectedSeats.map(seatId => (
                          <div key={seatId} className={`selected-seat-item ${getSeatType(seatId)}`}>
                            <span className="selected-seat-id">{seatId}</span>
                            <span className="selected-seat-type">{getSeatType(seatId) === 'vip' ? 'VIP' : 'Standard'}</span>
                            <span className="selected-seat-price">₹{convertToINR(getTicketPrice(seatId))}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="payment-details">
                    <h3 className="summary-heading">Payment Information</h3>
                    <div className="price-breakdown">
                      <div className="price-item">
                        <span className="price-label">Tickets ({selectedSeats.length})</span>
                        <span className="price-value">₹{convertToINR(calculateTotal())}</span>
                      </div>
                      <div className="price-item">
                        <span className="price-label">Convenience Fee</span>
                        <span className="price-value">₹{convertToINR(1.99)}</span>
                      </div>
                      <div className="price-item discount">
                        <span className="price-label">Member Discount</span>
                        <span className="price-value">-₹{convertToINR(2.50)}</span>
                      </div>
                      <div className="price-item total">
                        <span className="price-label">Total</span>
                        <span className="price-value">₹{convertToINR(calculateTotal() + 1.99 - 2.50)}</span>
                      </div>
                    </div>
                    
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
                          <span>Apple Pay</span>
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