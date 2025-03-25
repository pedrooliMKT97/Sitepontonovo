import React, { useState, useEffect } from "react";
import { OwnBrand } from "@/entities/OwnBrand";
import { Card, CardContent } from "@/components/ui/card";

export default function OwnBrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true);
      const data = await OwnBrand.list("order");
      setBrands(data);
      setLoading(false);
    };

    loadBrands();
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-4">Marcas Próprias</h1>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Conheça nossas marcas exclusivas desenvolvidas com o maior cuidado para oferecer qualidade e economia para você e sua família.
        </p>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : brands.length === 0 ? (
          <p className="text-center text-gray-500">Nenhuma marca própria cadastrada.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brands.map((brand) => (
              <Card key={brand.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={brand.image_url}
                    alt={brand.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{brand.name}</h3>
                  <p className="text-gray-600">{brand.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}