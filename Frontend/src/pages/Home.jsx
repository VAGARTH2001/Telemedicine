import React from "react";
import bg from "../Components/Assest/homebg.jpg";
import card1 from "../Components/Assest/card1.png"
import card2 from "../Components/Assest/card2.png"
import card3 from "../Components/Assest/card3.png"
import card4 from "../Components/Assest/card4.png"
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate()

  const onclick1 = ()=>{
    navigate('/FindDoctor')
  }

  const onclick2 = ()=>{
    navigate('/AIDoctor')
  }

  
  return (
    <>
      <div className="home">
        <div className="bg md:flex">
          <div className="left w-full md:w-1/2">
            <div className="md:block flex">
              <p className="md:text-6xl font-bold text-3xl font-serif   text-blue-500  md:ml-52 md:mt-28 mt-10 tracking-wide  ">
                Enabling hybrid care at Scale
              </p>
              
            </div>

            <p className="mt-3 md:ml-52 text-2xl font-semibold font-serif text-blue-950">
              One Platform . One Partner.
            </p>

            <div className="flex">
            <div onClick={onclick1} className="find text-blue-500  md:ml-52 w-[170px] h-[50px] border mt-3 rounded-md md:mt-5 ml-1 flex justify-center items-center text-2xl bg-white  font-semibold cursor-pointer font-serif hover:bg-blue-500 hover:text-white">
              Find Doctor
            </div>
            <div onClick={onclick2} className="find md:ml-2 w-[150px] h-[50px] border mt-3 rounded-md md:mt-5 ml-1 flex justify-center items-center text-2xl bg-white text-blue-500  font-semibold cursor-pointer font-serif  hover:bg-blue-500 hover:text-white">
              AI Doctor
            </div>


            </div>

            
          </div>
          <div className="right w-full hidden md:block md:w-1/2">
            <img src={bg} alt="" />
          </div>
        </div>


        <div className="cards md:mt-0 mt-10   ">

          <h1 className="text-blue-900 md:text-4xl text-2xl font-serif font-extrabold flex justify-center mt-5 ">How can We Help You Today</h1>

          <div className="cards flex flex-wrap ">
            <div className="card ml-1 mt-5 bg-gray-100 rounded-lg w-screen h-[330px] md:w-[400px] md:h-[300px] md:ml-20  flex flex-col">
             <img className="w-[100px] ml-5 mt-5" src={card1} alt="" />
             <h1 className="text-2xl text-blue-950 font-medium ml-5 mt-3 font-serif">Video Consultation</h1>
             <p className="ml-5 mt-2 font-serif font-extralight "> Connect with a registered health practitioner via phone or video consultation within a hour .  Our aim is to provide consultation with doctor at your finger tip </p>

             <div className="box cursor-pointer text-white flex font-serif justify-center items-center text-lg  mt-5 ml-8 w-[85vw] h-[40px] rounded-lg bg-blue-900 font-semibold md:w-[350px] md:ml-7 md:mt-5 ">Video Consultancy</div>


            </div>

            <div className="card ml-1 mt-5 bg-gray-100 rounded-lg w-screen h-[330px] md:w-[400px] md:h-[300px] md:ml-20 flex flex-col">
             <img className="w-[67px] ml-5 mt-5" src={card2} alt="" />
             <h1 className="text-2xl text-blue-950 font-medium ml-5 mt-3 font-serif">Video Consultation</h1>
             <p className="ml-5 mt-2 font-serif font-extralight "> Connect with a registered health practitioner via phone or video consultation within a hour .  Our aim is to provide consultation with doctor at your finger tip </p>

             <div className="box cursor-pointer text-white flex font-serif justify-center items-center text-lg  mt-5 ml-8 w-[85vw] h-[40px] rounded-lg bg-blue-900 font-semibold md:w-[350px] md:ml-7 md:mt-5 ">Video Consultancy</div>


            </div>

            <div className="card ml-1 mt-5 bg-gray-100 rounded-lg w-screen h-[330px] md:w-[400px] md:h-[300px] md:ml-20  flex flex-col">
             <img className="w-[67px] ml-5 mt-5" src={card3} alt="" />
             <h1 className="text-2xl text-blue-950 font-medium ml-5 mt-3 font-serif">Video Consultation</h1>
             <p className="ml-5 mt-2 font-serif font-extralight "> Connect with a registered health practitioner via phone or video consultation within a hour .  Our aim is to provide consultation with doctor at your finger tip </p>

             <div className="box cursor-pointer text-white flex font-serif justify-center items-center text-lg  mt-5 ml-8 w-[85vw] h-[40px] rounded-lg bg-blue-900 font-semibold md:w-[350px] md:ml-7 md:mt-5  ">Video Consultancy</div>


            </div>


            

            

          </div>

         
          
          
        </div>


      </div>
    </>
  );
};

export default Home;
