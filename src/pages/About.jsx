import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-container">
          <h1 className="about-title">About <span className="highlight">Showly</span></h1>
          <p className="about-subtitle">The Ultimate Entertainment Booking Platform</p>
        </div>
      </div>

      <section className="about-section">
        <div className="about-container">
          <div className="about-grid">
            <div className="about-content">
              <h2>Our Story</h2>
              <p>Founded in 2024, Showly was created with a simple mission: to revolutionize how people discover and book entertainment experiences. We believe that everyone deserves access to exceptional entertainment, from blockbuster movies to electrifying concerts and hilarious comedy shows.</p>
              <p>What started as a small team of entertainment enthusiasts has grown into a platform that connects millions of people with their perfect entertainment experience.</p>
            </div>
            <div className="about-image">
              <div className="image-container">
                <img src="./src/assets/images/image.png" alt="Team working together" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section values-section">
        <div className="about-container">
          <h2 className="centered-heading">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">✨</div>
              <h3>Excellence</h3>
              <p>We strive for excellence in every aspect of our service, from the user experience to customer support.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🔒</div>
              <h3>Trust</h3>
              <p>We build trust through transparent pricing, secure transactions, and reliable service.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Diversity</h3>
              <p>We celebrate diversity in entertainment, offering a wide range of experiences for all tastes.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation</h3>
              <p>We constantly innovate to improve how people discover and experience entertainment.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section features-section">
        <div className="about-container">
          <div className="about-grid reverse">
            <div className="about-image">
              <div className="image-container">
                <img src="https://i.pinimg.com/originals/87/53/fc/8753fc1860b7b9804f6c0f7477241148.gif" alt="Mobile app screens" />
              </div>
            </div>
            <div className="about-content">
              <h2>What We Offer</h2>
              <ul className="feature-list">
                <li>Easy booking for movies, concerts, comedy shows, and more</li>
                <li>Secure payment processing and digital tickets</li>
                <li>Personalized recommendations based on your preferences</li>
                <li>Exclusive offers and early access to premium events</li>
                <li>Virtual tours of venues to help you choose the perfect seat</li>
                <li>24/7 customer support for a seamless booking experience</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="about-section team-section">
        <div className="about-container">
          <h2 className="centered-heading">Meet Our Leadership</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="CEO portrait" />
              </div>
              <h3>Alex Morgan</h3>
              <p className="member-role">Chief Executive Officer</p>
              <p className="member-desc">With over 15 years in the entertainment industry, Alex brings vision and leadership to Showly.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="CTO portrait" />
              </div>
              <h3>Maya Chen</h3>
              <p className="member-role">Chief Technology Officer</p>
              <p className="member-desc">Maya leads our engineering team, ensuring Showly stays at the cutting edge of technology.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="CMO portrait" />
              </div>
              <h3>James Wilson</h3>
              <p className="member-role">Chief Marketing Officer</p>
              <p className="member-desc">James crafts our brand story and ensures we connect with entertainment lovers everywhere.</p>
            </div>
          </div>
        </div>
      </section> */}

      <section className="about-cta">
        <div className="about-container">
          <h2>Ready to discover your next entertainment experience?</h2>
          <p>Join millions of users who have found their perfect event with Showly.</p>
          <div className="cta-buttons">
            <Link to="/" className="cta-button primary">Explore Events</Link>
            <Link to="/contact" className="cta-button secondary">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About; 