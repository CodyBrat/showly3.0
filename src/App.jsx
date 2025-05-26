import { useState, useRef, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import ShowlyTitle from './components/ShowlyTitle'
import DecryptedText from './components/DecryptedText'
import CircularGallery from './components/CircularGallery'
import TiltedCard from './components/TiltedCard'
import Movies from './pages/Movies'
import Concerts from './pages/Concerts'
import Comedy from './pages/Comedy'
import About from './pages/About'
import Contact from './pages/Contact'
import BookingPage from './pages/BookingPage'
import ConcertBookingPage from './pages/ConcertBookingPage'
import ComedyBookingPage from './pages/ComedyBookingPage'
import favicon from './assets/favicon.png'
// import LoadingScreen from './components/LoadingScreen'

function HomePage() {
  const concertCarouselRef = useRef(null)
  const [activeConcert, setActiveConcert] = useState(0)

  const categoryItems = [
    { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', text: 'Movies' },
    { image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', text: 'Food' },
    { image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', text: 'Concerts' },
    { image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', text: 'Music' },
    { image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', text: 'Comedy' },
    { image: 'https://images.unsplash.com/photo-1579710039144-85d6bdffddc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', text: 'Sports' }
  ]

  const movies = [
    {
      image: "https://m.media-amazon.com/images/M/MV5BZWU4NDY0ODktOGI3OC00NWE1LWIwYmQtNmJiZWU3NmZlMDhkXkEyXkFqcGc@._V1_.jpg",
      title: "Until Dawn",
      caption: "25th April 2025"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Kesari_Chapter_2.jpg/250px-Kesari_Chapter_2.jpg",
      title: "Kesari Chapter 2",
      caption: "In Cinemas • 18th April 2025"
    },
    {
      image: "https://m.media-amazon.com/images/M/MV5BNjIwZWY4ZDEtMmIxZS00NDA4LTg4ZGMtMzUwZTYyNzgxMzk5XkEyXkFqcGc@._V1_.jpg",
      title: "Sinner",
      caption: "In Cinemas • 18th April 2025"
    },
    {
      image: "https://image.tmdb.org/t/p/original/iPPTGh2OXuIv6d7cwuoPkw8govp.jpg",
      title: "Minecraft: The Movie",
      caption: "In Cinemas • 4th April 2025"
    },
    {
      image: "https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2025/02/03190714/rzfqeLdHIysJGrspMICyedpqDqt-scaled.jpg",
      title: "Paddington in Peru",
      caption: "In Cinemas • 18th April 2025"
    },
    {
      image: "https://m.media-amazon.com/images/M/MV5BYjhkZjM3ZWYtMjUxMS00YzhlLTkxZWYtMzhkMzFhOTQ1NjRkXkEyXkFqcGc@._V1_.jpg",
      title: "Amateur",
      caption: "In Cinemas • 11th April 2025"
    },
    {
      image: "https://dx35vtwkllhj9.cloudfront.net/the-chosen-inc/the-chosen-last-supper/images/gallery/image1.jpg",
      title: "The Chosen: Last Supper",
      caption: "In Cinemas • 17th April 2025"
    },
    {
      image: "https://stat5.bollywoodhungama.in/wp-content/uploads/2023/10/Chhaava.jpg",
      title: "Chhaava",
      caption: "In Cinemas • 14th April 2025"
    }
  ]

  const concerts = [
    {
      title: 'Vilen India Tour',
      caption: 'Live • Apr 2025',
      image: 'https://in.bmscdn.com/events/moviecard/ET00441603.jpg'
    },
    {
      title: 'Guns N\' Roses',
      caption: 'Experience LDG • Aug 2024',
      image: 'https://in.bmscdn.com/events/moviecard/ET00437139.jpg'
    },
    {
      title: 'Dil-luminati Tour',
      caption: 'Tickets Available • Sep 2024',
      image: 'https://images.news18.com/webstories/uploads/2024/09/Screenshot-2024-09-28-at-12.48.03-PM-2024-09-5a66cbfd9ce9343301181344c6a18690.png'
    },
    {
      title: 'Seedhe Maut',
      caption: 'Limited Seats • Oct 2024',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00437060-mdlmgewvgb-portrait.jpg'
    },
    {
      title: 'Shreya Ghoshal Live',
      caption: 'Live • Apr 2025',
      image: 'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00438542-fvkbeggjke-portrait.jpg' 
    }
  ]

  const comedy = [
    {
      image: "https://assets-in.bmscdn.com/discovery-catalog/events/et00355125-pzenufexta-portrait.jpg",
      title: "Kisi Ko Batana Mat",
      description: "A live stand-up comedy show performed by Indian comedian Anubhav Singh Bassi",
      date: "May 9, 2025",
      time: "7:00 PM",
      venue: "Shri Shanmukhananda Fine Arts Auditorium, Mumbai",
      ticketPrice: "₹999 onwards"
    },
    {
      image: "https://in.bmscdn.com/events/moviecard/ET00329412.jpg",
      title: "Kal Ki Chinta Nahi Karta",
      description: "Forget your problems and laugh out loud with the best comedians in the city",
      date: "April 23, 2025",
      time: "7:00 PM",
      venue: "The Fine Arts Society, Mumbai",
      ticketPrice: "₹799 onwards"
    },
    {
      image: "https://assets-in.bmscdn.com/nmcms/weblisting/et00145294-2025-4-16-t-6-58-1.jpg",
      title: "Jo Bolta Hai Wahi Hota Hai",
      description: "'Jo Bolta Hai Wahi Hota' is a stand-up comedy show done by Harsh Gujral.",
      date: "April 25, 2025",
      time: "7:30 PM",
      venue: "Sophia Auditorium, Mumbai",
      ticketPrice: "₹799 onwards"
    },
    {
      image: "https://in.bmscdn.com/events/moviecard/ET00440526.jpg",
      title: "Pranit More live",
      description: "For Hire Entertainment presents Pranit More live",
      date: "April 26, 2025",
      time: "7:00 PM",
      venue: "Courtyard, R City Mall",
      ticketPrice: "₹799 onwards"
    },
    {
      image: "https://in.bmscdn.com/events/moviecard/ET00433332.jpg",
      title: "Maheep Singh live",
      description: "At the Talkies Kala Chasma presents Maheep Singh live",
      date: "May 24, 2025",
      time: "7:00 PM",
      venue: "Bal Gandharva Rang Mandir, Bandra",
      ticketPrice: "₹699 onwards"
    },
    {
      image: "https://in.bmscdn.com/events/moviecard/ET00434989.jpg",
      title: "Papa Yaar ft Zakir Khan",
      description: "Papa Yaar is a comedy show performed by Indian comedian Zakir Khan",
      date: "April 24, 2025",
      time: "7:00 PM",
      venue: "St Andrew's Auditorium, Mumbai",
      ticketPrice: "₹1,499 onwards"
    }
  ]

  // Auto-scroll effect for the concert carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (concertCarouselRef.current) {
        const scrollAmount = concertCarouselRef.current.offsetWidth * 0.55
        concertCarouselRef.current.scrollLeft += scrollAmount
        
        // Reset scroll position if we've reached the end
        if (concertCarouselRef.current.scrollLeft > (concertCarouselRef.current.scrollWidth - concertCarouselRef.current.offsetWidth - 100)) {
          concertCarouselRef.current.scrollLeft = 0
        }
      }
    }, 4000)
    
    return () => clearInterval(interval)
  }, [concerts.length])

  // Auto-rotate concerts
  useEffect(() => {
    const interval = setInterval(() => {
          setActiveConcert(prev => (prev + 1) % concerts.length);
        }, 6000);
      
    return () => clearInterval(interval);
  }, [concerts.length]);

  useEffect(() => {
    // Update card positions when active concert changes
    document.querySelectorAll('.concert-card').forEach((card, index) => {
      let transform = '';
      let zIndex = 1;
      let opacity = 0.7;
      let filter = 'brightness(0.7)';
    
      if (index === activeConcert) {
        transform = 'translate(-50%, -50%) translateZ(0) rotate(0)';
        zIndex = 10;
        opacity = 1;
        filter = 'brightness(1)';
      } else if (index === activeConcert - 1 || (activeConcert === 0 && index === concerts.length - 1)) {
        transform = 'translate(-80%, -50%) translateZ(-100px) rotate(-5deg)';
        zIndex = 9;
        opacity = 0.85;
        filter = 'brightness(0.8)';
      } else if (index === activeConcert + 1 || (activeConcert === concerts.length - 1 && index === 0)) {
        transform = 'translate(-20%, -50%) translateZ(-100px) rotate(5deg)';
        zIndex = 8;
        opacity = 0.85;
        filter = 'brightness(0.8)';
      } else if (index === activeConcert - 2 || (activeConcert <= 1 && index === concerts.length - 2 + activeConcert)) {
        transform = 'translate(-110%, -50%) translateZ(-200px) rotate(-10deg)';
        zIndex = 7;
        opacity = 0.7;
        filter = 'brightness(0.6)';
      } else {
        transform = 'translate(100%, -50%) translateZ(-200px) rotate(10deg)';
        zIndex = 6;
        opacity = 0.7;
        filter = 'brightness(0.6)';
      }
      
      card.style.transform = transform;
      card.style.zIndex = zIndex;
      card.style.opacity = opacity;
      card.style.filter = filter;
    });
  }, [activeConcert, concerts.length]);

  return (
    <>
      <div className="app-container">
        <ShowlyTitle/>
      </div>
      <div className='browse-category'>
        <h1>
          <DecryptedText 
            text="Browse category" 
            animateOn="view"
            sequential={true}
            speed={80}
            maxIterations={20}
            className="decrypted"
            encryptedClassName="encrypted"
            parentClassName="decryption-animation"
          />
        </h1>
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-value">1,200+</span>
            <span className="stat-label">Events</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">6</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">24/7</span>
            <span className="stat-label">Support</span>
          </div>
        </div>
        <div className="gallery-wrapper" style={{ height: '480px', position: 'relative', maxWidth: '90%', margin: '0 auto' }}>
          <div className="category-badge badge-explore">Explore All Categories</div>
          <div className="category-badge badge-trending">Trending Events</div>
          <div className="icon-grid"></div>
          <CircularGallery 
            items={categoryItems}
            bend={3} 
            textColor="#ffffff" 
            borderRadius={0.05} 
            font="bold 26px DM Sans"
          />
          <div className="gallery-tooltip">Click on a card to explore</div>
        </div>
      </div>
      <div className='browse-category'>
        <h1>
        <DecryptedText 
            text="Recommendations" 
            animateOn="view"
            sequential={true}
            speed={80}
            maxIterations={20}
            className="decrypted"
            encryptedClassName="encrypted"
            parentClassName="decryption-animation"
          />
        </h1>
        
        <div className="event-category">
          <h2>Movies</h2>
          <div className="movie-grid">
            {movies.slice(0, 4).map((movie, index) => (
              <div className="movie-card" key={index}>
                <div className="movie-image">
                  <TiltedCard
                    imageSrc={movie.image}
                    altText={movie.title}
                    captionText={movie.title}
                    containerHeight="360px"
                    containerWidth="100%"
                    imageHeight="360px"
                    imageWidth="100%"
                    rotateAmplitude={12}
                    scaleOnHover={1.05}
                    showMobileWarning={false}
                    showTooltip={true}
                    displayOverlayContent={true}
                    overlayContent={
                      <div className="movie-overlay-content">
                        <h3>{movie.title}</h3>
                        <p>{movie.caption}</p>
                      </div>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/movies" className="view-all-button">View All Movies</Link>
          </div>
        </div>

        <div className="event-category">
          <h2>Music & Concerts</h2>
          <div className="music-showcase">
            {/* Left side decorative elements */}
            <div className="music-side-element left-element">
              <div className="vinyl-record"></div>
              <div className="music-note note-1">♪</div>
              <div className="music-note note-2">♫</div>
              <div className="equalizer-bars">
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
                <div className="equalizer-bar"></div>
              </div>
            </div>
            
            <div className="music-cards-wrapper">
              {concerts.map((concert, index) => (
                <div 
                  className={`concert-card ${index === activeConcert ? 'active' : ''} visible`} 
                  key={index} 
                  onClick={() => setActiveConcert(index)}
                >
                  <div className="concert-card-content">
                    <div className="concert-image">
                      <img src={concert.image} alt={concert.title} />
                      <div className="concert-rating">Coming Soon</div>
                      <Link 
                        to="/concert-booking" 
                        state={{ concert: concert }}
                        className="concert-book-button"
                      >
                        Book Now
                      </Link>
                    </div>
                    <div className="concert-details">
                      <div className="concert-title">{concert.title}</div>
                      <div className="concert-caption">{concert.caption}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right side decorative elements */}
            <div className="music-side-element right-element">
              <div className="spotlight"></div>
              <div className="music-note note-3">♩</div>
              <div className="music-note note-4">♬</div>
              <div className="stage-mic"></div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/concerts" className="view-all-button">View All Concerts</Link>
          </div>
        </div>

        <div className="event-category">
          <h2>Comedy</h2>
          <div className="comedy-showcase">
            {comedy.map((show, index) => (
              <Link to="/comedy" key={index} className="comedy-card-link">
                <div className="comedy-card">
                  <div className="comedy-image">
                    <img src={show.image} alt={show.title} />
                    <div className="comic-splash">{["POW!", "HAHA!", "LOL!", "BOOM!", "BANG!", "WOW!"][index % 6]}</div>
                    <div className="comedy-overlay">
                      <div className="comic-panel">
                        <div className="speech-bubble">
                          <h3>{show.title}</h3>
                          <p className="comedy-description">{show.description}</p>
                        </div>
                        <div className="comedy-info-rows">
                          <div className="comedy-info-row">
                            <span className="comedy-info-icon">📅</span>
                            <span>{show.date}</span>
                          </div>
                          <div className="comedy-info-row">
                            <span className="comedy-info-icon">⏰</span>
                            <span>{show.time}</span>
                          </div>
                          <div className="comedy-info-row">
                            <span className="comedy-info-icon">🏢</span>
                            <span>{show.venue}</span>
                          </div>
                          <div className="comedy-info-row">
                            <span className="comedy-info-icon">💰</span>
                            <span>{show.ticketPrice}</span>
                          </div>
                        </div>
                        <button className="comedy-book-btn">
                          <span className="btn-text">BOOK TICKETS</span>
                          <span className="btn-icon">🎭</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="comedy-badge">{show.date}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/comedy" className="view-all-button">View All Comedy</Link>
          </div>
        </div>
      </div>
    </>
  )
}

function App() {
  const location = useLocation();
  const bookingRoutes = ['/booking', '/concert-booking', '/comedy-booking'];
  const showNavbar = !bookingRoutes.some(route => location.pathname.includes(route));
  const [navbarCollapsed, setNavbarCollapsed] = useState(false);
  const prevLocation = useRef(location.pathname);
  
  // Detect scroll position to collapse navbar
  useEffect(() => {
    if (!showNavbar) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 150) {
        setNavbarCollapsed(true);
      } else {
        setNavbarCollapsed(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showNavbar]);
  
  const toggleNavbar = () => {
    setNavbarCollapsed(!navbarCollapsed);
  };
  
  return (
    <>
      {/* Loading screens */}
      {/* {loading && <LoadingScreen finishLoading={() => setLoading(false)} />} */}
      {/* {pageLoading && <LoadingScreen finishLoading={() => setPageLoading(false)} />} */}
      
      {/* Stars background */}
      <div className="stars-container">
        {/* Regular stars */}
        {Array.from({ length: 40 }).map((_, index) => (
          <div key={`star-${index}`} className="star"></div>
        ))}
        
        {/* Bright stars with glow */}
        <div className="bright-star"></div>
        <div className="bright-star"></div>
        <div className="bright-star"></div>
        <div className="bright-star"></div>
      </div>
      
      {showNavbar && (
      <div className={`navbar-container ${location.pathname === '/' ? 'home-navbar' : ''} ${navbarCollapsed ? 'navbar-collapsed' : ''}`} onClick={navbarCollapsed ? toggleNavbar : undefined}>
        <nav className={`navbar ${location.pathname === '/' ? 'home-navbar-inner' : ''}`}>
          <div className="navbar-logo">
            <img src={favicon} alt="Showly Logo" className="navbar-favicon" />
          </div>
          <ul className="navbar-links">
            <li><Link to="/" className={`navbar-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link></li>
            <li><Link to="/movies" className={`navbar-link ${location.pathname === '/movies' ? 'active' : ''}`}>Movies</Link></li>
            <li><Link to="/concerts" className={`navbar-link ${location.pathname === '/concerts' ? 'active' : ''}`}>Concerts</Link></li>
            <li><Link to="/comedy" className={`navbar-link ${location.pathname.includes('/comedy') ? 'active' : ''}`}>Comedy</Link></li>
            <li><Link to="/about" className={`navbar-link ${location.pathname === '/about' ? 'active' : ''}`}>About</Link></li>
          </ul>
          <div className="navbar-actions">
            <Link to="/contact" className="contact-button">Contact Us</Link>
          </div>
          <div className="navbar-collapse-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </nav>
      </div>
      )}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/concerts" element={<Concerts />} />
        <Route path="/comedy" element={<Comedy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/concert-booking" element={<ConcertBookingPage />} />
        <Route path="/comedy-booking" element={<ComedyBookingPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </>
  )
}

export default App
