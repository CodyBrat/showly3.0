import React, { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const textRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse movement for the variable proximity effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Calculate distortion effect for each letter
  useEffect(() => {
    const text = textRef.current;
    if (!text) return;
    
    const letters = text.querySelectorAll('.letter');
    const sensitivity = 100; // Adjust sensitivity of the effect
    const maxDistortion = 50; // Max distortion amount
    
    letters.forEach((letter) => {
      const rect = letter.getBoundingClientRect();
      const letterX = rect.left + rect.width / 2;
      const letterY = rect.top + rect.height / 2;
      
      // Calculate distance between mouse and letter
      const distanceX = mousePosition.x - letterX;
      const distanceY = mousePosition.y - letterY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      
      // Calculate distortion based on proximity
      const distortion = Math.max(0, 1 - distance / sensitivity);
      const letterDistortion = distortion * maxDistortion;
      
      // Apply transformations
      letter.style.transform = `translate(${distortion * -distanceX * 0.1}px, ${distortion * -distanceY * 0.1}px) scale(${1 + distortion * 0.1})`;
      letter.style.filter = `blur(${letterDistortion * 0.05}px)`;
      letter.style.opacity = 1 - (distortion * 0.2);
      letter.style.transition = 'transform 0.1s ease-out, filter 0.1s ease-out, opacity 0.1s ease-out';
    });
  }, [mousePosition]);

  // Sample event data
  const events = [
    {
      id: 1,
      title: "Coldplay World Tour",
      date: "June 15, 2025",
      location: "Madison Square Garden",
      category: "concerts",
      image: "concert-1.jpg",
      price: "$89.99"
    },
    {
      id: 2,
      title: "Dune: Part Three",
      date: "March 20, 2025",
      location: "AMC Theaters",
      category: "movies",
      image: "movie-1.jpg",
      price: "$18.50"
    },
    {
      id: 3,
      title: "Dave Chappelle Live",
      date: "August 5, 2025",
      location: "Comedy Cellar",
      category: "comedy",
      image: "comedy-1.jpg",
      price: "$65.00"
    },
    {
      id: 4,
      title: "Hamilton",
      date: "July 10, 2025",
      location: "Broadway Theater",
      category: "theater",
      image: "theater-1.jpg",
      price: "$150.00"
    },
    {
      id: 5,
      title: "Festival of Lights",
      date: "October 25, 2025",
      location: "Central Park",
      category: "festivals",
      image: "festival-1.jpg",
      price: "$25.00"
    },
    {
      id: 6,
      title: "Taylor Swift: Eras Tour",
      date: "September 12, 2025",
      location: "Wembley Stadium",
      category: "concerts",
      image: "concert-2.jpg",
      price: "$120.00"
    }
  ];

  // Filter events based on category and search
  const filteredEvents = events.filter(event => {
    const matchesCategory = activeCategory === 'all' || event.category === activeCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Event handlers
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="app-wrapper">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <span className="logo-text">showly</span>
          </div>
          
          <div className="navbar-links-desktop">
            <a href="#events" className="nav-link">Events</a>
            <a href="#categories" className="nav-link">Categories</a>
            <a href="#featured" className="nav-link">Featured</a>
            <a href="#pricing" className="nav-link">Pricing</a>
          </div>
          
          <div className="navbar-buttons">
            <button className="login-btn">Log in</button>
            <button className="signup-btn">Sign up</button>
            <button 
              className="menu-toggle-mobile" 
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu */}
      <div className={`navbar-mobile ${isNavOpen ? 'open' : ''}`}>
        <div className="navbar-links-mobile">
          <a href="#events" className="nav-link">Events</a>
          <a href="#categories" className="nav-link">Categories</a>
          <a href="#featured" className="nav-link">Featured</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <div className="mobile-buttons">
            <button className="login-btn">Log in</button>
            <button className="signup-btn">Sign up</button>
          </div>
        </div>
      </div>

      {/* Landing Page Section (100vh) */}
      <div className="landing-page">
        <div className="background">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="light-effect"></div>
        </div>
        
        <div className="speaker-center">
          <div className="dust-1 speaker-dust"></div>
          <div className="dust-2 speaker-dust"></div>
          <div className="dust-3 speaker-dust"></div>
          <div className="dust-4 speaker-dust"></div>
          <div className="dust-5 speaker-dust"></div>
          <div className="dust-6 speaker-dust"></div>
          <div className="dust-7 speaker-dust"></div>
          <div className="dust-8 speaker-dust"></div>
        </div>
        
        <div className="speaker-ring speaker-ring-1"></div>
        <div className="speaker-ring speaker-ring-2"></div>
        <div className="speaker-ring speaker-ring-3"></div>
        
        <div className="music-elements-wrapper">
          <div className="guitar music-element"></div>
          <div className="drums music-element"></div>
          <div className="vinyl music-element"></div>
          <div className="ticket music-element"></div>
          <div className="note-1 music-note music-element"></div>
          <div className="note-2 music-note music-element"></div>
          <div className="note-3 music-note music-element"></div>
          <div className="headphones music-element"></div>
          <div className="microphone music-element"></div>
          
          <div className="equalizer music-element"></div>
          <div className="mixer music-element"></div>
          <div className="note-4 music-note music-element"></div>
          <div className="dj-controller music-element"></div>
        </div>

        <div className="container">
          {/* Brand section */}
          <section className="brand-section">
            <h1 className="brand proximity-text" ref={textRef}>
              <span className="letter">S</span>
              <span className="letter">h</span>
              <span className="letter">o</span>
              <span className="letter">w</span>
              <span className="letter">l</span>
              <span className="letter">y</span>
            </h1>
            <p className="tagline">YOUR GATEWAY TO LIVE ENTERTAINMENT</p>
            
            {/* Hero search bar */}
            {/* <div className="hero-search">
              <span className="search-icon">⌕</span>
              <input 
                type="text" 
                placeholder="Search events, artists, venues..." 
                className="search-input"
              />
            </div> */}
          </section>

          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <div className="arrows">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Event Categories Section */}
      <div className="app-container" id="categories">
        <section className="app-content categories-section">
          <h2 className="section-title" data-decrypt="Browse by Category">Browse by Category</h2>
          <p className="section-subtitle">Find the perfect event that matches your interests</p>
          <div className="section-content-wrapper">
            <div className="categories-container modern">
              <div className="category-item" onClick={() => handleCategoryChange('all')}>
                <div className={`category-icon all-icon ${activeCategory === 'all' ? 'active' : ''}`}></div>
                <span>All Events</span>
              </div>
              <div className="category-item" onClick={() => handleCategoryChange('concerts')}>
                <div className={`category-icon concert-icon ${activeCategory === 'concerts' ? 'active' : ''}`}></div>
                <span>Concerts</span>
              </div>
              <div className="category-item" onClick={() => handleCategoryChange('movies')}>
                <div className={`category-icon movie-icon ${activeCategory === 'movies' ? 'active' : ''}`}></div>
                <span>Movies</span>
              </div>
              <div className="category-item" onClick={() => handleCategoryChange('comedy')}>
                <div className={`category-icon comedy-icon ${activeCategory === 'comedy' ? 'active' : ''}`}></div>
                <span>Comedy</span>
              </div>
              <div className="category-item" onClick={() => handleCategoryChange('theater')}>
                <div className={`category-icon theater-icon ${activeCategory === 'theater' ? 'active' : ''}`}></div>
                <span>Theater</span>
              </div>
              <div className="category-item" onClick={() => handleCategoryChange('festivals')}>
                <div className={`category-icon festival-icon ${activeCategory === 'festivals' ? 'active' : ''}`}></div>
                <span>Festivals</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Events Listing Section */}
      <div className="app-container" id="events">
        <section className="app-content events-section">
          <h2 className="section-title" data-decrypt="Upcoming Events">Upcoming Events</h2>
          <p className="section-subtitle">Discover and book tickets for the hottest events in town</p>
          <div className="search-filter">
            <input 
              type="text" 
              placeholder="Search events..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="event-search"
            />
          </div>
          <div className="section-content-wrapper">
            <div className="events-grid">
              {filteredEvents.length > 0 ? filteredEvents.map((event) => (
                <div className="event-card" key={event.id}>
                  <div className="event-image" style={{backgroundImage: `url(/images/${event.image})`}}>
                    <div className="event-category">{event.category}</div>
                  </div>
                  <div className="event-details">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-info">
                      <div className="event-date">{event.date}</div>
                      <div className="event-location">{event.location}</div>
                    </div>
                    <div className="event-footer">
                      <div className="event-price">{event.price}</div>
                      <button className="book-btn">Book Now</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="no-events">
                  <p>No events found. Try adjusting your search.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Featured Event Section */}
      <div className="app-container" id="featured">
        <section className="app-content featured-section">
          <h2 className="section-title" data-decrypt="Featured Event">Featured Event</h2>
          <p className="section-subtitle">Don't miss out on our specially curated event of the month</p>
          <div className="section-content-wrapper">
            <div className="featured-event">
              <div className="featured-content">
                <div className="featured-info">
                  <div className="featured-date">JULY 12-14, 2025</div>
                  <h3 className="featured-title">Summer Vibes Festival</h3>
                  <p className="featured-description">
                    Join us for the ultimate summer experience with over 50 artists across 5 stages.
                    Three days of music, art, and culture in the heart of downtown.
                  </p>
                  <div className="featured-highlights">
                    <div className="highlight">
                      <span className="highlight-icon location"></span>
                      <span>Central Park, New York City</span>
                    </div>
                    <div className="highlight">
                      <span className="highlight-icon artists"></span>
                      <span>50+ Artists</span>
                    </div>
                    <div className="highlight">
                      <span className="highlight-icon stages"></span>
                      <span>5 Stages</span>
                    </div>
                  </div>
                  <button className="featured-btn">Get Festival Passes</button>
                </div>
                <div className="featured-image">
                  <div className="image-container">
                    <div className="festival-decoration decoration-1"></div>
                    <div className="festival-decoration decoration-2"></div>
                    <div className="festival-decoration decoration-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Pricing Section */}
      <div className="app-container" id="pricing">
        <section className="app-content pricing-section">
          <h2 className="section-title" data-decrypt="Membership Plans">Membership Plans</h2>
          <p className="section-subtitle">Get exclusive benefits with our membership plans</p>
          <div className="section-content-wrapper">
            <div className="pricing-grid">
              <div className="pricing-card basic">
                <div className="pricing-header">
                  <h3 className="plan-name">Basic</h3>
                  <div className="plan-price">Free</div>
                  <p className="plan-billing">Always free</p>
                </div>
                <div className="pricing-features">
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>Event browsing</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>Basic seat selection</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>Email notifications</span>
                  </div>
                </div>
                <button className="pricing-btn basic-btn">Get Started</button>
              </div>
              
              <div className="pricing-card premium">
                <div className="pricing-badge">Popular</div>
                <div className="pricing-header">
                  <h3 className="plan-name">Premium</h3>
                  <div className="plan-price">$12.99</div>
                  <p className="plan-billing">Billed monthly</p>
                </div>
                <div className="pricing-features">
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>All Basic features</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>Early access to tickets</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>No booking fees</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>Exclusive presales</span>
                  </div>
                </div>
                <button className="pricing-btn premium-btn">Subscribe Now</button>
              </div>
              
              <div className="pricing-card vip">
                <div className="pricing-header">
                  <h3 className="plan-name">VIP</h3>
                  <div className="plan-price">$29.99</div>
                  <p className="plan-billing">Billed monthly</p>
                </div>
                <div className="pricing-features">
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>All Premium features</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>VIP seating options</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>Exclusive event access</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>Dedicated support</span>
                  </div>
                  <div className="feature">
                    <span className="feature-icon check"></span>
                    <span>Meet & greet opportunities</span>
                  </div>
                </div>
                <button className="pricing-btn vip-btn">Go VIP</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile App Promotion */}
      <div className="app-container" id="mobile-app">
        <section className="app-content mobile-app-section">
          <h2 className="section-title" data-decrypt="Get the Showly App">Get the Showly App</h2>
          <p className="section-subtitle">
            Book tickets, discover events, and access your tickets on the go. 
            Available for iOS and Android.
          </p>
          <div className="section-content-wrapper">
            <div className="mobile-app-content">
              <div className="mobile-app-info">
                <div className="app-buttons">
                  <button className="app-btn app-store">
                    <span className="app-icon app-store-icon"></span>
                    <span className="app-text">App Store</span>
                  </button>
                  <button className="app-btn play-store">
                    <span className="app-icon play-store-icon"></span>
                    <span className="app-text">Google Play</span>
                  </button>
                </div>
              </div>
              <div className="mobile-app-image">
                <div className="phone-container">
                  <div className="phone-screen"></div>
                  <div className="phone-notch"></div>
                  <div className="app-ui-element ui-1"></div>
                  <div className="app-ui-element ui-2"></div>
                  <div className="app-ui-element ui-3"></div>
                  <div className="app-ui-element ui-4"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Newsletter Section */}
      <div className="app-container" id="newsletter">
        <section className="app-content newsletter-section">
          <h2 className="section-title" data-decrypt="Stay Updated">Stay Updated</h2>
          <p className="section-subtitle">
            Subscribe to our newsletter for the latest events and exclusive offers.
          </p>
          <div className="section-content-wrapper">
            <div className="newsletter-container">
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email address" className="newsletter-input" />
                <button className="newsletter-btn">Subscribe</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer at the end of all content */}
      <div className="footer-container">
        <footer className="footer-expanded">
          <div className="footer-top">
            <div className="footer-logo">
              <span className="logo-text">showly</span>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Explore</h4>
                <a href="#events">Events</a>
                <a href="#categories">Categories</a>
                <a href="#featured">Featured</a>
                <a href="#pricing">Pricing</a>
              </div>
              <div className="footer-column">
                <h4>Support</h4>
                <a href="#">Help Center</a>
                <a href="#">Contact Us</a>
                <a href="#">FAQs</a>
                <a href="#">Ticket Issues</a>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Refund Policy</a>
                <a href="#">Cookie Policy</a>
              </div>
              <div className="footer-column">
                <h4>Follow Us</h4>
                <div className="social-links">
                  <a href="#" className="social-icon instagram"></a>
                  <a href="#" className="social-icon twitter"></a>
                  <a href="#" className="social-icon facebook"></a>
                  <a href="#" className="social-icon youtube"></a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="copyright">ALL RIGHTS RESERVED</div>
            <div className="company">SHOWLY AGENCY © 2025</div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
