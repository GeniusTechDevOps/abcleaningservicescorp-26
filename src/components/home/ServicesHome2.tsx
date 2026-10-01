import { useEffect, useState } from "react";
import type { DataGeneral, RootObject, SectionsHomeAbout, Service } from "../../interfaces/dbData";
import { motion } from "framer-motion";
import FormatText from "../../hooks/FormatText";

interface SliderServicesProps {
  dbServices: Service[];
  landingServices: boolean;
  slidesPerView?: number;
  onePage?: boolean;
  dataGeneral?: DataGeneral;
  dataglobal: RootObject;
  homeSection: SectionsHomeAbout[];
}

const ServicesHome2: React.FC<SliderServicesProps> = ({
  dbServices,
  dataglobal,
  homeSection,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Cambiar cada 5 segundos (ajusta según lo necesario)

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === dbServices.length - 1 ? 0 : prev + 1));
  };


  return (
    <section className="w-full py-14 relative overflow-hidden">
      <div className="w-3/5 absolute right-0 top-0 h-[80px] bg-gradient-to-l from-primary to-transparent"></div>
      <div className="w-11/12 mx-auto flex flex-col md:flex-row justify-start items-center">
        <div className="w-full md:w-1/4 relative">
          <div className="w-[300px] h-[300px] absolute left-5 -top-5 rounded-full border-8 border-primary border-dotted animate-spin-smooth"></div>
          <img src={dataglobal.logos.secondary} alt="logo" className="w-full h-auto object-contain relative mx-auto" />
        </div>
        <div className="w-full md:w-3/4 relative pl-0 md:pl-10 text-center md:text-left mt-10 md:mt-0">
          <h1 className="text-4xl md:text-5xl text-secondary font-black capitalize">
            {homeSection[1].title}
          </h1>
        </div>
      </div>

      <div className="w-11/12 mx-auto flex flex-col md:flex-row justify-start items-center relative">
        <div className="w-full md:w-1/2 h-[420px] rounded-xl">
          {dbServices.map((services, index) => (
            <motion.div
              key={index}
              className={`w-full h-full relative overflow-hidden ${index === currentSlide ? 'block' : 'hidden'}`}
              
            >
              {/* Imagen: Deslizar desde la derecha */}
              <motion.img
                src={services.description[0].image}
                className={`w-full h-full object-cover absolute rounded-2xl`}
                alt={`Services ${services.title}`}
                initial={{ opacity: 0, x: '100%' }}
                animate={{
                  opacity: index === currentSlide ? 1 : 0,
                  x: index === currentSlide ? 0 : '100%',
                }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                }}
              />
              {/* <div className="w-full h-full mx-auto flex flex-col justify-end items-end relative z-10">
                
                <motion.a
                  className="w-[60%] h-auto p-8 bg-white relative z-10 -mt-5 rounded-tl-xl"
                  href={`${onePage
                    ? `tel:${dataGeneral?.phones[0].number}`
                    : landingServices
                      ? `/services/${FormatText(services.title)}`
                      : "/services"
                  }`}
                  initial={{ y: '100%' }}
                  animate={{
                    opacity: index === currentSlide ? 1 : 0,
                    y: index === currentSlide ? 0 : '100%',
                  }}
                  exit={{ y: '100%' }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <motion.p className="text-black text-2xl font-semibold">
                      {services.title}
                    </motion.p>
                    <i className="fa-regular fa-arrow-right text-black text-xl"></i>
                  </div>
                </motion.a>
              </div> */}
            </motion.div>
          ))}
        </div>
        <div className="w-full md:w-1/2 px-10 pt-10 md:pt-0">
        <p className="text-balance text-slate-800">{homeSection[1].text}</p>
        </div>
      </div>
    </section>
  );
};

export default ServicesHome2;
