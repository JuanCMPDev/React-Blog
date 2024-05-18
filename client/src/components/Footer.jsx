import React from 'react'
import Logo from '../img/logo.svg'

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="logo" />
      <span>Made in <b>React</b> ⚛️ <b>SQL</b> 💾 and <b>Express</b> 💻</span>
    </footer>
  )
}

export default Footer