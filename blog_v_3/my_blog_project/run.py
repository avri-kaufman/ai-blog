# run.py
from app import create_app

if __name__ == "__main__":
    app = create_app()
    # By default, runs on port 5000
    app.run()
