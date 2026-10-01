import type { RootObject, Service } from "../../interfaces/dbData";

interface ServicesHome3Props {
  dbServices: Service[];
  landingServices: boolean;
  slidesPerView?: number;
  onePage?: boolean;
  dataglobal: RootObject;
}

const ServicesHome3: React.FC<ServicesHome3Props> = ( {
    dbServices,
}) => {
    return (
        <section className="w-full bg-slate-600 h-screen flex justify-center items-center">
            <div className="w-10/12 mx-auto max-h-[80vh] overflow-y-scroll">
            <div className="w-4/5 h-auto">
            {
                dbServices.map((services, index) => (
                    <div key={index} className="w-full py-10 border-y border-white">
                        <h1 className="text-4xl text-white font-light">{services.title}</h1>
                    </div>
                ))
            }
            </div>
            </div>

        </section>
    );
}

export default ServicesHome3;