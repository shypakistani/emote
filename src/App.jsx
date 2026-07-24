import { useState, useMemo, useRef, useEffect } from 'react'
import EMOTES from './emotes.js'

const API_BASE = 'http://37.27.54.248:26712/join'
const CDN = 'https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/'

function buildUrl(tc, uids, emoteId) {
  const params = new URLSearchParams()
  params.set('tc', tc.trim())
  const filled = uids.map(u => u.trim()).filter(Boolean)
  for (let i = 0; i < 4; i++) params.set(`uid${i + 1}`, filled[i] || '')
  params.set('emote_id', emoteId)
  return `${API_BASE}?${params.toString()}`
}

const RARE_RANK = { GOLD: 0, RED: 1, PINK: 2, PURPLE: 3, BLUE: 4, GREEN: 5 }
const RARE_LABEL = { GOLD: 'Legendary', RED: 'Epic+', PINK: 'Epic', PURPLE: 'Rare+', BLUE: 'Rare', GREEN: 'Common' }

export default function App() {
  const [tc, setTc] = useState('')
  const [uids, setUids] = useState(['', '', '', ''])
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')
  const [rareFilter, setRareFilter] = useState('ALL')
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)
  const [sentSet, setSentSet] = useState(new Set())
  const searchRef = useRef(null)

  const selectedEmote = EMOTES.find(e => e.id === selected) || null

  const filtered = useMemo(() => {
    let list = EMOTES
    if (rareFilter !== 'ALL') list = list.filter(e => e.rare === rareFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(e => e.name.toLowerCase().includes(q) || String(e.id).includes(q))
    }
    return list
  }, [search, rareFilter])

  function updateUid(i, val) {
    setUids(prev => { const n = [...prev]; n[i] = val; return n })
  }

  async function handleSend() {
    if (!tc.trim()) { setStatus({ type: 'error', msg: 'Enter a team code.' }); return }
    if (!selected) { setStatus({ type: 'error', msg: 'Select an emote first.' }); return }
    if (!uids.some(u => u.trim())) { setStatus({ type: 'error', msg: 'Enter at least one player UID.' }); return }
    setSending(true)
    setStatus({ type: 'loading', msg: 'Sending…' })
    try {
      const res = await fetch(buildUrl(tc, uids, selected))
      const data = await res.json()
      if (data.status === 'success') {
        setSentSet(prev => new Set([...prev, selected]))
        setStatus({ type: 'success', msg: `Sent to ${data.uids.join(', ')}` })
      } else {
        setStatus({ type: 'error', msg: data.message || 'API error.' })
      }
    } catch {
      setStatus({ type: 'error', msg: 'Network error — check your connection.' })
    } finally {
      setSending(false)
    }
  }

  // clear status when inputs change
  useEffect(() => { setStatus(null) }, [tc, uids, selected])

  const filledUids = uids.filter(u => u.trim())

  return (
    <div className="app">
      {/* ── Nav ── */}
      <nav className="nav">
        <div className="nav-brand">
          <span className="nav-icon">⚡</span>
          <span className="nav-title">emote sender</span>
          <span className="nav-badge">FREE FIRE</span>
        </div>
        <div className="nav-status">
          <span className="status-dot" />
          RELAY READY
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-inner">
          <p className="hero-eyebrow">— GROUP ACTION, SIMPLIFIED</p>
          <h1 className="hero-h1">
            One emote.<br />
            <span className="hero-accent">Everyone in.</span>
          </h1>
          <p className="hero-sub">
            Pick a celebration from the catalog, set your squad target,<br />
            and send it through in one focused pass.
          </p>
        </div>
        <div className="hero-callout">
          <p className="callout-title">Built for the moment<br />before the match starts.</p>
          <p className="callout-body">No accounts. No extra steps.<br />Just the selected emote and its target group.</p>
        </div>
      </section>

      {/* ── Main panels ── */}
      <div className="panels">

        {/* ── Left: Configure ── */}
        <div className="panel panel-left">
          <div className="panel-header">
            <span className="panel-step">01 / CONFIGURE</span>
            <span className="panel-count">{EMOTES.length} emotes</span>
          </div>
          <h2 className="panel-title">Set the send</h2>

          {/* Team code */}
          <div className="field-group">
            <div className="field-row">
              <label className="field-label">Team code</label>
              <span className="field-req">required</span>
            </div>
            <div className="input-prefix-wrap">
              <span className="input-prefix">#</span>
              <input
                className="input-field"
                type="text"
                placeholder="Enter the room code"
                value={tc}
                onChange={e => setTc(e.target.value)}
              />
            </div>
          </div>

          {/* Emote picker */}
          <div className="field-group">
            <div className="field-row">
              <label className="field-label">Choose an emote</label>
              <span className="field-hint">tap to select one</span>
            </div>

            {/* Search + filters */}
            <div className="emote-toolbar">
              <input
                ref={searchRef}
                className="search-field"
                type="text"
                placeholder="Search emotes…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="rare-chips">
                {['ALL','GREEN','BLUE','PURPLE','PINK','RED','GOLD'].map(r => (
                  <button
                    key={r}
                    className={`chip chip-${r.toLowerCase()}${rareFilter === r ? ' active' : ''}`}
                    onClick={() => setRareFilter(r)}
                  >
                    {r === 'ALL' ? 'All' : RARE_LABEL[r]}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="emote-grid">
              {filtered.map(emote => (
                <button
                  key={emote.id}
                  className={[
                    'emote-card',
                    `rare-${emote.rare.toLowerCase()}`,
                    selected === emote.id ? 'selected' : '',
                    sentSet.has(emote.id) ? 'sent' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => setSelected(emote.id === selected ? null : emote.id)}
                  title={emote.name}
                >
                  {selected === emote.id && <span className="card-check">✓</span>}
                  <img
                    className="emote-img"
                    src={emote.img}
                    alt={emote.name}
                    loading="lazy"
                    onError={e => { e.target.style.opacity = '0.2' }}
                  />
                  <span className="emote-name">{emote.name}</span>
                  <span className="emote-id">{emote.id}</span>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="emote-empty">No emotes match your search.</div>
              )}
            </div>
          </div>

          {/* Players */}
          <div className="field-group">
            <div className="field-row">
              <label className="field-label">Players</label>
              <span className="field-hint">one required · three optional</span>
            </div>
            <div className="uid-grid">
              {uids.map((val, i) => (
                <div key={i} className="uid-wrap">
                  <span className="uid-num">{i + 1}</span>
                  <input
                    className={`input-field uid-input${i === 0 ? ' uid-required' : ''}`}
                    type="text"
                    placeholder={i === 0 ? 'Required UID' : `Optional UID ${i + 1}`}
                    value={val}
                    onChange={e => updateUid(i, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: Review ── */}
        <div className="panel panel-right">
          <div className="panel-header">
            <span className="panel-step light">02 / REVIEW</span>
            <span className="shield-icon">🛡</span>
          </div>
          <h2 className="panel-title light">Current target</h2>

          {/* Selected emote preview */}
          <div className="preview-card">
            {selectedEmote ? (
              <>
                <div className="preview-img-wrap">
                  <img src={selectedEmote.img} alt={selectedEmote.name} className="preview-img" />
                </div>
                <div className="preview-info">
                  <span className="preview-eyebrow">SELECTED EMOTE</span>
                  <p className="preview-name">{selectedEmote.name}</p>
                  <p className="preview-meta">
                    FF catalog &nbsp;/&nbsp; {selectedEmote.id}
                  </p>
                </div>
              </>
            ) : (
              <div className="preview-empty">
                <span className="preview-empty-icon">⚡</span>
                <p>No emote selected</p>
              </div>
            )}
          </div>

          {/* Live summary */}
          <div className="summary-block">
            <div className="summary-header">
              <span>GROUP DETAILS</span>
              <span>LIVE PREVIEW</span>
            </div>
            <div className="summary-row">
              <div className="summary-label">
                <span className="summary-icon">#</span>
                <span>Team code</span>
              </div>
              <span className={`summary-val${!tc.trim() ? ' dim' : ''}`}>
                {tc.trim() || 'not set'}
              </span>
            </div>
            <div className="summary-row">
              <div className="summary-label">
                <span className="summary-icon">👤</span>
                <span>Required UID</span>
              </div>
              <span className={`summary-val${!uids[0].trim() ? ' dim' : ''}`}>
                {uids[0].trim() || 'not set'}
              </span>
            </div>
            <div className="summary-row">
              <div className="summary-label">
                <span className="summary-icon">👥</span>
                <span>Optional UIDs</span>
              </div>
              <span className={`summary-val${filledUids.length <= 1 ? ' dim' : ''}`}>
                {filledUids.length > 1 ? filledUids.slice(1).join(', ') : 'none'}
              </span>
            </div>
            <div className="summary-row">
              <div className="summary-label">
                <span className="summary-icon">⚡</span>
                <span>Emote</span>
              </div>
              <span className={`summary-val${!selectedEmote ? ' dim' : ''}`}>
                {selectedEmote ? selectedEmote.name : 'not selected'}
              </span>
            </div>
          </div>

          {/* Status */}
          {status && (
            <div className={`status-msg status-${status.type}`}>
              {status.type === 'loading' && <span className="spin" />}
              {status.type === 'success' && '✓ '}
              {status.type === 'error' && '✗ '}
              {status.msg}
            </div>
          )}

          {/* Send button */}
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={sending}
          >
            {sending ? 'Sending…' : 'Send Emote →'}
          </button>

          <p className="disclaimer">
            Sends to all filled UIDs in a single request.
          </p>
        </div>
      </div>

      <footer className="footer">
        <span>Emote Sender · Free Fire Utility</span>
        <span>Data via ff-item.netlify.app</span>
      </footer>
    </div>
  )
}
