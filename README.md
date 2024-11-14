# Card creator

This project implements a **Card creator script** were you can create your own card game easily with only a csv.

## Project Structure

The project is organized into several folders with a modular structure to make it easy to extend and maintain:

```
CardCreator/
│
├── data/                   # Folder for your documents (not tracked on github)
│   └── cards.csv           # CSV with the information of your cards 
│
├── images/                 # Type of cards of your game
│   ├── card_type_1.png        
│   └── card_type_2.png  
│
├── main.py                 # The main script 
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

### 4. Build and Up the Docker

```bash
docker-compose build --no-cache
```

```bash
docker-compose up -d
```

### 5. Run the project localy

# Frontend
Go to the frontend directory

```bash
npm start
```

# Backend
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