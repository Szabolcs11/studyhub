function Settings() {
  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '800px', 
      margin: '0 auto',
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ 
        fontSize: '2rem', 
        fontWeight: 'bold', 
        marginBottom: '1rem',
        color: '#1e293b'
      }}>
        Beállítások
      </h1>
      <p style={{ 
        color: '#64748b', 
        lineHeight: 1.6 
      }}>
        Itt hamarosan elérhetőek lesznek a beállítások. Jelenleg ez a oldal még fejlesztés alatt áll.
      </p>
    </div>
  );
}

export default Settings;
