import React, { useState, useEffect } from "react";
import { Banner } from "@/entities/Banner";
import { Setting } from "@/entities/Setting";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HomePage() {
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [banners]);

  const loadData = async () => {
    const bannerData = await Banner.list("order");
    setBanners(bannerData);
  };

  const defaultBanners = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2574",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800",
    "https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800"
  ];

  const displayBanners = banners.length > 0 
    ? banners.map(b => b.image_url)
    : defaultBanners;

  return (
    <div>
      <section className="relative h-[60vh]">
        {displayBanners.map((imageUrl, index) => (
          <div
            key={index}
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: index === currentBannerIndex ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out',
              backgroundColor: 'rgba(0,0,0,0.4)',
              backgroundBlendMode: 'overlay'
            }}
          />
        ))}
        
        <div className="relative h-full z-10">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Qualidade e Economia Todo Dia
              </h1>
              <p className="text-xl mb-8">
                Descubra as melhores ofertas e produtos frescos para sua família
              </p>
              <Link to={createPageUrl("Promotions")}>
                <Button size="lg" className="bg-primary hover:bg-primary-dark">
                  Ver Ofertas
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container mx-auto px-4">
          <iframe
            src="https://onlinesim.com.br/pontonovo/"
            className="w-full h-[600px] border-0"
            title="Online Sim"
          />
        </div>
      </section>

      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Faça Parte do Nosso Clube de Vantagens
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Cadastre-se agora e aproveite descontos exclusivos, pontos em dobro e muito mais!
          </p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
            Cadastre-se Agora
          </Button>
        </div>
      </section>
    </div>
  );
}
