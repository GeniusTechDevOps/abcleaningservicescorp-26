import { useState } from "react";
import type { RootObject } from "../../interfaces/dbData";
import { motion } from "framer-motion";


interface ValuesProps {
  data: RootObject;
}



const Values: React.FC<ValuesProps> = ({ data }) => {
  const Values = [
    {
      title: "Mission",
      description: `${data.valuesContent.mission}`,
      icon: "fa-solid fa-bullseye",
    },
    {
      title: "Vision",
      description: `${data.valuesContent.vision}`,
      icon: "fa-solid fa-eye",
    },
    {
      title: "Why Choose Us",
      description: `${data.valuesContent.whychooseUs}`,
      icon: "fa-solid fa-heart",
    },
  ]

  const [activeTab, setActiveTab] = useState(0);
  return (
    <section className="md:py-24 py-16 w-full">
      <div className="w-10/12 mx-auto flex flex-col md:flex-row justify-center items-center text-center md:text-left">
        <div className="w-full md:w-1/2 p-4">
          <p className="text-base font-semibold text-primary">Our Values</p>
          <h2 className="text-5xl font-bold capitalize">{data.slogan[3]}</h2>
          <div className="flex my-6">
            {Values.map((value, index) => (
              <button
                key={index}
                className={`px-6 py-2 font-semibold ${activeTab === index ? "text-primary border-b-4 border-primary" : "text-gray-500"}`}
                onClick={() => setActiveTab(index)}
              >
                {value.title}{value.icon && <i className={`ml-2 ${value.icon}`}></i>}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }} // Aparece desde abajo
            animate={{ opacity: 1, y: 0 }} // Movimiento a su posición original
            exit={{ opacity: 0, y: 20 }} // Desaparece hacia abajo
            transition={{ duration: 0.5 }} // Duración de la animación
            className="p-4"
          >
            <div className="flex items-center">

              <p className="text-lg">{Values[activeTab].description}</p>
            </div>
          </motion.div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <div className="w-full h-auto md:h-[180px] flex flex-col md:flex-row gap-2 mb-2">
            <div className="w-full md:w-1/3 h-full border-2 border-primary flex flex-col justify-center items-center gap-5 rounded-lg bg-tertiary">
              <p className="text-6xl font-bold text-white">{data.yearsExperience}+</p>
              <p className="text-lg font-semibold text-white">Years of Experience</p>
            </div>
            <div className="w-full md:w-1/3 h-full hidden md:flex flex-col justify-center items-center p-3 relative">
              <img
                src={data.valuesContent.additionalImages[1]}
                alt="mission image"
                loading="eager"
                width="150"
                height="150"
                className="w-[150px] h-[150px] object-cover" />
            </div>
            <div className="w-full md:w-1/3 h-full border-2 border-primary hidden md:flex flex-col justify-center items-center gap-5 rounded-lg bg-tertiary">
              <p className="text-6xl font-bold text-white">100%</p>
              <p className="text-lg font-semibold text-white capitalize">Quality service</p>
            </div>
          </div>
          <div className="w-full h-auto md:h-[180px] flex flex-col md:flex-row gap-2">

            <div className="w-full md:w-1/3 h-full flex flex-col justify-center items-center p-3 relative">
              <img
                src={data.valuesContent.additionalImages[0]}
                alt="Vision image"
                loading="eager"
                width="150"
                height="150"
                className="w-[150px] h-[150px] object-cover" />
            </div>
            <div className="w-full md:w-1/3 h-full border-2 border-primary flex flex-col justify-center items-center gap-5 rounded-lg bg-tertiary">
              <p className="text-6xl font-bold text-white">100%</p>
              <p className="text-lg font-semibold text-white capitalize">Professionals</p>
            </div>
            <div className="w-full md:w-1/3 h-full hidden md:flex flex-col justify-center items-center p-3 relative">
              <img
                src={data.valuesContent.additionalImages[2]}
                alt="why choose image"
                loading="eager"
                width="150"
                height="150"
                className="w-[150px] h-[150px] object-cover" />
            </div>
          </div>
        </div>
      </div>


    </section>
  );
}

export default Values;

