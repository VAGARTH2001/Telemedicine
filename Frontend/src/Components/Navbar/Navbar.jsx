import React from "react";
import { useState } from "react";
import hamburger from '../Assest/hamburger.png'
import close from '../Assest/close.png'
import { Link , useNavigate } from "react-router-dom";
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleHamburger = () => {
    setIsMenuOpen(!isMenuOpen);
   
  }
  const handleclick = () =>{
    navigate('/');
  }

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  return (
    <>
      <div className="navbar max-w-screen-2xl h-16 bg-white z-50 border sticky top-0  shadow-md">
        <div className="content md:flex md:justify-between   ">


          <div className="hamburger md:hidden ml-2 mt-3 cursor-pointer">
            <img onClick={handleHamburger} className="w-[30px] h-[30px] " src={ isMenuOpen ? close : hamburger} alt="" />
          </div>
          
      
          <div onClick={handleclick} className="logo md:flex flex justify-center items-center md:mt-1 -mt-9 cursor-pointer       ">
          <img  className="w-[200px] md:ml-2 "   src="https://medmate.com.au/wp-content/uploads/2021/02/medmate-blue-logo.png" alt="medmate-blue-logo"/>
            
          </div>

          <div className={`options ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <ul className={`child md:gap-7 md:flex md:text-black text-white  md:mt-3 font-semibold text-xl md:mr-20 md:static absolute md:bg-white bg-blue-950 w-[260px]  md:h-auto md:rounded-none rounded-md h-[580px] left-0  pb-2 md:w-auto md:opacity-100  transition-all ease-in duration-500 ${isMenuOpen ? 'opacity-100 top-16' : 'opacity-0 top-[-400px]'} `}>
            <li className=" md:hidden md:hover:text-blue-800 font-serif hover:text-black md:pt-0 pt-7  md:my-0 mt-3 md:mx-0 mx-7 "><Link to='/' onClick={closeMenu}>Home</Link></li>
                <li className="md:hover:text-blue-800 font-serif hover:text-black md:pt-0 pt-7  md:my-0 mt-3 md:mx-0 mx-7 "><Link to='/FindDoctor' onClick={closeMenu}>Find Doctors</Link></li>
                <li className="md:hover:text-blue-800 hover:text-black md:pt-0 pt-7   md:my-0  mx-7 md:mx-0 my-4 font-serif" ><Link to='/AIDoctor' onClick={closeMenu}>AI Doctors</Link></li>
                <li className="md:hover:text-blue-800 hover:text-black md:pt-0 pt-7  md:my-0 mx-7 md:mx-0 my-4 font-serif"><Link to='/VideoConsultant ' onClick={closeMenu}>Video Consultant</Link></li>
                <li className="md:hover:text-blue-800 hover:text-black  md:pt-0 pt-7   md:my-0 mx-7 md:mx-0 my-4 font-serif"><Link to='/MedicalConsultant' onClick={closeMenu}>Medical Insights</Link></li>
                <li><button onClick={closeMenu} className=" md:border font-serif md:w-[80px] w-[120px] h-10 rounded-md  tracking-wide  md:hover:text-white   hover:text-black   md:-mt-2 mt-3 md:mx-0 mx-7 md:hover:bg-blue-800 md:border-black   ">Sign In</button></li>
               
            </ul>
          </div>

           

        </div>
      </div>
    </>
  );
};

export default Navbar;
