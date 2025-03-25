import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Banner } from "@/entities/Banner";
import { Flyer } from "@/entities/Flyer";
import { Store } from "@/entities/Store";
import { OwnBrand } from "@/entities/OwnBrand";
import { PromotionSettings } from "@/entities/PromotionSettings";
import { Setting } from "@/entities/Setting";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Upload, Trash2, Plus, Image as ImageIcon, Save, Edit } from "lucide-react";

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [banners, setBanners] = useState([]);
  const [flyers, setFlyers] = useState([]);
  const [stores, setStores] = useState([]);
  const [brands, setBrands] = useState([]);
  const [logoUrl, setLogoUrl] = useState("");
  const [editingStore, setEditingStore] = useState(null);
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bannersData, flyersData, storesData, brandsData, settingsList] = await Promise.all([
        Banner.list("order"),
        Flyer.list("order"),
        Store.list(),
        OwnBrand.list("order"),
        Setting.list()
      ]);
      
      setBanners(bannersData);
      setFlyers(flyersData);
      setStores(storesData);
      setBrands(brandsData);
      
      const logoSetting = settingsList.find(s => s.key === "logo");
      if (logoSetting) {
        setLogoUrl(logoSetting.value);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleFileUpload = async (file, type) => {
    try {
      const { file_url } = await UploadFile({ file });
      if (type === 'banner') {
        await Banner.create({ 
          image_url: file_url,
          order: banners.length,
          active: true
        });
      } else if (type === 'flyer') {
        await Flyer.create({
          image_url: file_url,
          order: flyers.length,
          active: true
        });
      } 
      loadData();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleDelete = async (id, type) => {
    if (type === 'banner') {
      await Banner.delete(id);
    } else if (type === 'flyer') {
      await Flyer.delete(id);
    } else if (type === 'store') {
      await Store.delete(id);
    } else if (type === 'brand') {
      await OwnBrand.delete(id);
    }
    loadData();
  };

  const handleLogoUpload = async (file) => {
    try {
      const { file_url } = await UploadFile({ file });
      
      // Check if logo setting already exists
      const settings = await Setting.list();
      const logoSetting = settings.find(s => s.key === "logo");
      
      if (logoSetting) {
        await Setting.update(logoSetting.id, { key: "logo", value: file_url });
      } else {
        await Setting.create({ key: "logo", value: file_url });
      }
      
      setLogoUrl(file_url);
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };

  // Store management
  const handleStoreImageUpload = async (file, storeId) => {
    try {
      const { file_url } = await UploadFile({ file });
      if (storeId) {
        const store = stores.find(s => s.id === storeId);
        await Store.update(storeId, { ...store, image_url: file_url });
      } else if (editingStore) {
        setEditingStore({ ...editingStore, image_url: file_url });
      }
      loadData();
    } catch (error) {
      console.error("Error uploading store image:", error);
    }
  };

  const handleCreateStore = () => {
    setEditingStore({
      short_name: "",
      name: "",
      address: "",
      neighborhood: "",
      city: "",
      phone: "",
      hours: "",
      image_url: "",
      maps_url: ""
    });
  };

  const handleEditStore = (store) => {
    setEditingStore(store);
  };

  const handleSaveStore = async () => {
    try {
      if (editingStore.id) {
        await Store.update(editingStore.id, editingStore);
      } else {
        await Store.create(editingStore);
      }
      setEditingStore(null);
      loadData();
    } catch (error) {
      console.error("Error saving store:", error);
    }
  };

  // Brand management
  const handleBrandImageUpload = async (file, brandId) => {
    try {
      const { file_url } = await UploadFile({ file });
      if (brandId) {
        const brand = brands.find(b => b.id === brandId);
        await OwnBrand.update(brandId, { ...brand, image_url: file_url });
      } else if (editingBrand) {
        setEditingBrand({ ...editingBrand, image_url: file_url });
      }
      loadData();
    } catch (error) {
      console.error("Error uploading brand image:", error);
    }
  };

  const handleCreateBrand = () => {
    setEditingBrand({
      name: "",
      description: "",
      image_url: "",
      order: brands.length
    });
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
  };

  const handleSaveBrand = async () => {
    try {
      if (editingBrand.id) {
        await OwnBrand.update(editingBrand.id, editingBrand);
      } else {
        await OwnBrand.create(editingBrand);
      }
      setEditingBrand(null);
      loadData();
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

      <Tabs defaultValue="general">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="flyers">Folhetos</TabsTrigger>
          <TabsTrigger value="stores">Lojas</TabsTrigger>
          <TabsTrigger value="brands">Marcas Próprias</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="block mb-2">Logo do Site</Label>
                  <div className="flex items-start gap-6">
                    {logoUrl && (
                      <div className="w-64 h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        <img 
                          src={logoUrl} 
                          alt="Logo atual" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label 
                        className="block cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg p-4 transition-colors"
                      >
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleLogoUpload(e.target.files[0])}
                        />
                        Carregar Novo Logo
                      </Label>
                      <p className="text-sm text-gray-500">
                        Tamanho recomendado: 412x109 pixels (PNG transparente)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banners Tab */}
        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Banners do Carrossel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="relative group">
                    <img 
                      src={banner.image_url} 
                      alt="Banner" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(banner.id, 'banner')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <label className="border-2 border-dashed rounded-lg p-4 hover:border-primary cursor-pointer flex items-center justify-center h-48">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'banner')}
                  />
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Banner</span>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flyers Tab */}
        <TabsContent value="flyers">
          <Card>
            <CardHeader>
              <CardTitle>Folhetos de Ofertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flyers.map((flyer) => (
                  <div key={flyer.id} className="relative group">
                    <img 
                      src={flyer.image_url} 
                      alt="Flyer" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDelete(flyer.id, 'flyer')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <label className="border-2 border-dashed rounded-lg p-4 hover:border-primary cursor-pointer flex items-center justify-center h-48">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files[0], 'flyer')}
                  />
                  <div className="text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Folheto</span>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stores Tab */}
        <TabsContent value="stores">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gerenciar Lojas</CardTitle>
              <Button onClick={handleCreateStore}>
                <Plus className="h-4 w-4 mr-2" /> Nova Loja
              </Button>
            </CardHeader>
            <CardContent>
              {editingStore ? (
                <div className="border rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">
                    {editingStore.id ? "Editar Loja" : "Nova Loja"}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="store-short-name">Nome Abreviado</Label>
                      <Input
                        id="store-short-name"
                        value={editingStore.short_name}
                        onChange={(e) => setEditingStore({...editingStore, short_name: e.target.value})}
                        placeholder="Ex: SPN Loja 1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-name">Nome Completo</Label>
                      <Input
                        id="store-name"
                        value={editingStore.name}
                        onChange={(e) => setEditingStore({...editingStore, name: e.target.value})}
                        placeholder="Ex: Av. Emília Marchi Martini"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-address">Endereço</Label>
                      <Input
                        id="store-address"
                        value={editingStore.address}
                        onChange={(e) => setEditingStore({...editingStore, address: e.target.value})}
                        placeholder="Ex: Av. Emilia Marchi Martini, 199"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-neighborhood">Bairro</Label>
                      <Input
                        id="store-neighborhood"
                        value={editingStore.neighborhood}
                        onChange={(e) => setEditingStore({...editingStore, neighborhood: e.target.value})}
                        placeholder="Ex: Jardim Almira"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-city">Cidade/UF</Label>
                      <Input
                        id="store-city"
                        value={editingStore.city}
                        onChange={(e) => setEditingStore({...editingStore, city: e.target.value})}
                        placeholder="Ex: Mogi Guaçu/SP"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-phone">Telefone</Label>
                      <Input
                        id="store-phone"
                        value={editingStore.phone}
                        onChange={(e) => setEditingStore({...editingStore, phone: e.target.value})}
                        placeholder="Ex: (19) 3851-5530"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-hours">Horário</Label>
                      <Input
                        id="store-hours"
                        value={editingStore.hours}
                        onChange={(e) => setEditingStore({...editingStore, hours: e.target.value})}
                        placeholder="Ex: Segunda à Domingo: 7h às 21h"
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-maps">Link do Maps</Label>
                      <Input
                        id="store-maps"
                        value={editingStore.maps_url}
                        onChange={(e) => setEditingStore({...editingStore, maps_url: e.target.value})}
                        placeholder="URL do Google Maps"
                      />
                    </div>
                  </div>
                  
                  <Label className="block mb-2">Imagem da Loja</Label>
                  <div className="flex items-start gap-4 mb-6">
                    {editingStore.image_url ? (
                      <div className="w-48 h-32 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={editingStore.image_url} 
                          alt="Imagem da loja" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-32 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <label className="inline-block cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg p-2 transition-colors">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleStoreImageUpload(e.target.files[0])}
                        />
                        Upload Imagem
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingStore(null)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveStore}>
                      <Save className="h-4 w-4 mr-2" /> Salvar Loja
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stores.map((store) => (
                  <div key={store.id} className="border rounded-lg overflow-hidden">
                    <div className="h-40 relative">
                      <img 
                        src={store.image_url || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1074"} 
                        alt={store.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="bg-white hover:bg-gray-100"
                          onClick={() => handleEditStore(store)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="bg-white hover:bg-gray-100 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso removerá permanentemente a loja "{store.short_name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(store.id, 'store')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">{store.short_name}</h3>
                      <p className="text-sm text-gray-600">{store.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brands Tab */}
        <TabsContent value="brands">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gerenciar Marcas Próprias</CardTitle>
              <Button onClick={handleCreateBrand}>
                <Plus className="h-4 w-4 mr-2" /> Nova Marca
              </Button>
            </CardHeader>
            <CardContent>
              {editingBrand ? (
                <div className="border rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-bold mb-4">
                    {editingBrand.id ? "Editar Marca" : "Nova Marca"}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                      <Label htmlFor="brand-name">Nome</Label>
                      <Input
                        id="brand-name"
                        value={editingBrand.name}
                        onChange={(e) => setEditingBrand({...editingBrand, name: e.target.value})}
                        placeholder="Nome da marca"
                      />
                    </div>
                    <div>
                      <Label htmlFor="brand-description">Descrição</Label>
                      <Textarea
                        id="brand-description"
                        value={editingBrand.description}
                        onChange={(e) => setEditingBrand({...editingBrand, description: e.target.value})}
                        placeholder="Descrição da marca"
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <Label className="block mb-2">Imagem da Marca</Label>
                  <div className="flex items-start gap-4 mb-6">
                    {editingBrand.image_url ? (
                      <div className="w-48 h-32 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={editingBrand.image_url} 
                          alt="Imagem da marca" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-32 bg-gray-100 rounded flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <label className="inline-block cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 rounded-lg p-2 transition-colors">
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleBrandImageUpload(e.target.files[0])}
                        />
                        Upload Imagem
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setEditingBrand(null)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveBrand}>
                      <Save className="h-4 w-4 mr-2" /> Salvar Marca
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand) => (
                  <div key={brand.id} className="border rounded-lg overflow-hidden">
                    <div className="h-40 relative">
                      <img 
                        src={brand.image_url || "https://images.unsplash.com/photo-1581955957646-b8c15313991e?w=800&q=80"} 
                        alt={brand.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="bg-white hover:bg-gray-100"
                          onClick={() => handleEditBrand(brand)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="bg-white hover:bg-gray-100 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta ação não pode ser desfeita. Isso removerá permanentemente a marca "{brand.name}".
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(brand.id, 'brand')}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold">{brand.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{brand.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}