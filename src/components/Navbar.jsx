import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../pages/Footer/Footer'

const Navbar = () => {
  return (
    <div className='nav d-flex mx-auto mb-2 text-align '>

            <Link to='/'><p>Home</p></Link> 
            <Link to='/user'><p>Users</p></Link> 
            <Link to='/about'><p>About Us</p></Link>
        
            <Footer/>
    </div>
  )
}

export default Navbar