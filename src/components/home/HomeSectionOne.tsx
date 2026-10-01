import React from 'react';
import ButtonContent from "../buttons/Buttons";
import HighlightedText from "../global/TitleColor";
import type { RootObject, SectionsHomeAbout } from '../../interfaces/dbData';

interface Props {
  data: RootObject;
  homeSection: SectionsHomeAbout[]
}

const HomeSection: React.FC<Props> = ({ data, homeSection }) => {
  return (
    <section className="flex items-center font-poppins flex-col relative overflow-hidden">
      <div className='w-full h-32 bg-gradient-to-t from-white to-primary rounded-tr-3xl'></div>
      <div className='w-full h-auto bg-white py-16 flex flex-col md:flex-row items-center justify-center md:justify-between relative'>
        <div className='w-full md:w-1/2 relative mb-10 md:mb-0'>
          <img src={homeSection[0].additionalImages[0]} alt="img-home1" className='w-11/12 h-[640px] object-cover rounded-r-xl' />
          <div className='w-9 h-4/5 bg-primary absolute bottom-0 right-5'></div>
          {/* <img src="assets/img/18-YEARS.png"alt="img-home2" className='w-[240px] h-[240px] object-contain absolute right-0 md:-right-20 -bottom-10 md:top-12 ' /> */}
        </div>
        <div className='w-full md:w-2/5 px-5 flex flex-col justify-center items-center md:items-start text-center md:text-start'>
          <h2 className="mt-2 text-3xl font-black md:text-5xl text-secondary pb-5 md:pb-3">
            <HighlightedText text={homeSection[0].title} defaultColor="black" />
          </h2>
          <p className="mb-4 text-base leading-6 text-gray-600">
            {homeSection[0].text}
          </p>
          <div className='w-full flex flex-col md:flex-row justify-center md:justify-start items-center gap-4'>
            <div className='md:w-auto'>
              <a href={`tel:${data.dataGeneral.phones[0].number}`} className='flex items-center space-x-2'>
                <i className="fa-solid fa-phone text-primary text-2xl border-2 border-primary rounded-full py-2 px-3"></i>
                <p className='text-black font-bold text-xl'>{data.dataGeneral.phones[0].number}<br /><span className='text-gray-800 text-lg'>Call Us Now!!</span></p>
              </a>
            </div>
            <ButtonContent linkBtn={`tel:+1${data.dataGeneral.phones[0].number}`} />
          </div>
        </div>
      </div>
      <div className='w-[360px] h-[350px] border-[28px] border-primary absolute bottom-1/2 translate-y-1/2 -right-44 rounded-[35%] rotate-45 opacity-15'></div>

    </section>
  );
};

export default HomeSection;
