import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      {/* Added marginTop to push content below the fixed header */}
      <main style={{ flex: 1, padding: '20px', marginTop: '80px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
