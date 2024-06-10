import React from 'react'
import Logo from '../img/code.svg'

const Footer = () => {
  return (
    <footer>
      <div className="logo">
        <img src={Logo} alt="logo" />
        <p>JuanCDEV</p>
      </div>
      <span>Hecho en <b>React</b> ⚛️ <b>SQL</b> 💾 & <b>Express</b> 💻</span>
    </footer>
  )
}

export default Footer