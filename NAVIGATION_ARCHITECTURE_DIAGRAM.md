# Navigation Architecture - Visual Comparison

## armoracpo (CPO App) - React Router Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ index.tsx                                                    │
│                                                              │
│  ReactDOM.render(                                            │
│    <BrowserRouter>          ← React Router wrapper          │
│      <App />                                                 │
│    </BrowserRouter>                                          │
│  )                                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ App.tsx (BEFORE FIX - BROKEN)                                │
│                                                              │
│  if (showSplash) {                                           │
│    return <Splash />;  ← OUTSIDE Router! ❌                 │
│  }                                                           │
│                                                              │
│  return (                                                    │
│    <Router>                                                  │
│      <Routes>                                                │
│        <Route path="/" element={<Dashboard />} />           │
│        <Route path="/login" element={<Login />} />          │
│      </Routes>                                               │
│    </Router>                                                 │
│  );                                                          │
│                                                              │
│  ❌ Error: useNavigate() may be used only in the context    │
│            of a <Router> component                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ App.tsx (AFTER FIX - WORKING) ✅                             │
│                                                              │
│  return (                                                    │
│    <Router>              ← Wraps EVERYTHING now             │
│      {showSplash ? (                                         │
│        <Splash />        ← INSIDE Router! ✅                │
│      ) : (                                                   │
│        <Routes>                                              │
│          <Route path="/" element={<Dashboard />} />         │
│          <Route path="/login" element={<Login />} />        │
│        </Routes>                                             │
│      )}                                                      │
│    </Router>                                                 │
│  );                                                          │
│                                                              │
│  ✅ All components can now use useNavigate()                │
└─────────────────────────────────────────────────────────────┘

## Components use React Router hooks:
┌─────────────────────────────────────────────┐
│ Component.tsx                               │
│                                             │
│  import { useNavigate } from 'react-router' │
│  const navigate = useNavigate();            │
│  navigate('/dashboard');                    │
└─────────────────────────────────────────────┘
```

---

## armora (Client App) - Custom View-Based Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ index.tsx                                                    │
│                                                              │
│  ReactDOM.render(                                            │
│    <StrictMode>                                              │
│      <App />             ← NO Router wrapper needed          │
│    </StrictMode>                                             │
│  )                                                           │
│                                                              │
│  ✅ No React Router - different approach                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ App.tsx                                                      │
│                                                              │
│  function App() {                                            │
│    return (                                                  │
│      <AuthProvider>                                          │
│        <AppProvider>         ← Custom state management       │
│          <ProtectionAssignmentProvider>                      │
│            <AppRouter />     ← Custom router component       │
│          </ProtectionAssignmentProvider>                     │
│        </AppProvider>                                        │
│      </AuthProvider>                                         │
│    );                                                        │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ AppRouter Component (in App.tsx)                             │
│                                                              │
│  function AppRouter() {                                      │
│    const { state } = useApp();    ← Custom hook             │
│    const { currentView } = state;  ← State-based view       │
│                                                              │
│    const renderCurrentView = () => {                        │
│      switch (currentView) {       ← Simple switch/case      │
│        case 'splash':                                        │
│          return <SplashScreen />;                            │
│        case 'welcome':                                       │
│          return <WelcomePage />;                             │
│        case 'login':                                         │
│          return <LoginForm />;                               │
│        case 'home':                                          │
│          return <Dashboard />;                               │
│        // ... 20+ more views                                 │
│      }                                                       │
│    };                                                        │
│                                                              │
│    return <div>{renderCurrentView()}</div>;                 │
│  }                                                           │
│                                                              │
│  ✅ No Router needed - pure React state                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ AppContext.tsx - Custom Navigation System                    │
│                                                              │
│  interface AppState {                                        │
│    currentView: ViewState;  ← 'splash' | 'welcome' | ...    │
│    user: User | null;                                        │
│    // ... other state                                        │
│  }                                                           │
│                                                              │
│  const navigateToView = (view: ViewState) => {              │
│    dispatch({ type: 'SET_VIEW', payload: view });           │
│    window.location.hash = view;  ← Optional hash sync       │
│  };                                                          │
│                                                              │
│  return (                                                    │
│    <AppContext.Provider value={{                             │
│      state,                                                  │
│      navigateToView,      ← Custom navigation function      │
│      // ... other methods                                    │
│    }}>                                                       │
│      {children}                                              │
│    </AppContext.Provider>                                    │
│  );                                                          │
└─────────────────────────────────────────────────────────────┘

## Components use custom navigation hook:
┌─────────────────────────────────────────────┐
│ Component.tsx                               │
│                                             │
│  import { useApp } from '../contexts/App'   │
│  const { navigateToView } = useApp();       │
│  navigateToView('home');                    │
│                                             │
│  ✅ Simple, type-safe, no Router needed     │
└─────────────────────────────────────────────┘
```

---

## Navigation Flow Comparison

### armoracpo (React Router)
```
User clicks button
    ↓
Component calls: navigate('/dashboard')
    ↓
React Router matches route
    ↓
Updates browser history
    ↓
Renders matched component
    ↓
URL changes: https://app.com/dashboard
```

### armora (Custom View State)
```
User clicks button
    ↓
Component calls: navigateToView('home')
    ↓
Dispatches Redux-style action: SET_VIEW
    ↓
Updates state.currentView = 'home'
    ↓
AppRouter switch/case renders <Dashboard />
    ↓
Optional: Hash updates: https://app.com/#home
```

---

## Key Differences

| Aspect | armoracpo (Router) | armora (Custom) |
|--------|-------------------|-----------------|
| **Library** | react-router-dom | None (built-in) |
| **Routing** | URL-based paths | State-based views |
| **Navigation** | `useNavigate()` hook | `navigateToView()` function |
| **Components** | `<Router>`, `<Routes>`, `<Route>` | None needed |
| **State** | Router's internal state | AppContext reducer |
| **URLs** | Full paths (/dashboard) | Optional hashes (#home) |
| **History** | Browser history API | State management |
| **Type Safety** | String paths | Enum ViewState type |
| **Bundle Size** | +35KB (react-router) | 0KB (built-in) |
| **Complexity** | Higher (routing library) | Lower (pure React) |
| **Testing** | Mock router context | Mock state provider |
| **Guards** | Route guards/middleware | State checks in navigateToView |

---

## Why armora Uses Custom Navigation

### ✅ Advantages
1. **Simpler** - No routing library dependency
2. **Smaller Bundle** - No react-router-dom (~35KB saved)
3. **Type-Safe** - ViewState is a TypeScript enum
4. **Predictable** - Simple state transitions
5. **Testable** - Easy to mock AppContext
6. **Controlled** - Full control over navigation logic
7. **PWA-Friendly** - Better for mobile app patterns
8. **Centralized** - All navigation logic in one place

### ⚠️ Trade-offs
1. No deep linking with paths (uses hash instead)
2. No browser back/forward integration (can be added)
3. Custom implementation vs standard library
4. Need to maintain custom code

### ✅ Perfect For
- ✅ Mobile-first PWAs
- ✅ Single-page apps with wizard flows
- ✅ Apps with complex state-based navigation
- ✅ When bundle size matters
- ✅ When type safety is critical

### ❌ Not Ideal For
- ❌ Large multi-page websites
- ❌ SEO-critical applications
- ❌ Complex nested routing needs
- ❌ Team unfamiliar with pattern

---

## Conclusion

**armoracpo**: Needs React Router fix because it uses React Router
**armora**: Doesn't need any Router fix because it doesn't use React Router

Both approaches are valid - they're just solving different problems with different tools.

The Armora client app's custom navigation is **intentional, well-designed, and working perfectly** for its PWA mobile-first architecture.

---

**No changes needed. Issue does not apply.**
