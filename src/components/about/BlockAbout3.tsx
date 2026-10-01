import React from 'react';
import { type RootObject, type SectionsHomeAbout } from "../../interfaces/dbData";

interface Props {
  data: RootObject;
  aboutSection: SectionsHomeAbout[];
}

const BlockAbout3: React.FC<Props> = ({ data, aboutSection }) => {
  return (
    <section className="flex flex-col items-center justify-center lg:h-auto pt-20 ">
      <div className="w-11/12 mx-auto flex flex-col md:flex-row justify-center items-center">
        <div className="w-full md:w-1/4 relative">
            <div className="w-[260px] h-[260px] absolute inset-0 m-auto rounded-full border-8 border-primary border-dotted animate-spin-smooth"></div>
          <img src={data.logos.secondary} alt="logo" className="w-full h-auto object-contain relative mx-auto" />
        </div>
      </div>
      <div className="px-4 mx-auto max-w-full pt-10">
        <div className="flex flex-wrap">
          <div className="flex-1 pl-0 lg:pl-4">
            <div className="mb-12">
              <div className="relative text-center">
                <h2 className="text-5xl font-bold">{aboutSection[1].title}</h2>
                <div className="flex w-24 mt-3 mb-10 overflow-hidden rounded mx-auto">
                  <div className="flex-1 h-2 bg-blue-200"></div>
                  <div
                    className="flex-1 h-2"
                    style={{ backgroundColor: data.colors.secondaryColor }}
                  ></div>
                  <div
                    className="flex-1 h-2"
                    style={{ backgroundColor: data.colors.primaryColor }}
                  ></div>
                </div>
              </div>
              <p className="mb-16 text-base text-gray-500 text-center">
                {aboutSection[1].text}
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BlockAbout3;
