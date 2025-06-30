# Card creator

This project implements a **Card creator web app** were you can create your own card game easily with only a csv.

<img width="1470" alt="Captura de pantalla 2025-06-30 a las 20 43 03" src="https://github.com/user-attachments/assets/a401fd47-27fd-4e82-937b-88c28023af05" />

<img width="1470" alt="Captura de pantalla 2025-06-30 a las 20 43 18" src="https://github.com/user-attachments/assets/93a70bda-5692-4b64-9379-84554854fa28" />

<img width="1470" alt="Captura de pantalla 2025-06-30 a las 20 43 37" src="https://github.com/user-attachments/assets/5b69185f-8614-43ba-afff-0dc8d064c90c" />



## Project Structure

The project is organized into several folders with a modular structure to make it easy to extend and maintain:

```
CardCreator/
│
├── backend/
│ └── app/
│   ├── api/                  # API
│   │ └── v1/
│   │   ├── endpoints/        # Endpoints
│   │   │ ├── auth.py
│   │   │ ├── cards.py
│   │   │ └── users.py
│   │   │
│   │   └── api_v1.py         # Routes
│   │
│   ├── core/
│   │ ├── config.py
│   │ └── security.py
│   │
│   ├── database/             # Database
│   │ ├── base.py
│   │ └── session.py
│   │
│   ├── models/
│   │ └── user.py
│   │
│   ├── schemas/
│   │ └── user.py
│   │
│   ├── services/             # Backend services
│   │ ├── card_service.py
│   │ └── user_service.py
│   │
│   ├── utils/
│   │ └── auth.py
│   │
│   └── main.py               # The backend main script 
│
├──frontend/
│ └── src/
│   ├── components/           # Frontend custom components
│   │ ├── button/
│   │ │ └── Button.js
│   │ │
│   │ ├── cardManager/
│   │ │ └── CardManager.js
│   │ │
│   │ ├── cardPreview/
│   │ │ └── CardPreview.js
│   │ │
│   │ ├── colorPicker/
│   │ │ └── ColorPicker.js
│   │ │
│   │ ├── fileInput/
│   │ │ └── FileInput.js
│   │ │
│   │ ├── fontSelector/
│   │ │ └──FontSelector.js
│   │ │
│   │ ├── header/
│   │ │ └── Header.js
│   │ │
│   │ ├── text/
│   │ │ └── Text.js
│   │ │
│   │ └── textInput/
│   │   └── TextInput.js
│   │
│   ├── pages/                # Frontend pages
│   │ ├── CreatorPage.js
│   │ ├── HomePage.js
│   │ ├── MyCardsPage.js
│   │ └── PdfPreviewPage.js
│   │
│   ├── services/             # Frontend api service
│   │ └── apiService.js
│   │
│   ├── App.js                # Frontend app script
│   ├── index.js
│   └── default.svg           # Default card background
│
├── script/
│ ├── data/                   # Folder for CSV files
│ │   └── cards.csv           # CSV with the information of the cards 
│ │
│ ├── images/                 # Type of cards of the game
│ │   ├── card_type_1.png        
│ │   └── card_type_2.png  
│ │
│ └── main.py                 # The main script 
│
├── README.md               
└── requirements.txt        # Dependencies of the project
```

## Setup Instructions

To set up the environment and dependencies for the project, follow these steps:

### 1. Clone the Repository

First, clone this repository to your local machine:

```bash
git clone https://github.com/chave-chan/CardCreator.git
cd CardCreator
```

### 2. Create a Virtual Environment with `venv`

To manage dependencies, we will create a virtual environment using Python’s built-in tool `venv`.

#### Create the virtual environment:

Run the following command in the root of your project directory to create a new virtual environment called `env`:

```bash
python3 -m venv env
```

This will create a new folder `env/` in your project directory where the virtual environment will be stored.

#### Activate the virtual environment:

- **On Windows**:
  ```bash
  env\Scripts\activate
  ```

- **On macOS/Linux**:
  ```bash
  source env/bin/activate
  ```

When the virtual environment is activated, you’ll see `(env)` at the beginning of your terminal prompt.

### 3. Install Dependencies

With the virtual environment activated, install the project dependencies from the `requirements.txt` file:

```bash
pip install -r requirements.txt
```

If the system asks for it, upgrade pip:

```bash
pip install --upgrade pip
```

### 4. Build and Up the Docker

```bash
docker-compose build --no-cache
```

```bash
docker-compose up -d
```

### 5. Run the project localy

#### Frontend
Go to the frontend directory

```bash
npm start
```

If a 'file is missing' message appears, try:

```bash
npm install
npm start
```

#### Backend
Go to the backend directory

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 6. Deactivate the Virtual Environment

When you are done working on the project, you can deactivate the virtual environment by running:

```bash
deactivate
```

This will return your terminal to its default Python environment.
