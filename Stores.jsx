import React, { useState, useEffect } from "react";
import { Store } from "@/entities/Store";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";

export default function StoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStores = async () => {
      setLoading(true);
      const data = await Store.list();
      setStores(data);
      setLoading(false);
    };

    loadStores();
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-12">Nossas Lojas</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store) => (
            <Card key={store.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="h-56 relative overflow-hidden">
                <img
                  src={store.image_url || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1074"}
                  alt={store.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">{store.short_name}</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <p>{store.address}</p>
                      <p>{store.neighborhood} | {store.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                    <p>{store.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                    <p>{store.hours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}