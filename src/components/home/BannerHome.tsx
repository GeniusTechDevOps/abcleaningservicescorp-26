import type { RootObject } from "../../interfaces/dbData";
import ButtonContent from "../buttons/Buttons";

interface BannerHomeProps {
    data: RootObject;
}

const BannerHome: React.FC<BannerHomeProps> = ({ data }) => {
    return (
        <section className="w-full h-auto flex flex-col md:flex-row justify-center items-center bg-secondary relative overflow-hidden">
            <div className="w-full md:w-4/5 px-5 py-16 flex flex-col md:flex-row justify-start items-center gap-5 md:gap-10 relative z-10">
                <div className="w-full md:w-3/5 pt-56 md:pt-0 text-center md:text-left ">
                    <p className="text-base text-slate-200 font-semibold pb-2"><i className="fa-solid fa-screwdriver-wrench"></i> Free to Contact Us</p>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white capitalize">{data.slogan[0]}</h2>
                </div>
                {/* <ButtonContent /> */}
                <a aria-label="Call Us Now" className="w-20 h-20 bg-primary rounded-full text-3xl text-white border-4 border-white flex justify-center items-center" href={`tel:+1${data.dataGeneral.phones[0].number}`}>
                    <i className="fa-solid fa-phone-volume"></i>
                </a>
            </div>
            <div className="w-[400px] h-[400px] rounded-3xl absolute -top-[28%] -right-6 md:-right-16  bg-transparent border-[12px] border-white  rotate-0 md:rotate-[45deg] overflow-hidden">
                <img src={data.gallery[2]} alt="img" className="w-full h-full rotate-0 md:-rotate-45 -ml-4 md:-ml-20" />
            </div>

        </section>

    );
}

export default BannerHome;
