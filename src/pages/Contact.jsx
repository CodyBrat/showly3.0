import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Contact.css';

function Contact() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send the form data to a server here
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setFormSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <div className="contact-container">
          <h1 className="contact-title">Contact Us</h1>
          <p className="contact-subtitle">We'd love to hear from you! Reach out to our team for any questions, feedback, or support.</p>
          
          {/* Decorative particles */}
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>

      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              
              <div className="contact-method">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h4>Call Us</h4>
                  <p>Customer Support: +91 9800516903</p>
                  <p>Business Inquiries: +91 9800516903</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h4>Email Us</h4>
                  <p><a href="mailto:priyabrata.singh@adypu.edu.in">priyabrata.singh@adypu.edu.in</a></p>
                  <p><a href="mailto:priyabrata.singh@adypu.edu.in">priyabrata.singh@adypu.edu.in</a></p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">⏰</div>
                <div className="contact-details">
                  <h4>Working Hours</h4>
                  <p>Monday-Friday: 9:00 AM - 6:00 PM EST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
              
              <div className="contact-method">
                <div className="contact-icon">🌐</div>
                <div className="contact-details">
                  <h4>Follow Us</h4>
                  <div className="contact-social">
                    <a href="#" className="social-icon">f</a>
                    <a href="#" className="social-icon">t</a>
                    <a href="#" className="social-icon">in</a>
                    <a href="#" className="social-icon">ig</a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="contact-form">
              <h3>Send Us a Message</h3>
              {formSubmitted ? (
                <div className="form-success">
                  <h4 style={{ color: '#e6a919', marginBottom: '15px' }}>Thank you for your message!</h4>
                  <p style={{ marginBottom: '20px' }}>We've received your inquiry and will get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      className="form-control" 
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      className="form-control" 
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <input 
                      type="text" 
                      id="subject" 
                      name="subject" 
                      className="form-control" 
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      className="form-control" 
                      placeholder="Tell us how we can help you"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" className="submit-button">Send Message</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section">
        <div className="contact-container">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">How do I book tickets through Showly?</h3>
              <p className="faq-answer">Booking tickets is easy! Simply browse our categories, select the event you're interested in, choose your preferred date and seats, and follow the checkout process. You'll receive your e-tickets via email.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">What payment methods do you accept?</h3>
              <p className="faq-answer">We accept all major credit/debit cards, PayPal, and mobile payment options like Apple Pay and Google Pay for a seamless checkout experience.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">Can I cancel or change my booking?</h3>
              <p className="faq-answer">Yes, most bookings can be changed or canceled up to 48 hours before the event. Please check the specific event's cancellation policy for details, as some special events may have different terms.</p>
            </div>
            
            <div className="faq-item">
              <h3 className="faq-question">How do I contact customer support?</h3>
              <p className="faq-answer">You can reach our customer support team via phone at +1 (800) 123-4567, email at support@showly.com, or by filling out the contact form on this page. We're here to help!</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* 
      <section className="office-locations">
        <div className="contact-container">
          <h2>Our Offices</h2>
          <div className="offices-grid">
            <div className="office-card">
              <img src="https://images.unsplash.com/photo-1502104034360-73176bb1e92e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="New York Office" className="office-image" />
              <div className="office-details">
                <h3 className="office-city">New York</h3>
                <p className="office-address">123 Broadway Avenue, Suite 500, New York, NY 10001, USA</p>
                <div className="office-phone">
                  <i>📞</i> +1 (212) 555-6789
                </div>
                <div className="office-email">
                  <i>✉️</i> newyork@showly.com
                </div>
              </div>
            </div>
            
            <div className="office-card">
              <img src="https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="London Office" className="office-image" />
              <div className="office-details">
                <h3 className="office-city">London</h3>
                <p className="office-address">45 Oxford Street, 3rd Floor, London, W1D 2DW, United Kingdom</p>
                <div className="office-phone">
                  <i>📞</i> +44 20 7123 4567
                </div>
                <div className="office-email">
                  <i>✉️</i> london@showly.com
                </div>
              </div>
            </div>
            
            <div className="office-card">
              <img src="https://images.unsplash.com/photo-1536599018102-9f803c140fc1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mumbai Office" className="office-image" />
              <div className="office-details">
                <h3 className="office-city">Mumbai</h3>
                <p className="office-address">Orchid Towers, 7th Floor, Bandra Kurla Complex, Mumbai 400051, India</p>
                <div className="office-phone">
                  <i>📞</i> +91 22 4567 8900
                </div>
                <div className="office-email">
                  <i>✉️</i> mumbai@showly.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      */}
    </div>
  );
}

export default Contact; 