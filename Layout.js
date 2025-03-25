import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Menu, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Instagram, 
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Setting } from "@/entities/Setting";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Layout({ children, currentPageName }) {
  const [dotClicks, setDotClicks] = useState(0);
  const [logo, setLogo] = useState("/logo.png");
  const navigate = useNavigate();

  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await Setting.list();
        const logoSetting = settings.find(s => s.key === "logo");
        if (logoSetting && logoSetting.value) {
          setLogo(logoSetting.value);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    
    loadSettings();
  }, []);

  const handleDotClick = () => {
    const newCount = dotClicks + 1;
    setDotClicks(newCount);
    
    if (newCount === 10) {
      navigate(createPageUrl("Admin"));
      setDotClicks(0);
    }
  };

  const menuItems = [
    { name: "Início", path: "Home" },
    { name: "Lojas", path: "Stores" },
    { name: "Marcas Próprias", path: "OwnBrands" },
    { name: "Ofertas", path: "Promotions" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        :root {
          --primary: #e53935;
          --primary-dark: #c62828;
          --secondary: #ffd600;
          --secondary-dark: #fbc02d;
        }

        /* Hover Effects */
        .nav-link {
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: var(--primary);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .promotion-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .promotion-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 20px rgba(0,0,0,0.1);
        }

        .footer-link {
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: var(--primary) !important;
        }

        .social-icon {
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .social-icon:hover {
          transform: scale(1.1);
          color: var(--primary) !important;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="h-20 flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center">
              <img 
                src={logo} 
                alt="Ponto Novo" 
                className="h-[40px] w-auto"
                style={{ maxWidth: '412px', maxHeight: '109px', objectFit: 'contain' }}
              />
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`nav-link text-sm font-medium transition-colors hover:text-primary ${
                    currentPageName === item.path ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4 mt-6">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      to={createPageUrl(item.path)}
                      className={`nav-link text-sm font-medium transition-colors hover:text-primary ${
                        currentPageName === item.path ? "text-primary" : "text-gray-600"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-theme(spacing.20)-theme(spacing.40))]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Sobre o Ponto Novo</h3>
              <p className="text-gray-400">
                Compromisso com qualidade e excelência no atendimento aos nossos clientes.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={createPageUrl(item.path)}
                      className="footer-link text-gray-400 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">Contato</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  (19) 3851-5530
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Av. Emilia Marchi Martini, 199
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Segunda à Domingo: 7h às 21h
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p className="mb-2">© 2024 Ponto Novo Supermercados. Todos os direitos reservados.</p>
            <button 
              onClick={handleDotClick}
              className="text-[8px] text-gray-700 hover:text-gray-600 cursor-default"
            >
              ·
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
