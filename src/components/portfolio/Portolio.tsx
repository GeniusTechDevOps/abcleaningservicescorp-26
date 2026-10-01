import { useState } from "react";
interface PortfolioProps {
  data: any;
}
export default function Portfolio({ data }: PortfolioProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const openModal = (index: number) => {
    setCurrentImage(index);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % data?.gallery.length);
  };
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + data.gallery.length) % data?.gallery.length);
  };
  return (
    <>
      <div className="flex flex-wrap justify-center gap-4">
        {data?.gallery?.map((image: any, index: any) => (
          <div
            className="bg-gray-200 rounded overflow-hidden"
            key={index}
            onClick={() => openModal(index)}
          >
            <img
              src={image}
              alt={`Gallery image ${index}`}
              className="w-[250px] h-[300px] object-cover rounded transition-opacity duration-500 ease-in-out"
              loading="lazy"
            />
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="modal rounded-lg shadow-lg max-w-2xl w-full m-4 relative">
            <div className="w-full h-[80vh] object-cover rounded relative">
              <img
                src={data.gallery[currentImage]}
                alt={`Gallery image ${currentImage}`}
                className="w-full h-[80vh] object-contain rounded"
              />
              <span
                className="close-modal 
                bg-white text-red-500 rounded-full w-8 h-8 flex justify-center items-center
                cursor-pointer absolute top-3 right-3 text-[20px]
                "
                onClick={closeModal}
              >
                X
              </span>
            </div>
            <div className="flex justify-between mt-4 items-center bg-slate-200 p-3 rounded-2xl">
              <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded" onClick={prevImage}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <span className="text-gray-700 font-bold text-[22px]">
                {currentImage + 1} / {data.gallery.length}
              </span>
              <button className="bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded " onClick={nextImage}>
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}