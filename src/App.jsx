import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  MapPin, 
  Facebook, 
  Star, 
  Phone, 
  Clock, 
  ChefHat, 
  X,
  Info,
  Mail
} from 'lucide-react';

const MENU = {
  tacos: [
    { id: 't1', name: 'Taco de Asada', price: 20, description: 'Auténtico sabor a la parrilla.' },
    { id: 't2', name: 'Taco de Labio', price: 20, description: 'Suaves y jugosos.' },
    { id: 't3', name: 'Taco de Adobada', price: 20, description: 'Marinada especial de la casa.' },
    { id: 't4', name: 'Taco de Chorizo', price: 20, description: 'El toque perfecto de especias.' },
    { id: 't5', name: 'Taco de Tripa', price: 20, description: 'Bien doradita.' },
    { id: 't6', name: 'Taco de Arrachera', price: 30, description: 'Corte premium, máximo sabor.' },
  ],
  quesadillas: [
    { id: 'q1', name: 'Quesadilla Sencilla', price: 25, description: 'Mucho queso derretido.' },
    { id: 'q2', name: 'Quesadilla con Carne', price: 40, description: 'De asada, adobada, chorizo o labio.' },
    { id: 'q3', name: 'Quesadilla con Arrachera', price: 45, description: 'Nuestra especialidad con corte premium.' },
  ]
};

const RESTAURANT_INFO = {
  name: "TACORNER",
  address: "Av Adolfo López Mateos Nte 1106, Italia Providencia, 44656 Guadalajara, Jal.",
  facebook: "https://www.facebook.com/Tacorner",
  whatsappNumber: "5213338289923",
  phone: "33 3828 9923",
  email: "contacto@tacorner.com",
  rating: 4.6,
  reviews: 95
};

export default function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', address: '', type: 'delivery', notes: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const heroImages = [
    "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
  ];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Cambia cada 4 segundos
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem => 
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const handleOrder = (e) => {
    e.preventDefault();
    if (!customerInfo.name.trim()) {
      setErrorMsg('Por favor ingresa tu nombre.');
      return;
    }
    if (customerInfo.type === 'delivery' && !customerInfo.address.trim()) {
      setErrorMsg('Por favor ingresa tu dirección para el envío.');
      return;
    }
    setErrorMsg('');

    let message = `*¡Hola TACORNER!*\nMe gustaría hacer el siguiente pedido:\n\n`;
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} - $${item.price * item.quantity}\n`;
    });
    message += `\n*Total:* $${cartTotal}\n\n`;
    message += `*Datos del cliente:*\n`;
    message += `Nombre: ${customerInfo.name}\n`;
    if (customerInfo.type === 'delivery') {
      message += `Tipo de pedido: Envío a domicilio\n`;
      message += `Dirección/Notas: ${customerInfo.address}\n`;
    } else {
      message += `Tipo de pedido: Pasar a recoger\n`;
    }
    if (customerInfo.notes.trim()) {
      message += `\n*Instrucciones especiales:*\n${customerInfo.notes}\n`;
    }
    message += `\n¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-800">
      
      <nav className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <img src="/logo.png" alt="Logo Tacorner" className="h-12 w-auto" />
          </div>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-neutral-100 rounded-full hover:bg-neutral-200 transition-colors"
          >
            <ShoppingCart className="h-6 w-6 text-neutral-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </nav>

      <header className="relative bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-neutral-950">
          {heroImages.map((src, index) => (
            <img 
              key={index}
              src={src} 
              alt="Tacos deliciosos" 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                index === currentImageIndex ? 'opacity-40' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-wide drop-shadow-lg">
            El Sabor de la Esquina
          </h1>
          <p className="text-lg md:text-xl text-neutral-200 mb-8 max-w-2xl drop-shadow-md">
            Pide tus tacos y quesadillas favoritas desde tu celular y recíbelas en la puerta de tu casa o pasa a recogerlas.
          </p>
          <button 
            onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-lg"
          >
            Ver Menú y Pedir
          </button>
          <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span>{RESTAURANT_INFO.rating} ({RESTAURANT_INFO.reviews} opiniones)</span>
            </div>
            <a href="https://maps.app.goo.gl/SCsVkMfKjPwHvpgN6" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-colors cursor-pointer backdrop-blur-sm px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4 text-white" />
              <span>Guadalajara, Jal.</span>
            </a>
          </div>
        </div>
      </header>

      <main id="menu" className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-neutral-800 mb-2 uppercase">Nuestro Menú</h2>
          <div className="h-1 w-24 bg-red-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <section>
            <div className="flex items-center gap-3 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
              <h3 className="text-2xl font-bold text-red-800">Tacos</h3>
            </div>
            <div className="space-y-4">
              {MENU.tacos.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-lg text-neutral-800">{item.name}</h4>
                    <p className="text-sm text-neutral-500 mb-2">{item.description}</p>
                    <span className="text-green-700 font-bold text-lg">${item.price}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-red-50 hover:bg-red-100 active:bg-red-200 active:scale-90 text-red-600 p-3 rounded-xl transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Agregar</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section>
            <div className="flex items-center gap-3 mb-6 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
              <h3 className="text-2xl font-bold text-yellow-800">Quesadillas</h3>
            </div>
            <div className="space-y-4">
              {MENU.quesadillas.map(item => (
                <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex justify-between items-center hover:shadow-md transition-shadow">
                  <div>
                    <h4 className="font-bold text-lg text-neutral-800">{item.name}</h4>
                    <p className="text-sm text-neutral-500 mb-2">{item.description}</p>
                    <span className="text-green-700 font-bold text-lg">${item.price}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-yellow-50 hover:bg-yellow-100 active:bg-yellow-200 active:scale-90 text-yellow-700 p-3 rounded-xl transition-all duration-200 font-medium flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="hidden sm:inline">Agregar</span>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-neutral-900 text-neutral-300 py-12 mt-12 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-1 mb-4">
              <img src="/logo.png" alt="Logo Tacorner" className="h-10 w-auto" />
            </div>
            <p className="text-sm mb-4">Los mejores tacos y quesadillas de Providencia. Calidad y sabor en cada mordida.</p>
            <div className="flex flex-col gap-3 mb-6">
              <a href={`tel:+${RESTAURANT_INFO.whatsappNumber}`} className="inline-flex items-center gap-2 text-sm font-bold text-white bg-neutral-800 hover:bg-neutral-700 w-fit px-4 py-2 rounded-lg transition-colors border border-neutral-700">
                <Phone className="w-4 h-4 text-green-400" /> {RESTAURANT_INFO.phone}
              </a>
              <a href={`mailto:${RESTAURANT_INFO.email}`} className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors w-fit px-1">
                <Mail className="w-4 h-4" /> {RESTAURANT_INFO.email}
              </a>
            </div>
            <a href={RESTAURANT_INFO.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors px-1">
              <Facebook className="w-5 h-5" />
              <span>Síguenos en Facebook</span>
            </a>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" /> Ubicación
            </h4>
            <p className="text-sm mb-3">
              {RESTAURANT_INFO.address}
            </p>
            <a 
              href="https://maps.app.goo.gl/SCsVkMfKjPwHvpgN6" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg transition-colors border border-neutral-700"
            >
              <MapPin className="w-4 h-4 text-red-400" />
              Abrir en Google Maps
            </a>
            <div className="mt-4 flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-2 text-green-400"><span className="w-2 h-2 rounded-full bg-green-500"></span> Consumo en el lugar</span>
              <span className="flex items-center gap-2 text-green-400"><span className="w-2 h-2 rounded-full bg-green-500"></span> Pedidos desde el automóvil</span>
              <span className="flex items-center gap-2 text-green-400"><span className="w-2 h-2 rounded-full bg-green-500"></span> Entrega sin contacto</span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" /> Horarios
            </h4>
            <ul className="text-sm space-y-1 mb-4 text-neutral-400 w-48">
              <li className="flex justify-between"><span>Lun - Jue</span> <span>1:30 - 11:00 p.m.</span></li>
              <li className="flex justify-between"><span>Viernes</span> <span>1:30 - 11:30 p.m.</span></li>
              <li className="flex justify-between"><span>Sábado</span> <span>6:00 p.m. - 12:00 a.m.</span></li>
              <li className="flex justify-between"><span>Domingo</span> <span className="text-red-400">Cerrado</span></li>
            </ul>
            <button 
              onClick={() => document.getElementById('menu').scrollIntoView({ behavior: 'smooth' })}
              className="mt-4 text-sm font-bold text-white bg-neutral-800 hover:bg-neutral-700 px-4 py-2 rounded-lg transition-colors border border-neutral-700"
            >
              Hacer pedido ahora
            </button>
          </div>
        </div>
      </footer>

      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingCart className="text-red-600" /> Tu Pedido
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-neutral-200 rounded-full transition-colors text-neutral-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-white">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4">
                  <ShoppingCart className="w-16 h-16 opacity-20" />
                  <p>Tu carrito está vacío</p>
                  <button onClick={() => setIsCartOpen(false)} className="text-red-600 font-medium hover:underline">Ir al menú</button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                      <div className="flex-1">
                        <h4 className="font-bold text-neutral-800">{item.name}</h4>
                        <div className="text-green-700 font-medium">${item.price}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-neutral-200 rounded-lg">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 text-neutral-500 hover:text-red-600"><Minus className="w-4 h-4" /></button>
                          <span className="w-6 text-center font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 text-neutral-500 hover:text-green-600"><Plus className="w-4 h-4" /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors bg-white border border-neutral-200 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-neutral-200 p-4 bg-neutral-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-neutral-500 font-medium">Total:</span>
                  <span className="text-2xl font-black text-green-700">${cartTotal} MXN</span>
                </div>
                <form onSubmit={handleOrder} className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Tu Nombre" 
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow"
                  />
                  <div className="flex bg-white rounded-xl border border-neutral-300 overflow-hidden">
                    <button type="button" onClick={() => setCustomerInfo({...customerInfo, type: 'delivery'})}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${customerInfo.type === 'delivery' ? 'bg-red-50 text-red-700 border-b-2 border-red-500' : 'text-neutral-500 hover:bg-neutral-50'}`}>
                      A Domicilio
                    </button>
                    <button type="button" onClick={() => setCustomerInfo({...customerInfo, type: 'pickup'})}
                      className={`flex-1 py-2 text-sm font-medium transition-colors ${customerInfo.type === 'pickup' ? 'bg-red-50 text-red-700 border-b-2 border-red-500' : 'text-neutral-500 hover:bg-neutral-50'}`}>
                      Pasar a Recoger
                    </button>
                  </div>
                  {customerInfo.type === 'delivery' && (
                    <textarea 
                      placeholder="Dirección completa y referencias (ej. Casa blanca, portón negro)" 
                      rows="2"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow resize-none text-sm"
                    ></textarea>
                  )}
                  <textarea 
                    placeholder="Instrucciones del pedido (ej. sin cebolla, salsa aparte...)" 
                    rows="2"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-shadow resize-none text-sm"
                  ></textarea>
                  {errorMsg && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                      <Info className="w-4 h-4" /><span>{errorMsg}</span>
                    </div>
                  )}
                  <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 transition-transform hover:scale-[1.02] shadow-md">
                    <Phone className="w-5 h-5" /> Enviar Pedido por WhatsApp
                  </button>
                  <p className="text-xs text-center text-neutral-400 mt-2">Serás redirigido a WhatsApp para confirmar tu pedido.</p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {!isCartOpen && cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="md:hidden fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-2xl flex items-center justify-center z-40"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 text-xs font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
            {totalItems}
          </span>
        </button>
      )}
    </div>
  );
}
