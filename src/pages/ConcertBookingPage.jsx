import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import '../styles/ConcertBookingPage.css';
import TicketCard from '../components/TicketCard';

// Conversion rate from USD to INR
const USD_TO_INR = 83.5;

export default function ConcertBookingPage() {
  const location = useLocation();
  const [concert, setConcert] = useState(location.state?.concert || null);
  const [dominantColor, setDominantColor] = useState('rgba(20, 20, 60, 0.9)');
  const [secondaryColor, setSecondaryColor] = useState('rgba(60, 60, 120, 0.8)');
  const [accentColor, setAccentColor] = useState('#ff3366');
  const [textColor, setTextColor] = useState('#ffffff');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedZones, setSelectedZones] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [animateClass, setAnimateClass] = useState('');
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [showTicket, setShowTicket] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  // Generate dates for the event
  const getDates = () => {
    const dates = [];
    const eventDate = concert?.date ? new Date(concert.date) : new Date();
    const startDate = new Date(eventDate);
    
    // 3 dates before the event, the event day, and 3 dates after
    for (let i = -3; i <= 3; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  // Generate showtimes
  const getShowtimes = () => {
    return ['6:00 PM', '7:30 PM', '8:00 PM', '9:00 PM'];
  };

  // Generate zones for the venue
  const generateZones = () => {
    // Different zones in a concert venue
    const zoneTypes = [
      { name: 'FRONT ROW', price: 299.99, capacity: 20, type: 'premium' },
      { name: 'PIT', price: 199.99, capacity: 50, type: 'premium' },
      { name: 'VIP SEATED', price: 149.99, capacity: 100, type: 'vip' },
      { name: 'LOWER LEVEL', price: 99.99, capacity: 200, type: 'standard' },
      { name: 'UPPER LEVEL', price: 69.99, capacity: 300, type: 'standard' },
      { name: 'LAWN', price: 49.99, capacity: 400, type: 'lawn' }
    ];
    
    return zoneTypes.map(zone => {
      const randomSoldPercentage = Math.random() * 0.7; // 0-70% sold
      const availableCapacity = Math.floor(zone.capacity * (1 - randomSoldPercentage));
      
      return {
        ...zone,
        id: zone.name.replace(/\s+/g, '-').toLowerCase(),
        available: availableCapacity,
        sold: zone.capacity - availableCapacity
      };
    });
  };

  const [dates] = useState(getDates());
  const [showtimes] = useState(getShowtimes());
  const [zones] = useState(generateZones());

  // Extract dominant color from image
  useEffect(() => {
    if (concert && concert.image) {
      setLoading(true);
      
      // Using canvas to extract colors
      const getImageColors = () => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = concert.image;
        
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
          
          // Create a vibrant accent color based on music genre
          let accent;
          if (concert.tags?.includes('rock')) {
            accent = { r: 220, g: 50, b: 50 }; // Red for rock
          } else if (concert.tags?.includes('electronic')) {
            accent = { r: 80, g: 200, b: 240 }; // Blue for electronic
          } else if (concert.tags?.includes('jazz')) {
            accent = { r: 200, g: 150, b: 50 }; // Gold for jazz
          } else if (concert.tags?.includes('classical')) {
            accent = { r: 180, g: 140, b: 220 }; // Purple for classical
          } else {
            accent = { r: 0, g: 230, b: 150 }; // Teal default
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
          if (concert.tags?.includes('rock')) {
            setDominantColor('rgba(80, 10, 20, 0.95)');
            setSecondaryColor('rgba(140, 30, 40, 0.85)');
            setAccentColor('#ff3333');
          } else if (concert.tags?.includes('electronic')) {
            setDominantColor('rgba(10, 20, 50, 0.95)');
            setSecondaryColor('rgba(20, 40, 80, 0.85)');
            setAccentColor('#33ccff');
          } else {
            setDominantColor('rgba(30, 30, 60, 0.95)');
            setSecondaryColor('rgba(60, 60, 100, 0.85)');
            setAccentColor('#33ffaa');
          }
        };
      };
      
      getImageColors();
    }
  }, [concert]);

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

  const handleZoneSelection = (zoneId) => {
    const selectedZone = zones.find(z => z.id === zoneId);
    
    if (selectedZone && selectedZone.available > 0) {
      if (selectedZones.find(z => z.id === zoneId)) {
        // If already selected, remove it
        setSelectedZones(selectedZones.filter(z => z.id !== zoneId));
      } else {
        // Add with quantity 1
        setSelectedZones([...selectedZones, { 
          id: zoneId, 
          name: selectedZone.name,
          price: selectedZone.price,
          type: selectedZone.type,
          quantity: 1 
        }]);
      }
    }
  };

  const updateZoneQuantity = (zoneId, newQuantity) => {
    const zone = zones.find(z => z.id === zoneId);
    
    if (zone && newQuantity > 0 && newQuantity <= zone.available) {
      setSelectedZones(selectedZones.map(z => 
        z.id === zoneId ? { ...z, quantity: newQuantity } : z
      ));
    }
  };

  const isZoneSelected = (zoneId) => {
    return selectedZones.some(z => z.id === zoneId);
  };

  const getZoneQuantity = (zoneId) => {
    const zone = selectedZones.find(z => z.id === zoneId);
    return zone ? zone.quantity : 0;
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
    } else if (step === 2 && selectedZones.length > 0) {
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
      title: concert.title,
      artist: concert.artist,
      date: selectedDate,
      time: selectedTime,
      venue: concert.location,
      seatsInfo: selectedZones.map(zone => `${zone.name} (${zone.quantity})`).join(', '),
      bookingId: Math.random().toString(36).substring(2, 10).toUpperCase(),
      type: 'concert',
      posterUrl: concert.bannerImage || concert.image
    };
    
    setBookingData(newBookingData);
    
    setTimeout(() => {
      setShowTicket(true);
    }, 800);
  };

  const handleCloseTicket = () => {
    setShowTicket(false);
  };

  // Convert USD to INR
  const convertToINR = (usdPrice) => {
    return Math.round(usdPrice * USD_TO_INR);
  };

  const calculateTotal = () => {
    return selectedZones.reduce((total, zone) => {
      return total + (zone.price * zone.quantity);
    }, 0);
  };

  if (!concert) {
    return (
      <div className="concert-booking-page-error">
        <h2>Concert information not found</h2>
        <p>Please go back to the concerts page and select a concert.</p>
        <Link to="/concerts" className="back-button">Return to Concerts</Link>
      </div>
    );
  }

  return (
    <div 
      className={`concert-booking-page ${loading ? 'loading' : ''}`}
      style={{
        '--dominant-color': dominantColor,
        '--secondary-color': secondaryColor,
        '--accent-color': accentColor,
        '--text-color': textColor
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {loading && (
        <div className="concert-booking-loader">
          <div className="loader-equalizer">
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
          </div>
          <p>Setting up your concert experience...</p>
        </div>
      )}
      
      <div className="concert-booking-backdrop" style={{ backgroundImage: `url(${concert.bannerImage || concert.image})` }}></div>
      
      <div className="concert-booking-container">
        <div className="concert-booking-header">
          <div className="header-top">
            <Link to="/concerts" className="back-button">
              <span className="back-icon">←</span>
            </Link>
            <div className="concert-headline">
              <h1>{concert.title}</h1>
              <div className="concert-meta">
                <span className="artist">{concert.artist}</span>
                <span className="dot">•</span>
                <span className="location">{concert.location}</span>
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
            <div className={`progress-line ${step > 1 ? 'active' : ''}`}>
              <div className="music-note">♪</div>
            </div>
            <div 
              className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}
              onClick={() => step > 2 && handleStepChange(2)}
            >
              <div className="step-number">2</div>
              <div className="step-label">Zones</div>
            </div>
            <div className={`progress-line ${step > 2 ? 'active' : ''}`}>
              <div className="music-note">♫</div>
            </div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Payment</div>
            </div>
          </div>
        </div>
        
        <div className="concert-booking-content" ref={contentRef}>
          <div className="concert-booking-sidebar">
            <div className="concert-poster">
              <img src={concert.image} alt={concert.title} />
              
              <div className="vinyl-disc">
                <div className="vinyl-grooves"></div>
                <div className="vinyl-label">
                  <div className="vinyl-hole"></div>
                </div>
              </div>
              
              <div className="poster-caption">
                <div className="caption-item">
                  <span className="caption-icon">🎵</span>
                  <span className="caption-text">{concert.tags ? concert.tags.join(', ') : 'Music'}</span>
                </div>
                <div className="caption-item">
                  <span className="caption-icon">👥</span>
                  <span className="caption-text">{concert.artist}</span>
                </div>
                <div className="caption-item">
                  <span className="caption-icon">📍</span>
                  <span className="caption-text">{concert.location}</span>
                </div>
              </div>
            </div>
            
            {/* Show lineup if available */}
            {concert.lineup && concert.lineup.length > 0 && (
              <div className="lineup-sidebar">
                <h3 className="sidebar-title">Lineup</h3>
                <ul className="lineup-list">
                  {concert.lineup.map((artist, index) => (
                    <li key={index} className="lineup-artist">
                      <span className="artist-number">{index + 1}</span>
                      <span className="artist-name">{artist}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Show booking summary when applicable */}
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
                {step > 2 && selectedZones.length > 0 && (
                  <div className="summary-item zones-summary">
                    <span className="label">Zones:</span>
                    <div className="value zones-list">
                      {selectedZones.map(zone => (
                        <div key={zone.id} className="zone-summary-item">
                          <span className="zone-name">{zone.name}</span>
                          <span className="zone-quantity">x{zone.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className={`concert-booking-steps ${animateClass}`}>
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
                        <div className="music-icon">
                          {index % 3 === 0 ? '♪' : index % 3 === 1 ? '♫' : '♬'}
                        </div>
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
                        <div className="time-details">
                          <span className="doors-open">Doors open {index % 2 === 0 ? '1 hour' : '1.5 hours'} before</span>
                          <span className="capacity-indicator">{80 - (index * 10)}% availability</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="venue-info">
                  <div className="venue-name">
                    <span className="venue-icon">🎤</span>
                    <span>{concert.location}</span>
                  </div>
                  <div className="venue-amenities">
                    <span className="amenity">Audio System: L-Acoustics</span>
                    <span className="amenity">Bars</span>
                    <span className="amenity">Merchandise</span>
                  </div>
                  
                  {concert.description && (
                    <div className="concert-description">
                      <h4>About This Event</h4>
                      <p>{concert.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="zone-selection">
                <div className="zone-info-header">
                  <h3>Select Your Zones</h3>
                  <p className="zone-instruction">Choose your preferred zones in the venue map below</p>
                </div>
                
                <div className="venue-visualization">
                  <div className="stage">
                    <div className="stage-label">STAGE</div>
                    <div className="stage-elements">
                      <div className="microphone-stand"></div>
                      <div className="drum-set"></div>
                      <div className="speaker"></div>
                      <div className="speaker"></div>
                    </div>
                    <div className="stage-lights">
                      <div className="stage-light"><div className="light-beam"></div></div>
                      <div className="stage-light"><div className="light-beam"></div></div>
                      <div className="stage-light"><div className="light-beam"></div></div>
                      <div className="stage-light"><div className="light-beam"></div></div>
                      <div className="stage-light"><div className="light-beam"></div></div>
                    </div>
                  </div>
                  
                  <div className="venue-map">
                    {zones.map((zone) => (
                      <div 
                        key={zone.id}
                        className={`venue-zone ${zone.type} ${isZoneSelected(zone.id) ? 'selected' : ''} ${zone.available === 0 ? 'sold-out' : ''}`}
                        onClick={() => handleZoneSelection(zone.id)}
                      >
                        <div className="zone-name">{zone.name}</div>
                        <div className="zone-availability">
                          {zone.available === 0 ? 'SOLD OUT' : `${zone.available} available`}
                        </div>
                        <div className={`zone-price ${zone.type}`}>₹{convertToINR(zone.price)}</div>
                      </div>
                    ))}
                    
                    <div className="venue-indicators">
                      <div className="indicator sound-booth">SOUND</div>
                      <div className="indicator bar">BAR</div>
                      <div className="indicator bar">BAR</div>
                      <div className="indicator entrance">ENTRANCE</div>
                    </div>
                    
                    {/* Crowd icons at the bottom of venue map */}
                    <div className="crowd-icons">
                      {[...Array(10)].map((_, index) => (
                        <div key={index} className="crowd-icon"></div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="zone-legend">
                  <div className="legend-item">
                    <div className="zone-sample premium"></div>
                    <span>Premium</span>
                  </div>
                  <div className="legend-item">
                    <div className="zone-sample vip"></div>
                    <span>VIP</span>
                  </div>
                  <div className="legend-item">
                    <div className="zone-sample standard"></div>
                    <span>Standard</span>
                  </div>
                  <div className="legend-item">
                    <div className="zone-sample lawn"></div>
                    <span>Lawn</span>
                  </div>
                </div>
                
                <div className="selected-zones-summary">
                  {selectedZones.length > 0 ? (
                    <>
                      <div className="summary-title">
                        <h3>Selected Zones</h3>
                        <span className="ticket-count">{selectedZones.reduce((sum, zone) => sum + zone.quantity, 0)} tickets</span>
                      </div>
                      <div className="selected-zones-grid">
                        {selectedZones.map(zone => (
                          <div key={zone.id} className={`selected-zone-item ${zone.type}`}>
                            <div className="zone-details">
                              <span className="selected-zone-name">{zone.name}</span>
                              <span className="selected-zone-price">₹{convertToINR(zone.price)}</span>
                            </div>
                            <div className="zone-quantity-control">
                              <button 
                                className="quantity-btn decrease"
                                onClick={() => updateZoneQuantity(zone.id, zone.quantity - 1)}
                                disabled={zone.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="zone-quantity">{zone.quantity}</span>
                              <button 
                                className="quantity-btn increase"
                                onClick={() => updateZoneQuantity(zone.id, zone.quantity + 1)}
                                disabled={zone.quantity >= (zones.find(z => z.id === zone.id)?.available || 0)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="no-zones-selected">
                      <div className="empty-selection-icon">🎸</div>
                      <p>No zones selected</p>
                      <p className="hint">Select your preferred zones from the venue map</p>
                    </div>
                  )}
                </div>
                
                <div className="zone-info-footer">
                  <div className="zone-policy">
                    <h4>Ticket Policy</h4>
                    <ul>
                      <li>Tickets are non-refundable after purchase</li>
                      <li>A valid ID is required for entry</li>
                      <li>No professional cameras or recording equipment allowed</li>
                    </ul>
                  </div>
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
                        <span className="label">Concert:</span>
                        <span className="value">{concert.title}</span>
                      </div>
                      <div className="summary-item">
                        <span className="label">Artist:</span>
                        <span className="value">{concert.artist}</span>
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
                        <span className="label">Venue:</span>
                        <span className="value">{concert.location}</span>
                      </div>
                    </div>
                    
                    <div className="summary-section">
                      <h3 className="summary-heading">Your Tickets</h3>
                      <div className="selected-zones-grid summary-zones">
                        {selectedZones.map(zone => (
                          <div key={zone.id} className={`selected-zone-item ${zone.type}`}>
                            <div className="zone-details">
                              <span className="selected-zone-name">{zone.name}</span>
                              <span className="selected-zone-type">{zone.type.toUpperCase()}</span>
                            </div>
                            <div className="zone-price-info">
                              <span className="selected-zone-quantity">{zone.quantity} × ₹{convertToINR(zone.price)}</span>
                              <span className="selected-zone-total">₹{convertToINR(zone.price * zone.quantity)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="payment-details">
                    <h3 className="summary-heading">Payment Information</h3>
                    <div className="price-breakdown">
                      <div className="price-item">
                        <span className="price-label">
                          Tickets ({selectedZones.reduce((sum, zone) => sum + zone.quantity, 0)})
                        </span>
                        <span className="price-value">₹{convertToINR(calculateTotal())}</span>
                      </div>
                      <div className="price-item">
                        <span className="price-label">Booking Fee</span>
                        <span className="price-value">₹{convertToINR(2.99)}</span>
                      </div>
                      <div className="price-item">
                        <span className="price-label">GST (18%)</span>
                        <span className="price-value">₹{convertToINR(calculateTotal() * 0.18)}</span>
                      </div>
                      {concert.tags?.includes('rock') && (
                        <div className="price-item discount">
                          <span className="price-label">Rock Fan Discount</span>
                          <span className="price-value">-₹{convertToINR(5.0)}</span>
                        </div>
                      )}
                      <div className="price-item total">
                        <span className="price-label">Total</span>
                        <span className="price-value">₹{convertToINR(
                          calculateTotal() + 
                          2.99 + 
                          (calculateTotal() * 0.18) - 
                          (concert.tags?.includes('rock') ? 5.0 : 0)
                        )}</span>
                      </div>
                    </div>
                    
                    <div className="payment-methods">
                      <h4>Select Payment Method</h4>
                      <div className="payment-options">
                        <div className="payment-option selected">
                          <div className="payment-icon credit-card"></div>
                          <span>Credit Card</span>
                        </div>
                        <div className="payment-option">
                          <div className="payment-icon upi"></div>
                          <span>UPI</span>
                        </div>
                        <div className="payment-option">
                          <div className="payment-icon wallet"></div>
                          <span>Wallet</span>
                        </div>
                      </div>
                      
                      <div className="fan-club-membership">
                        <div className="membership-checkbox">
                          <input type="checkbox" id="fan-club" />
                          <label htmlFor="fan-club">Join the {concert.artist} Fan Club</label>
                        </div>
                        <p className="membership-benefits">Get early access to future ticket sales and exclusive merchandise</p>
                      </div>
                      
                      <div className="ticket-delivery">
                        <h4>Ticket Delivery</h4>
                        <div className="delivery-option selected">
                          <div className="delivery-icon email"></div>
                          <div className="delivery-details">
                            <span className="delivery-name">Email</span>
                            <span className="delivery-description">Tickets will be sent to your email</span>
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
                           (step === 2 && selectedZones.length === 0)}
                >
                  <span className="btn-text">Continue</span>
                  <span className="btn-icon">→</span>
                </button>
              ) : (
                <button className="book-button" onClick={handleBooking}>
                  <span className="btn-text">Confirm Booking</span>
                  <span className="btn-icon">🎵</span>
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