import React from 'react';

import ButtonContent from "../buttons/Buttons";
import HighlightedText from "../global/TitleColor";
import type { RootObject, SectionsHomeAbout } from '../../interfaces/dbData';

interface Props {
  data: RootObject;
  homeSection: SectionsHomeAbout[]
}

const HomeSectionTwo: React.FC<Props> = ({ homeSection }) => {
  return (
    <div className="flex flex-wrap justify-center items-center pb-[100px] relative">
      <div className='w-full h-32 bg-gradient-to-t from-white to-primary rounded-tl-3xl'></div>
      <div className="w-4/5 mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-2/5 h-[500px] relative">

          <div className='w-4/5 h-[260px] md:h-[330px] border-white border-8 mr-auto relative rounded-lg mt-4'>
            <img src={homeSection[0].additionalImages[0]} alt="img" className='w-full h-full object-cover rounded-lg' />

          </div>
          <div className='w-4/5 h-[260px] md:h-[330px] border-white border-8 ml-auto relative rounded-lg -mt-20 md:-mt-40'>
            <img src={homeSection[0].additionalImages[1]} alt="img" className='w-full h-full object-cover rounded-lg' />

          </div>
        </div>

        <div className="w-full md:w-3/5 h-auto flex flex-col justify-center items-center text-center md:text-start md:items-start px-5 md:px-10 relative">
          <p className="text-xl font-bold relative z-10">
            <i className="fa-regular fa-shield-exclamation mr-2"></i>About Us!
          </p>
          <h2 className="mt-2 text-3xl font-semibold md:text-5xl text-primary pb-5 md:pb-5 relative z-10">
            <HighlightedText text={homeSection[0].title} defaultColor="black" />
          </h2>
          <p className="px-0 md:px-4 relative z-10 pb-5">{homeSection[0].text}</p>
          <ButtonContent />

        </div>
      </div>
    </div>
  );
};

export default HomeSectionTwo;
