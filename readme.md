# NeuraLOL Project Setup

Welcome! Make sure you have the **Slush web extension/plugin** installed to fully utilize our demo.

Check out our demo website here:
[Demo Website](https://preyouthful-unescutcheoned-jayce.ngrok-free.dev)

Follow the steps below to set up and run the NeuraLOL project on your system.

---

## MacOS Setup

1. **Install Homebrew** (if you don’t have it):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Install Node.js**:

```bash
brew install node
```

3. **Clone the repository**:

```bash
git clone https://github.com/Sui-Romanian-Hackathon/NeuraLOL.git
```

4. **Open two terminals and navigate to the project directories**:

* **Terminal 1 – Backend**

  ```bash
  cd NeuraLOL/backend
  npm install
  npm start
  ```

* **Terminal 2 – Frontend**

  ```bash
  cd NeuraLOL/my-trash-app
  npm install
  npm start
  ```

---

## Windows Setup

1. **Install Node.js** via PowerShell:

```powershell
winget install OpenJS.NodeJS
```

2. **Clone the repository**:

```powershell
git clone https://github.com/Sui-Romanian-Hackathon/NeuraLOL.git
```

3. **Open two terminals and navigate to the project directories**:

* **Terminal 1 – Backend**

  ```powershell
  cd NeuraLOL\backend
  npm install
  npm start
  ```

* **Terminal 2 – Frontend**

  ```powershell
  cd NeuraLOL\my-trash-app
  npm install
  npm start
  ```

---

## Troubleshooting

**1. `npm install` fails**

* Ensure Node.js is installed correctly by running `node -v` and `npm -v`.
* Delete `node_modules` and `package-lock.json`, then reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

**2. Port already in use**

* Stop the process using the port or choose a different one.
* On MacOS/Linux:

```bash
lsof -i :<port>
kill -9 <pid>
```

**3. Environment variables missing**

* Ensure a `.env` file exists in `backend` with:

  * `SUI_RPC_URL`
  * `NEURALOL_PACKAGE_ID`
  * `NEURALOL_TREASURY_CAP_ID`
  * `PUBLISHER_PRIVATE_KEY`

**4. Node version mismatch**

* Node.js **v24+** is required. Older versions may cause ESM or module errors.

**5. Frontend not connecting to backend**

* Make sure both backend and frontend are running in separate terminals.
* Verify the frontend points to the correct backend URL (usually `http://localhost:3000`).

---

## Summary

* Run backend and frontend in separate terminals.
* Node.js v24+ is required.
* Use `npm install` to restore dependencies; `package-lock.json` ensures consistent versions.
* `.gitignore` prevents committing `node_modules` and sensitive `.env` files.
* Visit the [demo website](https://preyouthful-unescutcheoned-jayce.ngrok-free.dev) with the Slush plugin for a live preview.
