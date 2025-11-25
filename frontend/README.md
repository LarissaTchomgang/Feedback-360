# FeedBack360 — Documentation

Application complète de collecte d’avis composée :

- d’un **frontend** : React + Vite + TypeScript  
- d’un **backend** : FastAPI (Python) via Passenger (o2switch)  
- d’un **proxy PHP** utilisé pour contourner le WAF Tiger Protect / Imunify360 sur hébergement mutualisé

---

# ⚙️ 1. Architecture générale

## Frontend  
- Framework : **React + Vite + TypeScript**  
- Hébergé sur : `https://feedback.dt-verse.com`  
- Build dans `dist/`, servi par Apache  
- Accès API direct **ou** via proxy PHP `/api/proxy.php`

## Backend  
- Framework : **FastAPI**  
- Hébergé via Passenger sur : `https://api.dt-verse.com`  
- Point d’entrée : `passenger_wsgi.py`  
- Endpoints :
  - `GET /feedbacks/`
  - `POST /feedbacks/`
  - `DELETE /feedbacks/{id}`

## Proxy PHP  
Utilisé lorsque le WAF empêche les requêtes front → backend.

Appels du frontend :
```
/api/proxy.php?path=/feedbacks/
```

---

# 🧩 2. Installation locale (développement)

## Prérequis
- Node.js ≥ 18  
- Python ≥ 3.10  
- pip + virtualenv  

---

## Backend — Lancement local

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

uvicorn app.main:app --reload --port 8000
```

L’API sera disponible sur :  
➡️ http://127.0.0.1:8000

---

## Frontend — Lancement local

```bash
cd frontend
npm install

echo "VITE_API_URL=http://localhost:8000" > .env

npm run dev
```

Application :  
➡️ http://localhost:5173

---

# 🔧 3. Variables d’environnement

### Frontend : VITE_API_URL

| Valeur | Comportement |
|--------|--------------|
| vide | utilise `/api/proxy.php?path=...` (proxy PHP) |
| URL absolue (ex: https://api.dt-verse.com) | appel direct à l’API |

---

# 🚀 4. Déploiement sur o2switch

## Backend — Passenger (api.dt-verse.com)

1. cPanel → Setup Python App  
2. Créer l’app Python  
3. Chemin : `/home/.../fastapi-feedback360`  
4. Installer dépendances :
   ```bash
   pip install -r requirements.txt
   ```
5. Passenger doit lire `passenger_wsgi.py`

Exemple .htaccess backend :
```
PassengerAppRoot "/home/USER/fastapi-feedback360"
PassengerBaseURI "/"
PassengerPython "/home/USER/virtualenv/fastapi-feedback360/3.12/bin/python"
```

Tester :
```bash
curl -i https://api.dt-verse.com/feedbacks/
```

---

## Frontend — Apache (feedback.dt-verse.com)

1. Build :
   ```bash
   npm run build
   ```
2. Déployer dist/ sur le serveur

Arborescence :
```
feedback.dt-verse.com/
  ├─ index.html
  ├─ assets/
  └─ api/
      └─ proxy.php
```

### .htaccess (SPA + exclusion du proxy)
```apache
AcceptPathInfo On
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

  RewriteRule ^api/ - [L]

  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

# 🔁 5. Proxy PHP

Appels :
```
GET     /api/proxy.php?path=/feedbacks/
POST    /api/proxy.php?path=/feedbacks/
DELETE  /api/proxy.php?path=/feedbacks/<id>
```

---

# 📡 6. Endpoints API

## GET /feedbacks/
Liste des feedbacks.

## POST /feedbacks/
Exemple :
```json
{
  "category": "Formation React",
  "comment": "Super",
  "rating": 5,
  "author": "Alice",
  "email": "alice@example.com"
}
```

## DELETE /feedbacks/{id}

---

# 🛠️ 7. Dépannage

### “0 feedbacks” dans le frontend ?
- Ouvrir DevTools → Network  
- Vérifier l’URL, le status, le Content-Type

Si la réponse commence par `<!doctype html>` → rewrite ou WAF.

### Tester backend :
```bash
curl -i https://api.dt-verse.com/feedbacks/
```

### Tester proxy :
```bash
curl -i https://feedback.dt-verse.com/api/proxy.php?path=/feedbacks/
```

---

# 📂 8. Structure recommandée

```
repo-root/
├─ frontend/
│  ├─ src/
│  ├─ public/
│  ├─ dist/
│  ├─ package.json
│  └─ .env
│
├─ backend/
│  ├─ app/
│  ├─ passenger_wsgi.py
│  ├─ requirements.txt
│  └─ venv/
│
└─ README.md
```

---

# 🙌 Fin de la documentation