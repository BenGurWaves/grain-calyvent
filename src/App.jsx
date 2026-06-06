import { useState } from 'react'
import './App.css'

// Core SVG noise generation logic
const generateRawSvg = (type, freqX, freqY, octaves, stitch) => {
  return `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>` +
         `<filter id='grain'>` +
         `<feTurbulence type='${type}' baseFrequency='${freqX} ${freqY}' numOctaves='${octaves}' stitchTiles='${stitch}'/>` +
         `</filter>` +
         `<rect width='100%' height='100%' filter='url(#grain)'/>` +
         `</svg>`;
};

const compileCssBackgroundString = (rawSvg) => {
  const optimizedString = encodeURIComponent(rawSvg)
    .replace(/%3C/g, '<')
    .replace(/%3E/g, '>')
    .replace(/%22/g, "'")
    .replace(/%2F/g, '/');
  
  return `url("data:image/svg+xml;utf8,${optimizedString}")`;
};

function App() {
  const [noiseType, setNoiseType] = useState('fractalNoise')
  const [baseFrequencyX, setBaseFrequencyX] = useState(0.650)
  const [baseFrequencyY, setBaseFrequencyY] = useState(0.650)
  const [linkedFrequency, setLinkedFrequency] = useState(true)
  const [numOctaves, setNumOctaves] = useState(3)
  const [stitchTiles, setStitchTiles] = useState('stitch')
  const [opacity, setOpacity] = useState(0.08)
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF')
  const [copied, setCopied] = useState(null)

  const rawSvg = generateRawSvg(noiseType, baseFrequencyX, baseFrequencyY, numOctaves, stitchTiles)
  const cssBackground = compileCssBackgroundString(rawSvg)
  const fullCss = `background-image: ${cssBackground}; opacity: ${opacity.toFixed(2)};`

  const handleFrequencyXChange = (value) => {
    setBaseFrequencyX(value)
    if (linkedFrequency) {
      setBaseFrequencyY(value)
    }
  }

  const handleFrequencyYChange = (value) => {
    setBaseFrequencyY(value)
    if (linkedFrequency) {
      setBaseFrequencyX(value)
    }
  }

  const copyToClipboard = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="archive">
      {/* Top Bar */}
      <header className="chassis">
        <a className="brand" href="/" aria-label="Grain home">
          <span className="brand__word">GRAIN</span>
        </a>
        <nav className="chassis__nav">
          <a href="https://velocity.calyvent.com" target="_blank" rel="noopener noreferrer">VELOCITY.CALYVENT.COM</a>
        </nav>
      </header>

      <div className="spec-sheet">
        {/* Hero */}
        <section className="header">
          <h1 className="title">SVG Noise Generator</h1>
          <p className="subtitle">Local-first texture synthesis for digital product design</p>
        </section>

        {/* Main Workspace */}
        <div className="workbench">
          {/* Left Control Column */}
          <section className="control-panel">
            <div className="control-group">
              <label className="control-label">NOISE TYPE</label>
              <div className="toggle-group">
                <button 
                  className={`toggle-btn ${noiseType === 'fractalNoise' ? 'active' : ''}`}
                  onClick={() => setNoiseType('fractalNoise')}
                >
                  FRACTAL
                </button>
                <button 
                  className={`toggle-btn ${noiseType === 'turbulence' ? 'active' : ''}`}
                  onClick={() => setNoiseType('turbulence')}
                >
                  TURBULENCE
                </button>
              </div>
            </div>

            <div className="control-group">
              <div className="control-header">
                <label className="control-label">BASE FREQUENCY</label>
                <button 
                  className={`link-btn ${linkedFrequency ? 'active' : ''}`}
                  onClick={() => setLinkedFrequency(!linkedFrequency)}
                  title="Link X and Y frequencies"
                >
                  {linkedFrequency ? '🔗' : '⛓'}
                </button>
              </div>
              <div className="slider-group">
                <div className="slider-row">
                  <span className="slider-label">X</span>
                  <input 
                    type="range" 
                    min="0.001" 
                    max="0.999" 
                    step="0.001" 
                    value={baseFrequencyX}
                    onChange={(e) => handleFrequencyXChange(parseFloat(e.target.value))}
                    className="hardware-slider"
                  />
                  <span className="slider-value">{baseFrequencyX.toFixed(3)}</span>
                </div>
                <div className="slider-row">
                  <span className="slider-label">Y</span>
                  <input 
                    type="range" 
                    min="0.001" 
                    max="0.999" 
                    step="0.001" 
                    value={baseFrequencyY}
                    onChange={(e) => handleFrequencyYChange(parseFloat(e.target.value))}
                    className="hardware-slider"
                  />
                  <span className="slider-value">{baseFrequencyY.toFixed(3)}</span>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">NUM OCTAVES</label>
              <div className="octave-group">
                {[1, 2, 3, 4, 5].map((octave) => (
                  <button 
                    key={octave}
                    className={`octave-btn ${numOctaves === octave ? 'active' : ''}`}
                    onClick={() => setNumOctaves(octave)}
                  >
                    {octave}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">STITCH TILES</label>
              <div className="toggle-group">
                <button 
                  className={`toggle-btn ${stitchTiles === 'stitch' ? 'active' : ''}`}
                  onClick={() => setStitchTiles('stitch')}
                >
                  STITCH
                </button>
                <button 
                  className={`toggle-btn ${stitchTiles === 'noStitch' ? 'active' : ''}`}
                  onClick={() => setStitchTiles('noStitch')}
                >
                  NO STITCH
                </button>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">OPACITY</label>
              <div className="slider-row">
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="hardware-slider"
                />
                <span className="slider-value">{opacity.toFixed(2)}</span>
              </div>
            </div>

            <div className="control-group">
              <label className="control-label">BACKGROUND TEST</label>
              <div className="color-palette">
                <button 
                  className={`color-btn ${backgroundColor === '#FFFFFF' ? 'active' : ''}`}
                  style={{ backgroundColor: '#FFFFFF' }}
                  onClick={() => setBackgroundColor('#FFFFFF')}
                  title="Pure White"
                />
                <button 
                  className={`color-btn ${backgroundColor === '#808080' ? 'active' : ''}`}
                  style={{ backgroundColor: '#808080' }}
                  onClick={() => setBackgroundColor('#808080')}
                  title="Mid Grey"
                />
                <button 
                  className={`color-btn ${backgroundColor === '#1A1A1A' ? 'active' : ''}`}
                  style={{ backgroundColor: '#1A1A1A' }}
                  onClick={() => setBackgroundColor('#1A1A1A')}
                  title="Dark Charcoal"
                />
              </div>
            </div>
          </section>

          {/* Right Output Panel */}
          <section className="output-panel">
            {/* Texture Sandbox Stage */}
            <div className="sandbox-stage">
              <div className="sandbox-header">
                <h3>TEXTURE SANDBOX</h3>
              </div>
              <div 
                className="sandbox-container"
                style={{ backgroundColor }}
              >
                <div 
                  className="texture-layer"
                  style={{ 
                    backgroundImage: cssBackground,
                    opacity 
                  }}
                />
              </div>
            </div>

            {/* Code Output Cluster */}
            <div className="code-cluster">
              <div className="code-header">
                <h3>EXPORT</h3>
              </div>
              
              <div className="code-block">
                <span className="code-label">CSS</span>
                <code className="code-value">{fullCss}</code>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(fullCss, 'css')}
                >
                  {copied === 'css' ? '✓' : 'COPY'}
                </button>
              </div>

              <div className="code-block">
                <span className="code-label">SVG</span>
                <code className="code-value">{rawSvg}</code>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(rawSvg, 'svg')}
                >
                  {copied === 'svg' ? '✓' : 'COPY'}
                </button>
              </div>

              <div className="code-block">
                <span className="code-label">DATA URI</span>
                <code className="code-value">{cssBackground}</code>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(cssBackground, 'uri')}
                >
                  {copied === 'uri' ? '✓' : 'COPY'}
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="attribution">
          <span>VELOCITY.CALYVENT.COM // LOCAL ARCHIVE SYSTEM // CALYVENT.COM</span>
          <span className="footer-links">
            <a href="/privacy.html">PRIVACY</a>
            {' · '}<a href="/terms.html">TERMS</a>
          </span>
        </footer>
      </div>
    </div>
  )
}

export default App
