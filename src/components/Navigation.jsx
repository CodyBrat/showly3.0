import React from 'react'
import '../styles/Navigation.css'

const Navigation = () => {
  return (
    <div className="navigation">
      <div className="nav-left">
        <a href="#">HOMEPAGE</a>
        <a href="#">ABOUT US</a>
        <a href="#">SERVICES</a>
        <a href="#">CASE</a>
        <a href="#">STUDIES</a>
        <a href="#">CONTACT</a>
      </div>
      <div className="tagline">
        DIGITAL DRIVING FORCE<br />
        FOR YOUR BUSINESS
      </div>
      <div className="nav-right">
        <a href="#">ENGLISH</a>
        <a href="#">UKRAINIAN</a>
        <a href="#">GERMAN</a>
      </div>
    </div>
  )
}

export default Navigation 