import { useState } from "react";
import Form from "../contact/Form";
import type { RootObject } from "../../interfaces/dbData";
import CleaningCostCalculator from "../calculatorCost/CleaningCostCalculator";

interface ToggleButtonProps {
  data: RootObject;
}

const ToggleButton = ({ data }: ToggleButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-auto ">
      {/* Botón para abrir/cerrar el panel */}
      <div
        className="flex items-center gap-2 cursor-pointer text-white px-4 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: data.colors.primaryColor,
        }}
      >
        <span className="text-[14px] font-bold">Request a Quote</span>
        <i className="fas fa-file-signature text-2xl cursor-pointer p-2 rounded-md" aria-hidden={true}></i>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-500 ease-in-out"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Panel lateral */}
      <div
        className={`fixed top-0 right-0 w-[30vw] h-full bg-white shadow-md transform transition-transform duration-500 ease-in-out overflow-y-scroll content_scroll z-50 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <i
            className="fas fa-times text-3xl cursor-pointer text-white p-2 rounded-md absolute top-2 right-2"
            style={{ backgroundColor: data.colors.secondaryColor}}
            onClick={() => setIsOpen(false)}
            aria-hidden={true}
          ></i>
        {/* Contenido del panel */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Request a Quote</h2>
          <Form data={data} />
        </div>
      </div>
    </div>
  );
};

export default ToggleButton;
