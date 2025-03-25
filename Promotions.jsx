import React, { useState, useEffect } from "react";
import { Flyer } from "@/entities/Flyer";

export default function PromotionsPage() {
  const [flyers, setFlyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlyers = async () => {
      setLoading(true);
      const data = await Flyer.list("order");
      setFlyers(data);
      setLoading(false);
    };

    loadFlyers();
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12">Ofertas</h1>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : flyers.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma oferta disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {flyers.map((flyer) => (
              <div key={flyer.id} className="flex justify-center">
                <img
                  src={flyer.image_url}
                  alt="Folheto de ofertas"
                  className="max-w-full h-auto rounded shadow-lg"
                  style={{ maxHeight: "1200px" }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}