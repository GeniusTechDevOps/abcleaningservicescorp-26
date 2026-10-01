import React from 'react';

import HighlightedText from "../global/TitleColor";
import type { RootObject, SectionsHomeAbout } from '../../interfaces/dbData';

interface Props {
  data: RootObject;
  homeSection: SectionsHomeAbout[]
}

const HomeSectionTwo: React.FC<Props> = ({ data, homeSection }) => {
  return (
    <div className="flex flex-wrap justify-center items-center py-[100px] relative">
      <div className="w-4/5 mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-2/5 h-[500px] relative">
          <div className='w-full h-[160px] absolute top-0 right-44 bg-gradient-to-r from-primary'></div>
          <div className='w-4/5 h-[260px] md:h-[330px] border-white border-8 mr-auto relative rounded-lg mt-4'>
            <img src={homeSection[0].additionalImages[0]} alt="img" className='w-full h-full object-cover rounded-lg' />

          </div>
          <div className='w-4/5 h-[260px] md:h-[330px] border-white border-8 ml-auto relative rounded-lg -mt-20 md:-mt-40'>
            <img src={homeSection[0].additionalImages[1]} alt="img" className='w-full h-full object-cover rounded-lg' />

          </div>
        </div>

        <div className="w-full md:w-3/5 h-auto flex flex-col justify-center items-center text-center md:text-start md:items-start px-5 md:px-10 relative">
          <p className="text-xl font-bold relative z-10">
            <i className="fa-regular fa-handshake mr-2"></i>Contact With Us!
          </p>
          <h2 className="mt-2 text-3xl font-semibold md:text-5xl text-primary pb-5 md:pb-5 relative z-10">
            <HighlightedText text={homeSection[0].title} defaultColor="black" />
          </h2>
          <p className="px-0 md:px-4 relative z-10">{homeSection[0].text}</p>
          <div className="w-full flex flex-col md:flex-row mt-10 relative z-10">
            <a href={`tel+1:${data.dataGeneral.phones[0].number}`} className="w-full md:w-1/2 border-t-2 border-r-0 md:border-r-2 py-5 flex flex-row items-center relative space-x-2 md:space-x-4 hover:scale-105 transition-all duration-300 ease-in-out pl-3 md:pl-0">
              <div className="absolute w-12 h-12 rounded-full bg-secondary opacity-40 bottom-1/2 transform translate-y-1/2 left-0 md:-left-2"></div>
              <p className="text-4xl font-semibold relative"><i className="fa-solid fa-phone-volume"></i></p>
              <p className="text-2xl font-semibold leading-4 text-primary">{data.dataGeneral.phones[0].number}</p>
            </a>
            <a href={`mailto:${data.dataGeneral.emails[0].email}`} className="w-full md:w-1/2 border-b-0 md:border-b-2 flex flex-row items-center relative space-x-1 md:space-x-4 hover:scale-105 transition-all duration-300 ease-in-out pl-5">
              <div className="absolute w-12 h-12 rounded-full bg-secondary opacity-40 bottom-1/2 transform translate-y-1/2 left-0 md:left-3"></div>
              <p className="text-4xl font-semibold relative"><i className="fa-solid fa-envelope-open-text"></i></p>
              <p className="text-2xl font-semibold leading-4 text-primary">{data.dataGeneral.emails[0].email}</p>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HomeSectionTwo;
