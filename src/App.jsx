import { useState, useMemo } from 'react'

const API_BASE = 'http://37.27.54.248:26712/join'

const EMOTES = [
  { id: 0,   name: 'Wave',         icon: '👋', cat: 'Greetings' },
  { id: 1,   name: 'Dance',        icon: '💃', cat: 'Dance' },
  { id: 2,   name: 'Clap',         icon: '👏', cat: 'Reactions' },
  { id: 3,   name: 'Thumbs Up',    icon: '👍', cat: 'Reactions' },
  { id: 4,   name: 'Heart',        icon: '❤️',  cat: 'Love' },
  { id: 5,   name: 'Flex',         icon: '💪', cat: 'Victory' },
  { id: 6,   name: 'Spin',         icon: '🌀', cat: 'Dance' },
  { id: 7,   name: 'Jump',         icon: '🦘', cat: 'Dance' },
  { id: 8,   name: 'Point',        icon: '☝️',  cat: 'Reactions' },
  { id: 9,   name: 'Bow',          icon: '🙇', cat: 'Greetings' },
  { id: 10,  name: 'Laugh',        icon: '😂', cat: 'Reactions' },
  { id: 11,  name: 'Salute',       icon: '🫡', cat: 'Greetings' },
  { id: 12,  name: 'Peace',        icon: '✌️',  cat: 'Greetings' },
  { id: 13,  name: 'Facepalm',     icon: '🤦', cat: 'Reactions' },
  { id: 14,  name: 'Shrug',        icon: '🤷', cat: 'Reactions' },
  { id: 15,  name: 'Robot',        icon: '🤖', cat: 'Dance' },
  { id: 16,  name: 'Kiss',         icon: '😘', cat: 'Love' },
  { id: 17,  name: 'Sunglasses',   icon: '😎', cat: 'Victory' },
  { id: 18,  name: 'Cry',          icon: '😭', cat: 'Reactions' },
  { id: 19,  name: 'Disco',        icon: '🕺', cat: 'Dance' },
  { id: 20,  name: 'Dab',          icon: '🤙', cat: 'Dance' },
  { id: 21,  name: 'Floss',        icon: '🎶', cat: 'Dance' },
  { id: 22,  name: 'Crown',        icon: '👑', cat: 'Victory' },
  { id: 23,  name: 'Fire',         icon: '🔥', cat: 'Victory' },
  { id: 24,  name: 'Star',         icon: '⭐', cat: 'Victory' },
  { id: 25,  name: 'Confused',     icon: '😵', cat: 'Reactions' },
  { id: 26,  name: 'Shock',        icon: '😱', cat: 'Reactions' },
  { id: 27,  name: 'Wink',         icon: '😉', cat: 'Love' },
  { id: 28,  name: 'Cool',         icon: '🤟', cat: 'Greetings' },
  { id: 29,  name: 'Sick Moves',   icon: '🎸', cat: 'Dance' },
  { id: 30,  name: 'Pout',         icon: '😤', cat: 'Reactions' },
  { id: 31,  name: 'Moonwalk',     icon: '🌙', cat: 'Dance' },
  { id: 32,  name: 'Sneeze',       icon: '🤧', cat: 'Reactions' },
  { id: 33,  name: 'Zombie',       icon: '🧟', cat: 'Dance' },
  { id: 34,  name: 'Meditate',     icon: '🧘', cat: 'Dance' },
  { id: 35,  name: 'Butterfly',    icon: '🦋', cat: 'Dance' },
  { id: 36,  name: 'Hug',          icon: '🤗', cat: 'Love' },
  { id: 37,  name: 'OK',           icon: '🆗', cat: 'Reactions' },
  { id: 38,  name: 'Trophy',       icon: '🏆', cat: 'Victory' },
  { id: 39,  name: 'Sparkle',      icon: '✨', cat: 'Victory' },
  { id: 40,  name: 'Penguin',      icon: '🐧', cat: 'Dance' },
  { id: 41,  name: 'Cowboy',       icon: '🤠', cat: 'Dance' },
  { id: 42,  name: 'Ghost',        icon: '👻', cat: 'Dance' },
  { id: 43,  name: 'Ninja',        icon: '🥷', cat: 'Dance' },
  { id: 44,  name: 'Alien',        icon: '👽', cat: 'Dance' },
  { id: 45,  name: 'Magic',        icon: '🪄', cat: 'Dance' },
  { id: 46,  name: 'Rocket',       icon: '🚀', cat: 'Victory' },
  { id: 47,  name: 'Diamond',      icon: '💎', cat: 'Victory' },
  { id: 48,  name: 'Party',        icon: '🥳', cat: 'Greetings' },
  { id: 49,  name: 'Bye',          icon: '🫶', cat: 'Greetings' },
]

const CATEGORIES = ['All', ...Array.from(new Set(EMOTES.map(e => e.cat)))]

function buildUrl(tc, uids, emoteId) {
  const params = new URLSearchParams({ tc: tc.trim() })
  const filled = uids.filter(u => u.trim())
  filled.forEach((uid, i) => params.set(`uid${i + 1}`, uid.trim()))
  for (let i = filled.length + 1; i <= 4; i++) params.set(`uid${i}`, '')
  params.set('emote_id', emoteId)
  return `${API_BASE}?${params.toString()}`
}

export default function App() {
  const [teamCode, setTeamCode] = useState('')
  const [uids, setUids] = useState(['', '', '', ''])
  const [selected, setSelected] = useState(null)
  const [status, setStatus] = useState(null)   // { type: 'success'|'error'|'loading', msg }
  const [sentIds, setSentIds] = useState(new Set())
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const hasUid = uids.some(u => u.trim())
  const hasTeamCode = teamCode.trim() !== ''

  const filtered = useMemo(() => {
    return EMOTES.filter(e => {
      const matchCat = category === 'All' || e.cat === category
      const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || String(e.id).includes(search)
      return matchCat && matchSearch
    })
  }, [search, category])

  async function sendEmote(emoteId) {
    if (!hasTeamCode) {
      setStatus({ type: 'error', msg: 'Please enter a Team Code before sending.' })
      return
    }
    if (!hasUid) {
      setStatus({ type: 'error', msg: 'Please enter at least one Player UID before sending.' })
      return
    }
    setStatus({ type: 'loading', msg: `Sending emote #${emoteId}…` })
    try {
      const url = buildUrl(teamCode, uids, emoteId)
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === 'success') {
        setSentIds(prev => new Set([...prev, emoteId]))
        setStatus({ type: 'success', msg: `Emote #${emoteId} sent to ${data.uids.join(', ')} ✓` })
      } else {
        setStatus({ type: 'error', msg: data.message || 'API returned an error.' })
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network error — could not reach the API.' })
    }
  }

  function updateUid(i, val) {
    setUids(prev => { const next = [...prev]; next[i] = val; return next })
  }

  return (
    <>
      <header>
        <div className="header-ornament">Emote Sender</div>
        <h1>Send Your Emote</h1>
        <p className="subtitle">Select players &amp; choose your emote</p>
      </header>

      <div className="wrapper">
        {/* ── UIDs ── */}
        <div className="uid-panel">
          <p className="section-label">Session Details</p>

          <div className="tc-row">
            <div className="uid-field tc-field">
              <label>Team Code</label>
              <input
                type="text"
                placeholder="Enter team code (required)"
                value={teamCode}
                onChange={e => setTeamCode(e.target.value)}
              />
            </div>
          </div>

          <div className="uid-divider" />

          <p className="uid-sub-label">Player UIDs</p>
          <div className="uid-grid">
            {uids.map((val, i) => (
              <div className="uid-field" key={i}>
                <label>Player {i + 1}</label>
                <input
                  type="text"
                  placeholder={`UID ${i + 1}${i === 0 ? ' (required)' : ' (optional)'}`}
                  value={val}
                  onChange={e => updateUid(i, e.target.value)}
                />
              </div>
            ))}
          </div>

          {status && (
            <div className={`status-banner ${status.type}`}>
              {status.type === 'loading' && <span className="spinner" />}
              {status.type === 'success' && <span className="checkmark">✓</span>}
              {status.type === 'error' && <span>✗</span>}
              <span>{status.msg}</span>
            </div>
          )}
        </div>

        {/* ── Emote grid ── */}
        <div className="emote-section">
          <p className="section-label">Emotes</p>

          <div className="search-row">
            <input
              className="search-input"
              type="text"
              placeholder="Search emotes…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="filter-chips">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`chip${category === cat ? ' active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="emote-grid">
            {filtered.map(emote => (
              <div
                key={emote.id}
                className={[
                  'emote-card',
                  selected === emote.id ? 'selected' : '',
                  sentIds.has(emote.id) ? 'sent' : '',
                  status?.type === 'loading' && selected === emote.id ? 'sending' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => setSelected(emote.id === selected ? null : emote.id)}
              >
                <span className="emote-icon">{emote.icon}</span>
                <div className="emote-name">{emote.name}</div>
                <div className="emote-id">ID · {emote.id}</div>
                <button
                  className="send-btn"
                  onClick={e => { e.stopPropagation(); sendEmote(emote.id) }}
                >
                  {status?.type === 'loading' && selected === emote.id
                    ? 'Sending…'
                    : sentIds.has(emote.id) ? 'Send Again' : 'Send'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer>
        &copy; {new Date().getFullYear()} &nbsp;·&nbsp; Emote Sender &nbsp;·&nbsp; All rights reserved
      </footer>
    </>
  )
}
