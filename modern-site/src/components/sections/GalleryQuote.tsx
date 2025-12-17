
export function GalleryQuote() {
  return (
    <section 
      className="w-full bg-black relative" 
      style={{ 
        position: 'relative', 
        zIndex: 30,
        marginTop: '-150px', // Lowered from -200px
        paddingTop: '220px', // Increased from 180px for more spacing
        paddingBottom: '120px', // Increased from 100px
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        outline: 'none',
        boxShadow: 'none',
      }}
    >
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center w-full relative z-30" style={{ border: 'none', outline: 'none' }}>
        <h2 
          className="font-semibold text-white leading-tight"
          style={{
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            lineHeight: '1.3',
            border: 'none',
            outline: 'none',
          }}
        >
          Every pixel with purpose. Every project built to perform
        </h2>
      </div>
    </section>
  )
}

