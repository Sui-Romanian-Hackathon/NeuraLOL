# NeuraLOL Project Setup

Follow the steps below to set up and run the NeuraLOL project on your system.

---

## MacOS

1. **Install Homebrew** (if you don’t have it):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Install Node.js**:

```bash
brew install node
```

3. **Clone the repository** at a desired location:

```bash
git clone https://github.com/Sui-Romanian-Hackathon/NeuraLOL.git
```

4. **Navigate to the repo** and open **two separate terminals**:  

- **Terminal 1 – Backend**  
  Navigate to `NeuraLOL/backend` and run the server:

```bash
cd NeuraLOL/backend
npm install
npm start
```

- **Terminal 2 – Frontend**  
  Navigate to `NeuraLOL/my-trash-app` and run the frontend:

```bash
cd NeuraLOL/my-trash-app
npm install
npm start
```

---

## Windows

1. **Install Node.js** via PowerShell:

```powershell
winget install OpenJS.NodeJS
```

2. **Clone the repository** at a desired location:

```powershell
git clone https://github.com/Sui-Romanian-Hackathon/NeuraLOL.git
```

3. **Navigate to the repo** and open **two separate terminals**:  

- **Terminal 1 – Backend**  

```powershell
cd NeuraLOL\backend
npm install
npm start
```

- **Terminal 2 – Frontend**  

```powershell
cd NeuraLOL\my-trash-app
npm install
npm start
```

---

## Troubleshooting

Here are common issues and solutions when setting up the project:

1. **`npm install` fails**  
   - Make sure Node.js is installed correctly. Run `node -v` and `npm -v`.  
   - Delete `node_modules` and `package-lock.json` and try again:

```bash
rm -rf node_modules package-lock.json
npm install
```

2. **Port already in use**  
   - If the server or frontend cannot start because a port is busy, either stop the process using it or change the port.  
   - On MacOS/Linux, check running processes with:

```bash
lsof -i :<port>
kill -9 <pid>
```

3. **Environment variables missing**  
   - Make sure you have a `.env` file in `backend` with all required variables (e.g., `SUI_RPC_URL`, `NEURALOL_PACKAGE_ID`, `NEURALOL_TREASURY_CAP_ID`, `PUBLISHER_PRIVATE_KEY`).  
   - Without these, the backend will throw errors.

4. **Node version mismatch**  
   - This project uses Node.js **v24+**.  
   - Using older versions may result in `ERR_MODULE_NOT_FOUND` or ESM-related errors.

5. **Frontend not connecting to backend**  
   - Ensure both frontend and backend are running in separate terminals.  
   - Check that the frontend is pointing to the correct backend URL (usually `http://localhost:3000` or as configured).

---

## Summary

- Backend and frontend run in **separate terminals**.
- Node.js v24+ is required.
- `npm install` restores dependencies; `package-lock.json` ensures consistent versions.
- `.gitignore` prevents committing `node_modules` or sensitive `.env` files.

