export default function Header() {
  return (
    <header style={{
      backgroundColor: '#222',
      color: '#fff',
      padding: '15px 20px',
      textAlign: 'center',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      zIndex: '1000',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>My Website</h1>
        <nav>
          <a href="/" style={navLinkStyle}>Home</a>
          <a href="/about" style={navLinkStyle}>About</a>
          <a href="/products" style={navLinkStyle}>Products</a>
          <a href="/contact" style={navLinkStyle}>Contact As</a>

        </nav>
      </div>
    </header>
  );
}

const navLinkStyle = {
  color: '#fff',
  margin: '0 15px',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '500',
  transition: 'color 0.3s',
};

