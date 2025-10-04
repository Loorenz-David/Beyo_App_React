# Inventory CRM – Frontend (React + TypeScript)

This is the frontend of the Inventory CRM system built for internal company use.  
It allows users to manage inventory, deliveries, and warehouse items through a responsive, mobile-friendly interface.

---

## 🚀 Features
- Add and edit inventory items
- Upload multiple images to AWS S3
- Generate and print QR code labels
- Scan barcodes and QR codes
- Offline support (PWA)
- Real-time form validation and smooth UI

---

## 🧰 Tech Stack
- **React** (TypeScript)
- **Vite / Create React App** (depending on your setup)
- **Axios / Fetch API** for backend communication
- **AWS S3** for image storage

---

## Screenshots

## LoginPage
![LoginPage](assets/screenshots/LoginPage.jpg)

## Main Inventory Page
![Main Inventory Page](assets/screenshots/MainInvPage.jpg)

## Add Item Form
![Add Item Form](assets/screenshots/AddItemPage.jpg)
## Add Item Popups
![Add Item Popups](assets/screenshots/AddItemPopup.jpg)

## Scann Page
![Scann Page](assets/screenshots/ScannerPage.jpg)

## Filter Page
![Filter Page](assets/screenshots/FilterPage.jpg)

## ⚙️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/Loorenz-David/Beyo_App_React

# Navigate to the project folder
cd inventory-crm-frontend

# Install dependencies
npm install

# Start development server
npm run dev

---
## Backend Connection

```markdown
# The frontend communicates with the Flask backend API.
# Make sure the backend is running and update the API base URL in your environment file:

# Flask API repository:
 https://github.com/Loorenz-David/Beyo_App_Flask


 You will need to add the Back end ip to the viteconfig.ts file:  
 config.server = {
      host:true,
      proxy:{
        '/api':{
          target:'https://127.0.0.1:5001',
          changeOrigin:true,
          secure:false}
      }

    }


