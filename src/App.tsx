import Layout from './components/Layout';
import WalletStatus from './WalletStatus';
import AuditPage from './AuditPage';
import LoadingScreen from './components/LoadingScreen';
import ParallaxBackground from './components/ParallaxBackground';


export function App() {
  return (
    <Layout>
      {/* 🔌 Wallet Connect */}
      {/* overlays */}
      
      <LoadingScreen />
      <div className="overlay"></div>
      <div className="overlay-2"></div>
      <ParallaxBackground />
      <div className="overlay-3"></div>

      <WalletStatus />
       {/* noise & scanlines */}
       <div className="noise"></div>
      <div className="scanlines"></div>


      {/* 🧠 Wallet Info + Owned Reports */}
      <div className="p-4 max-w-screen-lg mx-auto">
      <div className="glass-panel p-6">
          
        </div>
        <div className="glass-panel p-6 mt-6">
          
        </div>
      </div>

      <hr className="my-8 border-neonBlue" />

      {/* 📂 Audit Submission Area */}
      <div className="glass-panel p-6">
        <AuditPage />
      </div>
    </Layout>
  );
}

export default App;
