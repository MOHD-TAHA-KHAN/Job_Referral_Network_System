import { useState } from 'react';
import { useNavigate } from 'react-router';
import AppSidebar from '../components/AppSidebar';
import '../styles/design-system.css';

const DashIcon  = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>;
const RefIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M8 1a3 3 0 1 0 0 6A3 3 0 0 0 8 1zM2 13c0-2.8 2.7-5 6-5s6 2.2 6 5H2z"/></svg>;
const MsgIcon   = () => <svg viewBox="0 0 16 16" className="sidebar-nav-icon" fill="currentColor"><path d="M2 2h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5l-3 2V3a1 1 0 0 1 1-1z"/></svg>;

const NAV = [
  { path: '/dashboard', label: 'Dashboard',   icon: <DashIcon /> },
  { path: '/referrals', label: 'My Referrals', icon: <RefIcon /> },
  { path: '/chat',      label: 'Messages',     icon: <MsgIcon />, badge: 2 },
];

const CONVERSATIONS = [
  { id: '1', name: 'Rahul Sharma',  role: 'SDE @ Google',   context: 'Re: SDE-II role',    lastMsg: "Great! I'll forward your profile today.", time: '2m ago',  unread: true  },
  { id: '2', name: 'Ananya Singh',  role: 'SDE @ Flipkart', context: 'Re: Frontend role',  lastMsg: 'Can you share your updated resume?',      time: '1h ago',  unread: false },
  { id: '3', name: 'Vikram Nair',   role: 'SDE @ Google',   context: 'Re: SDE-II role',    lastMsg: "I've submitted your profile. All the best!", time: '3d ago', unread: false },
];

const MESSAGES: Record<string, { id: string; text: string; sender: 'them' | 'me'; time: string }[]> = {
  '1': [
    { id: 'm1', text: "Hi Priya! I reviewed your profile and resume. Your background in DSA and system design is quite strong.", sender: 'them', time: '11:42 AM' },
    { id: 'm2', text: "Thank you so much Rahul! I've worked on a few distributed systems projects during my final year. Would really appreciate the referral.", sender: 'me', time: '11:44 AM' },
    { id: 'm3', text: "Great! I'll forward your profile today. All the best!", sender: 'them', time: '2:18 PM' },
  ],
  '2': [
    { id: 'm1', text: 'Hi! Can you share your updated resume?', sender: 'them', time: '10:00 AM' },
  ],
  '3': [
    { id: 'm1', text: "I've submitted your profile. All the best!", sender: 'them', time: 'Mon' },
  ],
};

const Chat = () => {
  const [activeId, setActiveId] = useState('1');
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState(MESSAGES);
  const [search, setSearch] = useState('');

  const active = CONVERSATIONS.find(c => c.id === activeId)!;
  const currentMsgs = msgs[activeId] ?? [];

  const sendMsg = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now().toString(), text: input.trim(), sender: 'me' as const, time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
    setMsgs(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), newMsg] }));
    setInput('');
  };

  const filtered = CONVERSATIONS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.context.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <AppSidebar items={NAV} />

      <div className="app-main" style={{ flexDirection: 'row', overflow: 'hidden' }}>
        {/* Conversation list */}
        <div style={{ width: 280, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: '#fff', flexShrink: 0 }}>
          <div style={{ padding: '16px 14px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700 }}>Messages</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f5f7ff', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 12px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>🔍</span>
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', background: 'none', outline: 'none', fontSize: 13, flex: 1, fontFamily: 'var(--font)' }}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px',
                  borderBottom: '1px solid var(--border)', cursor: 'pointer',
                  background: activeId === conv.id ? '#f0f4ff' : '#fff',
                  borderLeft: activeId === conv.id ? '3px solid var(--accent)' : '3px solid transparent',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#4f6ef7', flexShrink: 0 }}>
                  {conv.name[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>{conv.name}</p>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{conv.time}</span>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.lastMsg}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{conv.role} · {conv.context}</p>
                </div>
                {conv.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', marginTop: 6, flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#f8f9fc' }}>
          {/* Chat header */}
          <div style={{ padding: '14px 20px', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#4f6ef7' }}>
                {active.name[0]}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>{active.name}</p>
                <p style={{ margin: 0, fontSize: 12, color: '#10b981' }}>{active.role} · Active now</p>
              </div>
            </div>
            <span style={{ fontSize: 12, background: '#f0f4ff', color: 'var(--accent)', borderRadius: 6, padding: '4px 10px', fontWeight: 500 }}>
              {active.context}
            </span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {currentMsgs.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start', gap: 10, alignItems: 'flex-end' }}>
                {msg.sender === 'them' && (
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#4f6ef7', flexShrink: 0 }}>
                    {active.name[0]}
                  </div>
                )}
                <div style={{ maxWidth: '60%' }}>
                  <div style={{
                    padding: '12px 16px', borderRadius: msg.sender === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    background: msg.sender === 'me' ? 'var(--accent)' : '#fff',
                    color: msg.sender === 'me' ? '#fff' : 'var(--text-primary)',
                    fontSize: 14, lineHeight: 1.5,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}>
                    {msg.text}
                  </div>
                  <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '14px 20px', background: '#fff', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn btn-outline btn-sm" style={{ padding: '8px 10px' }}>📎</button>
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMsg()}
              style={{ flex: 1, border: '1px solid var(--border)', borderRadius: 24, padding: '10px 16px', fontSize: 14, outline: 'none', fontFamily: 'var(--font)', background: '#f8f9fc' }}
            />
            <button
              className="btn btn-primary"
              style={{ width: 40, height: 40, borderRadius: '50%', padding: 0, justifyContent: 'center' }}
              onClick={sendMsg}
            >
              ✈
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
