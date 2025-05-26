import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import DecryptedText from '../components/DecryptedText';
import '../styles/Concerts.css';
import '../styles/ConcertsGoldenTheme.css';
import paradiseCityMP3 from '../assets/songs/Guns N\' Roses - Paradise City (Official Music Video).mp3';
import highwayToHellMP3 from '../assets/songs/ACDC - Highway to Hell (Official Video).mp3';
import elevenkMP3 from '../assets/songs/11K - Seedhe Maut.mp3';

export default function Concerts() {
  const [activeConcert, setActiveConcert] = useState(0);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [activeCategory, setActiveCategory] = useState('all');
  const waveformRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showSpotifyPlayer, setShowSpotifyPlayer] = useState(false);
  const [currentTrack, setCurrentTrack] = useState({
    name: "11K",
    artist: "Seedhe Maut",
    cover: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00437060-mdlmgewvgb-portrait.jpg"
  });
  
  // Additional player states
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef(null);
  const animationRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(60);
  const [trackIndex, setTrackIndex] = useState(2);
  
  // Sample tracks for player
  const tracks = [
    {
      title: "Paradise City",
      artist: "Guns N' Roses",
      src: paradiseCityMP3,
      cover: "https://in.bmscdn.com/events/moviecard/ET00437139.jpg"
    },
    {
      title: "Highway to Hell",
      artist: "AC/DC",
      src: highwayToHellMP3,
      cover: "https://www.impericon.com/cdn/shop/articles/20241209_g_r_2.jpg?v=1742482171"
    },
    {
      title: "11K",
      artist: "Seedhe Maut",
      src: elevenkMP3,
      cover: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00437060-mdlmgewvgb-portrait.jpg"
    }
  ];

  // Data for concert categories
  const featuredConcerts = [
    {
      id: 1,
      title: "Guns N' Roses:India Tour",
      artist: "Guns N' Roses",
      date: "August 15-17, 2025",
      location: "Cosmic Arena",
      image: "https://in.bmscdn.com/events/moviecard/ET00437139.jpg",
      description: "Experience three days of nonstop music with over 30 artists across 4 stages.",
      price: "₹4299",
      category: "festival",
      tags: ["rock", "indie", "electronic"],
      lineup: ["The Rolling Stones", "Coldplay", "Imagine Dragons", "Twenty One Pilots"],
      spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DZ06evO1Ziym4?si=004c7f231ef646a8"
    },
    {
      id: 2,
      title: "Vilen India Tour",
      artist: "Vilen",
      date: "July 28, 2025",
      location: "Stadium Arena",
      image: "https://in.bmscdn.com/events/moviecard/ET00441603.jpg",
      description: "The ultimate rock experience with legendary bands performing their greatest hits.",
      price: "₹4299",
      category: "tour",
      tags: ["rock", "classic rock"],
      lineup: ["Aerosmith", "Guns N' Roses", "Def Leppard"],
      spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DZ06evO36eSzw?si=ee42a77c9c5e4618"
    },
    {
      id: 3,
      title: "Shreya Ghoshal Live",
      artist: "Shreya Ghoshal",
      date: "September 8-9, 2025",
      location: "Riverside Festival Grounds",
      image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00438542-fvkbeggjke-portrait.jpg",
      description: "Dance the night away with world-class DJs and spectacular light shows.",
      price: "₹4299",
      category: "festival",
      tags: ["electronic", "edm", "dance"],
      lineup: ["Martin Garrix", "David Guetta", "Tiesto", "Alesso"],
      spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DWWbe6KinsK2k?si=859412a5524849cf"
    },
    {
      id: 4,
      title: "Dil-luminati Tour",
      artist: "Diljit Dosanjh",
      date: "October 15, 2025",
      location: "Blue Note Theater",
      image: "https://images.news18.com/webstories/uploads/2024/09/Screenshot-2024-09-28-at-12.48.03-PM-2024-09-5a66cbfd9ce9343301181344c6a18690.png",
      description: "An intimate evening of smooth jazz from world-renowned musicians.",
      price: "₹4299",
      category: "jazz",
      tags: ["jazz", "smooth jazz", "instrumental"],
      lineup: ["Wynton Marsalis", "Chick Corea Trio", "Diana Krall"],
      spotifyPlaylist: "https://open.spotify.com/playlist/37i9dQZF1DX0GO2iStOATx?si=07e999c32dfc46f4"
    },
    {
      id: 5,
      title: "Seedhe Maut",
      artist: "Seedhe Maut",
      date: "October 15, 2025",
      location: "Blue Note Theater",
      image: "https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC/et00437060-mdlmgewvgb-portrait.jpg",
      description: "An intimate evening of smooth jazz from world-renowned musicians.",
      price: "₹4299",
      category: "jazz",
      tags: ["jazz", "smooth jazz", "instrumental"],
      lineup: ["Wynton Marsalis", "Chick Corea Trio", "Diana Krall"],
      spotifyPlaylist: "37i9dQZF1DXbITWG1ZJKYt"
    }
  ];

  const upcomingConcerts = [
    {
      id: 5,
      title: "Alan Walker India Tour",
      artist: "Alan Walker",
      date: "August 30, 2025",
      location: "Lakeside Amphitheater",
      image: "https://i.ytimg.com/vi/OW1fOVSveXE/maxresdefault.jpg",
      description: "A magical evening of classical music performed under the open night sky.",
      price: "₹4299",
      category: "classical",
      tags: ["symphony", "classical", "orchestra"],
      lineup: ["Conductor: James Roberts", "Featuring soloists from the Metropolitan Opera"],
      spotifyPlaylist: "37i9dQZF1DWWEJlAGA9gs0"
    },
    {
      id: 6,
      title: "Travis Scott India Tour",
      artist: "Travis Scott",
      date: "September 21-22, 2025",
      location: "Cultural Center Plaza",
      image: "https://creativemindsent.com/wp-content/uploads/2025/01/ts1-1024x683.jpg",
      description: "Celebrating music from around the world with performances from 6 continents.",
      price: "₹4299",
      category: "world",
      tags: ["world music", "cultural", "international"],
      lineup: ["Youssou N'Dour", "Gipsy Kings", "Angélique Kidjo", "Ravi Shankar Ensemble"],
      spotifyPlaylist: "37i9dQZF1DWYlCz3xRKQbk"
    },
    {
      id: 7,
      title: "Karan Aujla India Tour",
      artist: "Karan Aujla",
      date: "October 5, 2025",
      location: "The Vault Music Hall",
      image: "https://cdn-az.allevents.in/events8/banners/3d2578d0-b292-11ef-9d06-bf7eeee1ea7e-rimg-w1200-h600-dc040404-gmir.jpg?v=1733352668",
      description: "Discover the next big thing with emerging indie artists in an intimate venue.",
      price: "₹4299",
      category: "indie",
      tags: ["indie", "alternative", "underground"],
      lineup: ["The Neighborhood Watch", "Glass Echo", "Midnight Reverie", "Lunar Phase"],
      spotifyPlaylist: "37i9dQZF1DX2Nc3B70tvx0"
    },
    {
      id: 8,
      title: "Country Roads India Tour",
      artist: "",
      date: "August 25, 2025",
      location: "Hillside Ranch",
      image: "https://static.wixstatic.com/media/3a848c_cd0857c8a9f2401c9df6fd3e70ea59ff~mv2.jpg/v1/fill/w_980,h_551,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/3a848c_cd0857c8a9f2401c9df6fd3e70ea59ff~mv2.jpg",
      description: "A day of country music, food, and fun under the open sky.",
      price: "₹4299",
      category: "country",
      tags: ["country", "folk", "americana"],
      // lineup: ["Luke Combs", "Miranda Lambert", "Zac Brown Band", "Chris Stapleton"],
      spotifyPlaylist: "37i9dQZF1DWZBCPUIUs2iR"
    }
  ];

  const popularVenues = [
    {
      name: "COSMIC ARENA",
      location: "New York, NY",
      capacity: "20,000",
      image: "https://msg.com/wp-content/uploads/2019/01/2016_05_18_View-of-Stage-from-Upper-1024x768.jpg",
      upcoming: 15
    },
    {
      name: "RED ROCKS",
      location: "Morrison, CO",
      capacity: "9,525",
      image: "https://www.uncovercolorado.com/wp-content/uploads/2020/04/red-rocks-amphitheatre-morrison-co-1600x800-1.jpg",
      upcoming: 23
    },
    {
      name: "ROYAL HALL",
      location: "London, UK",
      capacity: "5,272",
      image: "https://cdn.londonandpartners.com/-/media/images/london/visit/whats-on/special-events/bbc-proms/royal-albert-hall-auditorium-640x360.jpg",
      upcoming: 18
    },
    {
      name: "OPERA HOUSE",
      location: "Sydney, Australia",
      capacity: "5,738",
      image: "https://cdn.britannica.com/96/115096-050-5AFDAF5D/Pritzker-Architecture-Prize-Interior-Sydney-Opera-House.jpg",
      upcoming: 12
    }
  ];

  // Animation for vinyl record
  useEffect(() => {
    // Setup auto-rotation of concerts
    const interval = setInterval(() => {
      setActiveConcert(prev => (prev + 1) % featuredConcerts.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [featuredConcerts.length]);

  // Initialize audio player when component mounts
  useEffect(() => {
    if (audioRef.current) {
      // Set initial volume
      audioRef.current.volume = volume / 100;
      
      // Load the initial track
      loadTrack(trackIndex);
      
      // Add event listener for audio errors
      const handleError = (e) => {
        console.error("Audio error:", e);
        // Try loading a different track if there's an error
        if (trackIndex < tracks.length - 1) {
          skipTrack('forward');
        } else {
          skipTrack('back');
        }
      };
      
      audioRef.current.addEventListener('error', handleError);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('error', handleError);
          audioRef.current.pause();
        }
        cancelAnimationFrame(animationRef.current);
      };
    }
  }, []);

  // Audio player functions
  const togglePlay = () => {
    if (audioRef.current) {
      try {
      if (isPlaying) {
        audioRef.current.pause();
        cancelAnimationFrame(animationRef.current);
      } else {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
        animationRef.current = requestAnimationFrame(updateProgress);
              })
              .catch(error => {
                console.error("Error playing audio:", error);
              });
          }
      }
      setIsPlaying(!isPlaying);
      } catch (error) {
        console.error("Error toggling play state:", error);
      }
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      setCurrentTime(currentTime);
      animationRef.current = requestAnimationFrame(updateProgress);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (!isMuted) {
        setPrevVolume(volume);
        setVolume(0);
        audioRef.current.volume = 0;
      } else {
        setVolume(prevVolume);
        audioRef.current.volume = prevVolume / 100;
      }
      setIsMuted(!isMuted);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const skipTrack = (direction) => {
    let newIndex;
    if (direction === 'forward') {
      newIndex = (trackIndex + 1) % tracks.length;
    } else {
      newIndex = trackIndex - 1 < 0 ? tracks.length - 1 : trackIndex - 1;
    }
    setTrackIndex(newIndex);
    loadTrack(newIndex);
  };

  const loadTrack = (index) => {
    const track = tracks[index];
    setCurrentTrack({
      name: track.title,
      artist: track.artist,
      cover: track.cover
    });

    if (audioRef.current) {
      audioRef.current.src = track.src;
      audioRef.current.load();
      
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error loading track:", error);
            setIsPlaying(false);
          });
        }
      }
    }
  };

  // Handle audio metadata loading
  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, []);

  // Format time as mm:ss
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle track ending
  useEffect(() => {
    const handleTrackEnd = () => {
      skipTrack('forward');
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleTrackEnd);
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleTrackEnd);
        }
      };
    }
  }, [trackIndex]);

  const changeConcert = (index) => {
    if (index !== activeConcert) {
      setActiveConcert(index);
      setShowSpotifyPlayer(false);
    }
  };

  // Toggle Spotify player
  const toggleSpotifyPlayer = () => {
    setShowSpotifyPlayer(!showSpotifyPlayer);
  };

  // Audio waveform animation
  useEffect(() => {
    if (waveformRef.current) {
      const bars = waveformRef.current.querySelectorAll('.waveform-bar-cosmic');
      
      const animateBars = () => {
        bars.forEach(bar => {
          const height = Math.floor(Math.random() * 60) + 20;
          bar.style.height = `${height}px`;
        });
      };
      
      const waveformInterval = setInterval(animateBars, 100);
      return () => clearInterval(waveformInterval);
    }
  }, [isPlaying]);

  return (
    <div className="cosmic-concerts-page">
      {/* Decorative elements */}
      <div className="cosmic-background">
        <div className="cosmic-orb"></div>
        <div className="cosmic-stars">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="star" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 7}s`
            }}></div>
          ))}
        </div>
        <div className="floating-cassette cassette-1">
          <div className="cassette-inner">
            <div className="cassette-wheels">
              <div className="wheel"></div>
              <div className="wheel"></div>
            </div>
          </div>
        </div>
        <div className="floating-cassette cassette-2">
          <div className="cassette-inner">
            <div className="cassette-wheels">
              <div className="wheel"></div>
              <div className="wheel"></div>
            </div>
          </div>
        </div>
        <div className="laser-beam beam-1"></div>
        <div className="laser-beam beam-2"></div>
      </div>

      {/* Enhanced music player */}
      <div className="music-player">
        <div className="player-content">
          <div className="player-controls">
            <div className="track-info">
              <div className="track-name">{currentTrack.name}</div>
              <div className="track-artist">{currentTrack.artist}</div>
            </div>
            
            <div className="playback-controls">
              <div className="control-buttons">
                <button className="control-btn" onClick={() => skipTrack('back')} aria-label="Previous track">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                <button className="control-btn play-btn" onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                  {isPlaying ? 
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg> : 
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
                  }
                </button>
                <button className="control-btn" onClick={() => skipTrack('forward')} aria-label="Next track">
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
              </div>
              
              <div className="progress-container">
                <span className="time-display">{formatTime(currentTime)}</span>
                <div className="progress-bar-container">
                  <input 
                    type="range" 
                    min="0" 
                    max={duration || 100}
                    value={currentTime} 
                    onChange={handleProgressChange}
                    ref={progressBarRef}
                    className="progress-bar"
                    aria-label="Playback progress"
                  />
                  <div 
                    className="progress-filled" 
                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                  ></div>
                </div>
                <span className="time-display">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
          
          <audio ref={audioRef} preload="metadata" />
        </div>
      </div>

      {/* Spotify player overlay */}
      {showSpotifyPlayer && (
        <div className="spotify-player-overlay">
          <div className="spotify-player">
            <div className="spotify-player-header">
              <h3>Listen to {featuredConcerts[activeConcert].title}</h3>
              <button className="close-button" onClick={toggleSpotifyPlayer}>×</button>
            </div>
            <div className="spotify-player-content">
              <iframe 
                src={`https://open.spotify.com/embed/playlist/${featuredConcerts[activeConcert].spotifyPlaylist}?utm_source=generator&theme=0`} 
                width="100%" 
                height="380" 
                frameBorder="0" 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Hero section */}
      <div className="cosmic-hero">
        <div className="cosmic-container">
          <div className="cosmic-title-container">
            <h1 className="cosmic-title">MUSyC</h1>
            <p className="cosmic-subtitle">CONCERT EXPERIENCE • 2025</p>
          </div>
          
          <div className="audio-waveform-cosmic" ref={waveformRef}>
            {Array(40).fill().map((_, i) => (
              <div 
                key={i} 
                className="waveform-bar-cosmic" 
                style={{ 
                  height: `${Math.floor(Math.random() * 60) + 20}px`,
                  animationDelay: `${i * 0.02}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured concerts */}
      <section className="cosmic-featured-section">
        <div className="cosmic-container">
          <h2 className="cosmic-section-title">
            <span className="glow-text">FEATURED</span> 
            EVENTS
            <div className="equalizer-animation">
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
            </div>
          </h2>
        </div>
        
        <div className="cosmic-featured-showcase">
          <div className="cosmic-featured-grid">
            {featuredConcerts.map((concert, index) => (
              <div 
                className={`cosmic-concert-card ${index === activeConcert ? 'active' : ''}`} 
                key={concert.id}
                onClick={() => changeConcert(index)}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="cosmic-concert-image">
                  <img src={concert.image} alt={concert.title} />
                  <div className="cosmic-concert-overlay"></div>
                </div>
                <div className="cosmic-glowing-border"></div>
                <div className="cosmic-concert-content">
                  <div className="cosmic-date-badge">{concert.date}</div>
                  <h3 className="cosmic-concert-title">{concert.title}</h3>
                  <p className="cosmic-concert-artist">{concert.artist}</p>
                  
                  <div className={`cosmic-concert-details ${index === hoveredCard || index === activeConcert ? 'visible' : ''}`}>
                    <div className="cosmic-detail-row">
                      <span className="cosmic-detail-icon">⦿</span>
                      <span>{concert.location}</span>
                    </div>
                    <div className="cosmic-detail-row">
                      <span className="cosmic-detail-icon">⦿</span>
                      <span>{concert.price}</span>
                    </div>
                    <div className="cosmic-tags">
                      {concert.tags.map((tag, i) => (
                        <span key={i} className="cosmic-tag">{tag}</span>
                      ))}
                    </div>
                    <div className="cosmic-buttons-row">
                      <Link 
                        to="/concert-booking" 
                        state={{ concert: concert }}
                        className="cosmic-button reserve-btn"
                      >
                        BOOK NOW
                      </Link>
                      <button 
                        className="cosmic-button spotify-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveConcert(index);
                          setShowSpotifyPlayer(true);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Category filter */}
      <div className="cosmic-container">
        <div className="cosmic-category-filter">
          <button 
            className={activeCategory === 'all' ? 'active' : ''} 
            onClick={() => setActiveCategory('all')}
          >
            ALL
          </button>
          <button 
            className={activeCategory === 'festival' ? 'active' : ''} 
            onClick={() => setActiveCategory('festival')}
          >
            FESTIVALS
          </button>
          <button 
            className={activeCategory === 'rock' ? 'active' : ''} 
            onClick={() => setActiveCategory('rock')}
          >
            ROCK
          </button>
          <button 
            className={activeCategory === 'jazz' ? 'active' : ''} 
            onClick={() => setActiveCategory('jazz')}
          >
            JAZZ
          </button>
          <button 
            className={activeCategory === 'electronic' ? 'active' : ''} 
            onClick={() => setActiveCategory('electronic')}
          >
            ELECTRONIC
          </button>
          <button 
            className={activeCategory === 'classical' ? 'active' : ''} 
            onClick={() => setActiveCategory('classical')}
          >
            CLASSICAL
          </button>
        </div>
      </div>
      
      {/* Upcoming concerts */}
      <section className="cosmic-upcoming-section">
        <div className="cosmic-container">
          <h2 className="cosmic-section-title">
            <span className="glow-text">UPCOMING</span> 
            EVENTS
            <div className="equalizer-animation">
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
            </div>
          </h2>
        </div>
        
        <div className="cosmic-container">
          <div className="cosmic-grid">
            {upcomingConcerts
              .filter(concert => activeCategory === 'all' || 
                    concert.category === activeCategory || 
                    concert.tags.includes(activeCategory))
              .map(concert => (
                <div className="cosmic-upcoming-card" key={concert.id}>
                  <div className="cosmic-upcoming-image">
                    <img src={concert.image} alt={concert.title} />
                    <div className="cosmic-event-date">
                      <span>{concert.date.split(' ')[0]}</span>
                      <span className="event-year">{concert.date.split(' ')[2]}</span>
                    </div>
                    <div className="cosmic-upcoming-overlay">
                      <div className="concert-card-content">
                        <h3 className="cosmic-upcoming-title">{concert.title}</h3>
                        <p className="cosmic-upcoming-artist">{concert.artist}</p>
                        <div className="cosmic-upcoming-info">
                          <div className="info-item">
                            <span className="info-icon">📅</span>
                            <span className="cosmic-upcoming-date">{concert.date}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-icon">📍</span>
                            <span className="cosmic-upcoming-location">{concert.location}</span>
                          </div>
                          <div className="info-item">
                            <span className="info-icon">💰</span>
                            <span className="cosmic-upcoming-price">{concert.price}</span>
                          </div>
                        </div>
                        <div className="cosmic-upcoming-description">
                          {concert.description}
                        </div>
                        <div className="cosmic-buttons-row">
                          <Link 
                            to="/concert-booking" 
                            state={{ concert: concert }}
                            className="cosmic-button reserve-btn glow-effect"
                          >
                            BOOK NOW
                          </Link>
                          <button 
                            className="cosmic-button spotify-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentTrack({
                                name: concert.title,
                                artist: concert.artist,
                                cover: concert.image
                              });
                              setActiveConcert(featuredConcerts.findIndex(fc => fc.category === concert.category) || 0);
                              setShowSpotifyPlayer(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="cosmic-upcoming-tags">
                    {concert.tags.map((tag, index) => (
                      <span key={index} className="cosmic-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
      
      {/* Venues section - commented out as requested */}
      {/*
      <section className="cosmic-venues-section">
        <div className="cosmic-container">
          <h2 className="cosmic-section-title">
            <span className="glow-text">PREMIER</span> 
            VENUES
            <div className="equalizer-animation">
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
              <div className="equalizer-bar"></div>
            </div>
          </h2>
        </div>
        
        <div className="cosmic-container">
          <div className="cosmic-venues-grid">
            {popularVenues.map((venue, index) => (
              <div className="cosmic-venue-card" key={index}>
                <div className="cosmic-venue-image">
                  <img src={venue.image} alt={venue.name} />
                  <div className="cosmic-venue-overlay"></div>
                </div>
                <div className="cosmic-venue-content">
                  <h3 className="cosmic-venue-name">{venue.name}</h3>
                  <p className="cosmic-venue-location">{venue.location}</p>
                  <div className="cosmic-venue-stats">
                    <div className="cosmic-venue-stat">
                      <span className="cosmic-stat-value">{venue.capacity}</span>
                      <span className="cosmic-stat-label">CAPACITY</span>
                    </div>
                    <div className="cosmic-venue-stat">
                      <span className="cosmic-stat-value">{venue.upcoming}</span>
                      <span className="cosmic-stat-label">UPCOMING</span>
                    </div>
                  </div>
                  <button className="cosmic-button">VIEW EVENTS</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* Footer credit */}
      <div className="cosmic-footer">
        <div className="cosmic-container">
          <p>© 2024 СЛЕЗЫ EVENTS • ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </div>
  );
} 