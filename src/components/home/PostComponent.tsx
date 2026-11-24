import { useEffect, useState } from "react";
import type { RootObject, SectionsHomeAbout } from "../../interfaces/dbData";

interface PostVCProps {
  dataBlocks: SectionsHomeAbout[];
  data: RootObject;
}

const PostVC: React.FC<PostVCProps> = ({ dataBlocks, data }) => {
  /* ================= HELPERS ================= */
  const has = (b: SectionsHomeAbout, k: string) =>
    [b.title, b.section, b.tipos, b.text].some(
      v => typeof v === "string" && v.toLowerCase().includes(k)
    );

  const imagesBy = (k: string) =>
    dataBlocks.filter(b => has(b, k)).flatMap(b => b.additionalImages || []);

  const getEmbedUrl = (url?: string) => {
    if (!url) return null;
    const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watch) return `https://www.youtube.com/embed/${watch}`;
    const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (short) return `https://www.youtube.com/embed/${short}`;
    return null;
  };

  /* ================= DATA ================= */
  const posts = imagesBy("post");
  const certifications = imagesBy("emblema");
  const videoUrl = getEmbedUrl(data.videoAnimado[0]?.url);

  /* ================= WIDGET FLAGS ================= */
  const postWidget = Boolean(data.widgets?.post);
  const videoWidget = Boolean(data.widgets?.videoAnimado);

  /* ================= MODAL STATE ================= */
  const [postIndex, setPostIndex] = useState(0);
  const [postOpen, setPostOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const [postClosed, setPostClosed] = useState(false);
  const [videoClosed, setVideoClosed] = useState(false);

  /* ================= AUTO OPEN ================= */
  useEffect(() => {
    if (postWidget && posts.length && !postClosed) {
      setPostIndex(0);
      setPostOpen(true);
    }
    if (!postWidget) {
      setPostOpen(false);
      setPostClosed(false);
    }
  }, [postWidget, posts.length]);

  useEffect(() => {
    if (videoWidget && videoUrl && !videoClosed) {
      setVideoOpen(true);
    }
    if (!videoWidget) {
      setVideoOpen(false);
      setVideoClosed(false);
    }
  }, [videoWidget, videoUrl]);

  /* ================= SCROLL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow = postOpen || videoOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [postOpen, videoOpen]);

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closePost();
        closeVideo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ================= NAV ================= */
  const prevPost = () => setPostIndex(i => (i === 0 ? posts.length - 1 : i - 1));
  const nextPost = () => setPostIndex(i => (i === posts.length - 1 ? 0 : i + 1));

  /* ================= CLOSE ================= */
  const closePost = () => {
    setPostOpen(false);
    setPostClosed(true);
  };

  const closeVideo = () => {
    setVideoOpen(false);
    setVideoClosed(true);
  };

  if (!posts.length && !certifications.length && !videoUrl) return null;

  return (
    <>
      {/* ================= SECTION ================= */}
      <section className="py-5 px-6  text-slate-200 relative overflow-hidden">
        {/* Luces ambientales de fondo */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-32 relative z-10">

          {/* ===== OUR VIDEOS ===== */}
          {videoUrl && (
            <div className="text-center space-y-10">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  Media Gallery
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Our Videos</h2>
              </div>

              <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800/80 bg-slate-950/40 p-3 backdrop-blur-sm shadow-2xl shadow-black/50 group">
                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-900 relative">
                  <iframe
                    src={videoUrl}
                    className="w-full h-full border-none group-hover:scale-[1.01] transition-transform duration-500"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          )}

          {/* ===== OUR RECENT POSTS ===== */}
          {posts.length > 0 && (
            <div className="space-y-12">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full">
                  Updates
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Our Recent Posts</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center items-center">
                {posts.map((src, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setPostIndex(idx);
                      setPostOpen(true);
                    }}
                    className="w-full group cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-950/30 p-2.5 backdrop-blur-sm shadow-lg hover:border-slate-700 hover:bg-slate-900/40 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="rounded-xl overflow-hidden bg-slate-900 aspect-[4/3] relative">
                      <img 
                        src={src} 
                        className="w-full h-full object-cover filter brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500" 
                        loading="lazy"
                        alt={`Recent post ${idx + 1}`}
                      />
                      {/* Overlay sutil al hacer hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                          </svg>
                          View Image
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== OUR CERTIFICATIONS ===== */}
          
        </div>
      </section>

      {/* ================= POST MODAL ================= */}
      {postOpen && (
        <div
          onClick={closePost}
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn"
        >
          {/* Botón Cerrar Superior */}
          <button 
            onClick={closePost}
            className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 p-2.5 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div onClick={e => e.stopPropagation()} className="relative flex items-center justify-center max-w-5xl w-full">
            {/* Control Izquierdo */}
            <button 
              onClick={prevPost} 
              className="absolute left-0 md:left-4 z-10 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 p-3 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
              <img
                src={posts[postIndex]}
                className="max-w-full md:max-w-[40vw] object-contain mx-auto"
                alt="Modal view"
              />
            </div>

            {/* Control Derecho */}
            <button 
              onClick={nextPost} 
              className="absolute right-0 md:right-4 z-10 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 p-3 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ================= VIDEO MODAL ================= */}
      {videoOpen && videoUrl && (
        <div
          onClick={closeVideo}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6"
        >
          <button 
            onClick={closeVideo}
            className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 p-2.5 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            onClick={e => e.stopPropagation()}
            className="w-full max-w-4xl aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl"
          >
            <iframe
              src={`${videoUrl}?autoplay=1`}
              className="w-full h-full border-none"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PostVC;