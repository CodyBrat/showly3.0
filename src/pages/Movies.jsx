import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TiltedCard from '../components/TiltedCard';
import DecryptedText from '../components/DecryptedText';
import '../styles/Movies.css';

export default function Movies() {
  const navigate = useNavigate();

  // All movies in a single array
  const allMovies = [
    // Action movies
    {
      image: "https://m.media-amazon.com/images/M/MV5BZWU4NDY0ODktOGI3OC00NWE1LWIwYmQtNmJiZWU3NmZlMDhkXkEyXkFqcGc@._V1_.jpg",
      bannerImage: "https://i0.wp.com/teaser-trailer.com/wp-content/uploads/2025/02/Until-Dawn.jpg?ssl=1",
      title: "Until Dawn",
      caption: "25th April 2025",
      genre: "Action, Thriller"
    },
    {
      image: "https://m.media-amazon.com/images/M/MV5BYjhkZjM3ZWYtMjUxMS00YzhlLTkxZWYtMzhkMzFhOTQ1NjRkXkEyXkFqcGc@._V1_.jpg",
      bannerImage: "https://i.ytimg.com/vi/DFUiEIUVMhU/maxresdefault.jpg",
      title: "Amateur",
      caption: "In Cinemas • 11th April 2025",
      genre: "Action, Drama"
    },
    {
      image: "https://m.media-amazon.com/images/M/MV5BNjIwZWY4ZDEtMmIxZS00NDA4LTg4ZGMtMzUwZTYyNzgxMzk5XkEyXkFqcGc@._V1_.jpg",
      bannerImage: "https://static-3.bitchute.com/live/cover_images/j6OsrydHxyia/aehpjtTAmc9j_640x360.jpg",
      title: "Sinner",
      caption: "In Cinemas • 18th April 2025",
      genre: "Action, Crime"
    },
    {
      image: "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Kesari_Chapter_2.jpg/250px-Kesari_Chapter_2.jpg",
      bannerImage: "https://assets-in.bmscdn.com/discovery-catalog/events/et00439158-tynvgbjqby-landscape.jpg",
      title: "Kesari Chapter 2",
      caption: "In Cinemas • 18th April 2025",
      genre: "Action, Historical"
    },
    {
      image: "https://cdn.marvel.com/content/1x/thunderboltsposter.jpeg",
      bannerImage: "https://m.media-amazon.com/images/M/MV5BZDcxYTUzYzItZWZmMi00MTEyLTg0YjEtMGI1ZWY4OTQ2NmRkXkEyXkFqcGc@._V1_QL75_UY281_CR28,0,500,281_.jpg",
      title: "Thunderbolts",
      caption: "Release Date • 1st May 2025",
      genre: "Action, Sci-Fi, Superhero, Adventure"
    },
    {
      image: "https://m.media-amazon.com/images/M/MV5BNDRjY2E0ZmEtN2QwNi00NTEwLWI3MWItODNkMGYwYWFjNGE0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
      bannerImage: "https://assetscdn1.paytm.com/images/cinema/Captain-America--3ce23240-d976-11ef-8e08-83a3f4555821.jpeg",
      title: "Captain America: Brave New World",
      caption: "In Cinemas • 14th Feb 2025",
      genre: "Action, Sci-Fi, Superhero, Adventure"
    },
    // Adventure movies
    {
      image: "https://image.tmdb.org/t/p/original/iPPTGh2OXuIv6d7cwuoPkw8govp.jpg",
      bannerImage: "https://www.minecraft.net/content/dam/minecraftnet/franchise/photography/things/AMM%20Hero%20Visual%20Bee%20-%201170x500.jpg.jpg",
      title: "Minecraft: The Movie",
      caption: "In Cinemas • 4th April 2025",
      genre: "Adventure, Fantasy"
    },
    {
      image: "https://s3.amazonaws.com/nightjarprod/content/uploads/sites/130/2025/02/03190714/rzfqeLdHIysJGrspMICyedpqDqt-scaled.jpg",
      bannerImage: "https://assets-in.bmscdn.com/discovery-catalog/events/et00418746-rgmwhtbrqr-landscape.jpg",
      title: "Paddington in Peru",
      caption: "In Cinemas • 18th April 2025",
      genre: "Adventure, Comedy"
    },
    {
      image: "https://stat5.bollywoodhungama.in/wp-content/uploads/2023/10/Chhaava.jpg",
      bannerImage: "https://img.nowrunning.com/content/movie/2024/chaav-28722/bg4-chhaava.jpg",
      title: "Chhaava",
      caption: "In Cinemas • 14th April 2025",
      genre: "Adventure, Historical"
    },
    {
      image: "https://m.media-amazon.com/images/M/MV5BZGQwYmEzMzktYzBmMy00NmVmLTkyYTUtOTYyZjliZDNhZGVkXkEyXkFqcGc@._V1_.jpg",
      bannerImage: "https://bleedingcool.com/wp-content/uploads/2025/01/mickey_oneseven_ver2_xxlg-1-2000x1125.jpg",
      title: "Mickey 17",
      caption: "In Cinemas • 7th March 2025",
      genre: "Adventure, Comedy"
    },
    {
      image: "https://i.redd.it/h9pk49rpxexc1.jpeg",
      bannerImage: "https://static.digit.in/Mufasa-OTT-Release.png",
      title: "Mufasa: The Lion King",
      caption: "Release Date • 20th Dec 2024",
      genre: "Adventure, Drama, Family"
    },
    // Drama movies
    {
      image: "https://dx35vtwkllhj9.cloudfront.net/the-chosen-inc/the-chosen-last-supper/images/gallery/image1.jpg",
      bannerImage: "https://images.christianpost.com/full/142915/the-chosen-last-supper.jpg?w=1920",
      title: "The Chosen: Last Supper",
      caption: "In Cinemas • 17th April 2025",
      genre: "Drama, Historical"
    },
    {
      image: "https://m.media-amazon.com/images/M/MV5BM2QwNGJkMDQtZWRlYy00OGE2LWJiYzktYWY1OGU2YjYwZTVmXkEyXkFqcGc@._V1_.jpg",
      bannerImage: "https://www.augustreview.com/wp-content/uploads/2022/10/The-Piano-Lesson-Denzel-Wasington.jpg",
      title: "The Piano Lesson",
      caption: "Coming Soon • May 2025",
      genre: "Drama"
    },
    {
      image: "https://m.media-amazon.com/images/M/MV5BNTk5MTkzNjU1OV5BMl5BanBnXkFtZTgwNzk5Mzk3MzE@._V1_.jpg",
      bannerImage: "https://amc-theatres-res.cloudinary.com/image/upload/f_auto,fl_lossy,h_465,q_auto,w_1920/v1579117927/amc-cdn/production/2/movies/4800/4770/Hero_1920x1080.jpg",
      title: "A Beautiful Mind",
      caption: "Remastered • June 2025",
      genre: "Drama, Biography"
    },
    {
      image: "https://in.bmscdn.com/events/moviecard/ET00334632.jpg",
      bannerImage: "https://filmfare.wwmindia.com/content/2022/nov/malkaantheteacher11669788708.jpg",
      title: "The Teacher",
      caption: "In Cinemas • 5th May 2025",
      genre: "Drama, Thriller"
    },
    // Sci-Fi movies
    {
      image: "https://www.hollywoodreporter.com/wp-content/uploads/2016/06/independence_day_resurgence_10.jpg",
      bannerImage: "https://c4.wallpaperflare.com/wallpaper/306/64/1022/extinction-independence-day-resurgence-movies-wallpaper-preview.jpg",
      title: "Extinction Event",
      caption: "Coming Soon • July 2025",
      genre: "Sci-Fi, Action"
    },
    {
      image: "https://i0.wp.com/www.murphysmultiverse.com/wp-content/uploads/2022/12/mafvx5.jpg",
      bannerImage: "https://assets-prd.ignimgs.com/2021/05/10/the-colony-poster-1620658422354.jpg",
      title: "The Colony",
      caption: "In Cinemas • 28th April 2025",
      genre: "Sci-Fi, Thriller"
    },
    {
      image: "https://assets-prd.ignimgs.com/2022/10/07/screenshot-1665160759108-1665160873121.png",
      bannerImage: "https://www.chicagomag.com/wp-content/archive/Arts-Culture/C-Notes/February-2013/From-the-Vault-Quantum-Leap/quantum-leap-banner.jpg",
      title: "Quantum Breach",
      caption: "Coming Soon • May 2025",
      genre: "Sci-Fi, Mystery"
    },
    {
      image: "https://i0.wp.com/bloody-disgusting.com/wp-content/uploads/2017/10/alien-covenant-1.jpg",
      bannerImage: "https://cdn.mos.cms.futurecdn.net/xZbgGhM2beWbpDUaZZQDsi.jpg",
      title: "Deep Space",
      caption: "Coming Soon • August 2025",
      genre: "Sci-Fi, Horror"
    }
  ];

  // Dynamically categorize movies based on their genre
  const categorizeMoviesByGenre = () => {
    const actionMovies = allMovies.filter(movie => 
      movie.genre.includes('Action'));
    
    const adventureMovies = allMovies.filter(movie => 
      movie.genre.includes('Adventure'));
    
    const dramaMovies = allMovies.filter(movie => 
      movie.genre.includes('Drama'));
    
    const scifiMovies = allMovies.filter(movie => 
      movie.genre.includes('Sci-Fi'));
    
    return {
      actionMovies,
      adventureMovies,
      dramaMovies,
      scifiMovies
    };
  };

  const { actionMovies, adventureMovies, dramaMovies, scifiMovies } = categorizeMoviesByGenre();

  // All movies combined for hero banner rotation
  const featuredMovies = allMovies.map(movie => ({
    ...movie,
    match: "96% Match",
    description: movie.caption.includes("In Cinemas") 
      ? `${movie.caption} • ${movie.genre}` 
      : `${movie.caption} • ${movie.genre}`
  }));

  const [selectedGenre, setSelectedGenre] = useState('all');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isHeroTransitioning, setIsHeroTransitioning] = useState(false);

  const sliderRefs = {
    action: useRef(null),
    adventure: useRef(null),
    drama: useRef(null),
    scifi: useRef(null)
  };

  // Get current hero movie with safeguards
  const currentHeroMovie = featuredMovies[currentHeroIndex] || featuredMovies[0];

  // Hero banner rotation effect - with safeguards
  useEffect(() => {
    // Ensure there are featured movies
    if (featuredMovies.length === 0) return;

    const interval = setInterval(() => {
      // Start transition
      setIsHeroTransitioning(true);
      
      // Wait for fade out to complete before changing content
      setTimeout(() => {
        // Change the index
        setCurrentHeroIndex((prevIndex) => {
          // Ensure we don't exceed array bounds
          const nextIndex = (prevIndex + 1) % featuredMovies.length;
          return nextIndex;
        });
        
        // Allow time for DOM to update before showing new content
        setTimeout(() => {
          setIsHeroTransitioning(false);
        }, 100);
      }, 800); // Match this with the CSS transition time
    }, 8000); // Increase display time for each movie
    
    return () => clearInterval(interval);
  }, [featuredMovies.length, currentHeroIndex]);

  // Function to scroll sliders
  const scrollSlider = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Function to handle booking navigation
  const handleBookNow = (movie) => {
    navigate('/booking', { state: { movie } });
  };

  // Generic render function for movie sliders
  const renderMovieSlider = (movies, sliderRef, category) => {
    return (
      <div className="movie-slider-container">
        <div className="movie-slider-controls">
          <button 
            className="slider-control left" 
            onClick={() => scrollSlider(sliderRef, 'left')}
            aria-label="Scroll left"
          >
            ‹
          </button>
          <div className="movie-slider" ref={sliderRef}>
            {movies.map((movie, index) => (
              <div className="movie-slider-card" key={index}>
                <TiltedCard
                  imageSrc={movie.image}
                  altText={movie.title}
                  captionText={movie.title}
                  containerHeight="360px"
                  containerWidth="250px"
                  imageHeight="360px"
                  imageWidth="100%"
                  rotateAmplitude={15}
                  scaleOnHover={1.08}
                  showMobileWarning={false}
                  showTooltip={false}
                  displayOverlayContent={true}
                  overlayContent={
                    <div className="movie-overlay-content">
                      <div className="book-now-btn" onClick={() => handleBookNow(movie)}>Book Now</div>
                      <div className="movie-details">
                        <h3>{movie.title}</h3>
                        <p className="movie-genre">{movie.genre}</p>
                        <p className="movie-caption">{movie.caption}</p>
                      </div>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
          <button 
            className="slider-control right" 
            onClick={() => scrollSlider(sliderRef, 'right')}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="movies-page">
      {/* Dynamic Hero Banner */}
      <div className={`movies-hero-banner ${isHeroTransitioning ? 'transitioning' : ''}`}>
        <div className="hero-content">
          <div className="hero-text">
            <div className="movie-badges">
              <span className="movie-match">{currentHeroMovie.match}</span>
              <span className="movie-year">{currentHeroMovie.caption}</span>
            </div>
            <h1>{currentHeroMovie.title}</h1>
            <p className="movie-description">{currentHeroMovie.description}</p>
            <div className="hero-genre">{currentHeroMovie.genre}</div>
            <div className="hero-actions">
              <button 
                className="hero-button book-now"
                onClick={() => handleBookNow(currentHeroMovie)}
              >
                <span className="icon">🎬</span> Book Now
              </button>
              <button className="hero-button add-wishlist">
                <span className="icon">+</span> My List
              </button>
            </div>
          </div>
        </div>
        <div className="hero-gradient-overlay"></div>
        <div className="hero-image">
          <img src={currentHeroMovie.bannerImage || currentHeroMovie.image} alt={currentHeroMovie.title} />
        </div>
      </div>

      <div className="genre-filter">
        <button 
          className={selectedGenre === 'all' ? 'active' : ''} 
          onClick={() => setSelectedGenre('all')}
        >
          All Movies
        </button>
        <button 
          className={selectedGenre === 'action' ? 'active' : ''} 
          onClick={() => setSelectedGenre('action')}
        >
          Action
        </button>
        <button 
          className={selectedGenre === 'adventure' ? 'active' : ''} 
          onClick={() => setSelectedGenre('adventure')}
        >
          Adventure
        </button>
        <button 
          className={selectedGenre === 'drama' ? 'active' : ''} 
          onClick={() => setSelectedGenre('drama')}
        >
          Drama
        </button>
        <button 
          className={selectedGenre === 'scifi' ? 'active' : ''} 
          onClick={() => setSelectedGenre('scifi')}
        >
          Sci-Fi
        </button>
      </div>

      {/* Movie Categories with Horizontal Sliders */}
      {(selectedGenre === 'all' || selectedGenre === 'action') && actionMovies.length > 0 && (
        <div className="movie-category">
          <h2>Action Movies</h2>
          <div className="movie-category-description">
            <p>High-octane thrills and adrenaline-pumping adventures await</p>
          </div>
          {renderMovieSlider(actionMovies, sliderRefs.action, 'action')}
        </div>
      )}

      {(selectedGenre === 'all' || selectedGenre === 'adventure') && adventureMovies.length > 0 && (
        <div className="movie-category">
          <h2>Adventure Movies</h2>
          <div className="movie-category-description">
            <p>Epic journeys and captivating explorations of new worlds</p>
          </div>
          {renderMovieSlider(adventureMovies, sliderRefs.adventure, 'adventure')}
        </div>
      )}

      {(selectedGenre === 'all' || selectedGenre === 'drama') && dramaMovies.length > 0 && (
        <div className="movie-category">
          <h2>Drama Movies</h2>
          <div className="movie-category-description">
            <p>Emotional narratives that explore the depths of human experience</p>
          </div>
          {renderMovieSlider(dramaMovies, sliderRefs.drama, 'drama')}
        </div>
      )}

      {(selectedGenre === 'all' || selectedGenre === 'scifi') && scifiMovies.length > 0 && (
        <div className="movie-category">
          <h2>Sci-Fi Movies</h2>
          <div className="movie-category-description">
            <p>Futuristic visions and mind-bending concepts that challenge reality</p>
          </div>
          {renderMovieSlider(scifiMovies, sliderRefs.scifi, 'scifi')}
        </div>
      )}
    </div>
  );
} 