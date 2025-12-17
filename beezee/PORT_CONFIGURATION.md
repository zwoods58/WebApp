# 🔌 Port Configuration Guide

## Port Numbers

### Development Server (npm run dev)
- **Port:** `5173` (Vite default)
- **URL:** http://localhost:5173
- **Command:** `npm run dev`

### Preview Server (npm run preview)
- **Port:** `4173` (Vite default)
- **URL:** http://localhost:4173
- **Command:** `npm run preview` (for testing production builds)

---

## ✅ Fixed Configuration

The `vite.config.js` has been updated to:

```javascript
server: {
  port: 5173,        // Dev server port
  host: true,        // Allow external connections
  strictPort: false, // Try next port if 5173 is taken
},
preview: {
  port: 4173,        // Preview port (for production builds)
  host: true,
},
```

---

## 🚀 How to Run

### Development (Hot Reload)
```bash
npm run dev
# Opens on: http://localhost:5173
```

### Preview Production Build
```bash
npm run build
npm run preview
# Opens on: http://localhost:4173
```

---

## 🔍 Troubleshooting

### Port Already in Use?

If port 5173 is taken, Vite will automatically try the next available port (5174, 5175, etc.) and show you the URL.

### Check What's Running

```bash
# Windows PowerShell
netstat -ano | findstr :5173
netstat -ano | findstr :4173

# Kill process on port 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

---

## ✅ Verification

After running `npm run dev`, you should see:

```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

**If you see port 4173, you're running `npm run preview` instead of `npm run dev`!**

---

**Always use `npm run dev` for development (port 5173)** 🎯


