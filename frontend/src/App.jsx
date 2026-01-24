import { useState, useEffect, useRef } from 'react';
import './App.css';

/* --- DONNÉES DES COLLECTIONS PAR SAISON --- */
const seasonalCollections = {
  hiver: [
    {
      id: 101,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1400",
      title: "Collection Hiver",
      subtitle: "Chaleur & Élégance"
    },
    {
      id: 103,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400",
      title: "Éclat Hivernal",
      subtitle: "Prêt-à-porter féminin"
    },
    {
      id: 104,
      image: "https://images.unsplash.com/photo-1517677129300-07b130802f46?w=1400",
      title: "Kids Winter",
      subtitle: "Le style n'attend pas"
    },
    {
      id: 105,
      image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1400",
      title: "Chic & Froid",
      subtitle: "Accessoires et mailles"
    },
    {
      id: 106,
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1400",
      title: "Savoir-faire",
      subtitle: "La maturité au service de l'élégance"
    },
    {
      id: 107,
      image: "https://images.unsplash.com/photo-1511406361295-0a5ff814c0ad?w=1400",
      title: "Urban Winter",
      subtitle: "Streetwear de saison"
    },
    {
      id: 108,
      image: "https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=1400",
      title: "Minimalisme",
      subtitle: "Coupes épurées et tons neutres"
    }
  ],
  ete: [
    { id: 201, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400", title: "Collection Été", subtitle: "Légèreté & Lin" },
    { id: 202, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1400", title: "Summer Business", subtitle: "Rester frais en costume" },
    { id: 203, image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=1400", title: "Plage Enfant", subtitle: "Couleurs vitaminées" }
  ],
  printemps_automne: [
    { id: 301, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400", title: "Saisons Douces", subtitle: "Le style de transition" },
    { id: 302, image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=1400", title: "Urban Fall", subtitle: "Vestes légères & Sneakers" },
    { id: 303, image: "https://images.unsplash.com/photo-1519457431-7571f0181e42?w=1400", title: "Look de Rentrée", subtitle: "Nouveautés pour tous" }
  ]
};

/* --- COMPOSANT : DIAPORAMA DE FOND --- */
const BackgroundSlideshow = ({ currentSlide, slidesData }) => {
  return (
    <div className="slide-container">
      {slidesData.map((slide, index) => (
        <div
          key={slide.id}
          className={`bg-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        ></div>
      ))}
      <div className="overlay-home"></div>
    </div>
  );
};

/* --- COMPOSANT : CARROUSEL PRODUIT --- */
const ProductCarousel = ({ products }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 220;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="carousel-wrapper">
      <button className="carousel-nav-btn nav-left" onClick={() => scroll('left')}>❮</button>
      <button className="carousel-nav-btn nav-right" onClick={() => scroll('right')}>❯</button>
      <div className="carousel-track" ref={scrollRef}>
        {products.map((item) => (
          <div key={item.id} className="carousel-card">
            <div className="card-image-box">
              <span className="feature-badge">{item.feature}</span>
              <img src={item.image} alt={item.name} />
            </div>
            <div className="card-details">
              <div className="card-name">{item.name}</div>
              <div className="card-price">{item.price} €</div>
              {item.sizes && item.sizes.length > 0 && (
                <div className="card-sizes">
                  {item.sizes.map(s => <span key={s} className="size-badge">{s}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* --- APPLICATION PRINCIPALE --- */
function App() {
  const [showHome, setShowHome] = useState(true);

  // Logique de saison automatique
  const getCurrentSeasonData = () => {
    const month = new Date().getMonth();
    if ([11, 0, 1].includes(month)) return { slides: seasonalCollections.hiver, theme: 'winter' };
    if ([5, 6, 7].includes(month)) return { slides: seasonalCollections.ete, theme: 'summer' };
    return { slides: seasonalCollections.printemps_automne, theme: 'autumn' };
  };

  const seasonData = getCurrentSeasonData();
  const [slidesData] = useState(seasonData.slides);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Animation du slideshow (7 secondes pour la fluidité)
  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((p) => (p + 1) % slidesData.length), 7000);
    return () => clearInterval(interval);
  }, [slidesData.length]);

  // Barre de promotion
  const [currentPromo, setCurrentPromo] = useState(0);
  const promotions = ["🔥 Vente Flash : -30% jusqu'à minuit", "🚚 Livraison offerte dès 100€", "✨ -10% code: WELCOME"];
  useEffect(() => {
    const interval = setInterval(() => setCurrentPromo((p) => (p + 1) % promotions.length), 4000);
    return () => clearInterval(interval);
  }, []);

  // Chat Logic
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Bonjour ! ✨ Je suis votre styliste personnel. Comment puis-je vous aider à sublimer votre style aujourd'hui ?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!showHome) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, showHome]);

  const handleSend = async () => {
    if (inputValue.trim() === "") return;

    const userMsgText = inputValue;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userMsgText }]);
    setInputValue("");
    setIsTyping(true);

    try {
      const historyForBackend = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: m.text
      }));

      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          history: historyForBackend
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: data.reply,
        products: data.products
      }]);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const enterSite = () => setShowHome(false);

  return (
    <div className={`app-container ${seasonData.theme}-theme`}>
      {showHome && (
        <div className="home-container">
          <BackgroundSlideshow currentSlide={currentSlide} slidesData={slidesData} />
          <div className="home-content">
            <h1 className="home-title">SMARTSHOP<br />STUDIO.</h1>
            <div className="home-subtitle">L'expérience Shopping Réinventée</div>
            <div className="home-buttons">
              <button className="btn-big btn-outline" onClick={enterSite}>Découvrir</button>
              <button className="btn-big btn-filled" onClick={enterSite}>Explorer</button>
            </div>
            <div className="info-bar-container nav-mode">
              <div className="nav-left-links">
                <button className="nav-link-btn" onClick={() => alert('À propos de SmartShop Studio...')}>About Us</button>
                <button className="nav-link-btn" onClick={() => alert('Nos Collections 2026')}>Collections</button>
              </div>

              <div className="nav-center-info">
                <div className="info-item">
                  <svg className="premium-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                  <span className="info-text-mini">IA STYLISTE 2.0</span>
                </div>
              </div>

              <div className="nav-right-actions">
                <button className="nav-btn-login" onClick={enterSite}>Log In</button>
                <button className="nav-btn-signup" onClick={enterSite}>Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showHome && (
        <>
          <div className="visual-panel">
            <BackgroundSlideshow currentSlide={currentSlide} slidesData={slidesData} />
            <div className="slide-text-content">
              <h1 className="slide-title">{slidesData[currentSlide].title}</h1>
              <div className="slide-subtitle">{slidesData[currentSlide].subtitle}</div>
            </div>
            <div className="promo-bar-bottom">
              <span className="promo-text">{promotions[currentPromo]}</span>
            </div>
          </div>

          <div className="chat-panel">
            <header className="chat-header">
              <h2>Assistant Personnel</h2>
              <button onClick={() => setShowHome(true)} className="exit-btn">✕ Quitter</button>
            </header>
            <div className="messages-area">
              {messages.map((msg) => (
                <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <div className={`bubble ${msg.sender}`}>{msg.text}</div>
                  {msg.products && <ProductCarousel products={msg.products} />}
                </div>
              ))}
              {isTyping && <div className="typing-indicator"><div className="dot"></div><div className="dot"></div><div className="dot"></div></div>}
              <div ref={chatEndRef} />
            </div>
            <footer className="input-area">
              <input
                type="text" placeholder="Décrivez votre envie..."
                value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="send-btn-sq" onClick={handleSend}>➜</button>
            </footer>
          </div>
        </>
      )}
    </div>
  );
}

export default App;