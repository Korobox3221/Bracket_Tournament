

### CS50W Final project: Interactive Tournament Bracket
### Project Author: Konstantin Korobeynikov 

### **Description:**

This is a dynamic web application for creating and managing tournament brackets. Users can set up tournaments with a custom number of participants (4, 8, 16, or 32), upload participant details from a JSON file (names, images, and YouTube video URLs), and then interactively select winners for each match. The progress is saved to a Django backend, allowing users to track a tournament from the initial rounds all the way to a crowned champion.

For larger tournaments with **32 participants**, the system is uniquely designed to handle a group stage where participants are divided into four groups of eight. Winners from each group then advance to a final four-participant bracket.

-----

### **Distinctiveness and Complexity**

This project satisfies the distinctiveness and complexity requirements through several key features. The core challenge was not just to display a static bracket, but to create a **fully dynamic and interactive system**. This involved building a backend to handle tournament state, a frontend that responds to user input, and an API to connect the two.

The project’s complexity is evident in its **data management**. The Django models (`Bracket`, `Bracket_object`, `Participant_stages`, `GroupParticipant`) are interconnected to accurately track the state of each participant across multiple tournament stages. This required careful planning of database schemas and logic.

Furthermore, the **frontend implementation is sophisticated**. Instead of a single JavaScript file, the logic is modular, with separate files for each stage (`one_eight.js`, `quater_final.js`, `semi_final.js`, `final.js`). This approach demonstrates an understanding of code organization and maintainability. The user interface also includes a dynamic modal for detailed participant selection, which adds a layer of interactivity beyond a basic form.

The handling of the **32-participant bracket** adds another layer of complexity. The application must correctly transition from four separate 8-participant group brackets to a single final bracket, which is a unique challenge that required a custom solution in both the frontend and backend logic.

-----

### **Files Contained**
* **`tournament/`**
  * **`models.py`**: Defines the Django models that structure the database: `Bracket` (for tournaments), `Bracket_object` (for participants), `Participant_stages` (to track their progress), and `GroupParticipant` (for group-stage logic).
  * **`views.py`**: Contains the core logic for handling web requests. It includes functions for creating tournaments, rendering the bracket pages, and managing API requests to update participant status.
  * **`urls.py`**: Maps URLs to the corresponding views.
  * **`static/`**: This directory holds all the static frontend assets.
      * **`one_eight.js`**: Manages the interactive logic for the Round of 16.
      * **`quater_final.js`**: Manages the interactive logic for the Quarter-Finals.
      * **`semi_final.js`**: Manages the interactive logic for the Semi-Finals.
      * **`final.js`**: Handles the logic for the Final round, including the winner selection modal and sending the champion's data to the backend.
      * **`style.css`**: Styles the entire bracket interface, including the different stages and the modal.
  * **`templates/`**: Stores the HTML templates.
      * **`new_tournament.html`**: The page where a user creates a new tournament and uploads participants.
      * **`bracket.html`**: The main page where the interactive bracket is displayed.
* **`requirements.txt`**: Lists the Python packages required to run the application.

-----

### **How to Run Your Application**

1.  **Clone the repository:**
    ```bash
    git clone <YOUR_REPOSITORY_URL>
    cd <your_project_folder_name>
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Apply database migrations:**
    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
4.  **Create a superuser (optional):**
    ```bash
    python manage.py createsuperuser
    ```
5.  **Start the development server:**
    ```bash
    python manage.py runserver
    ```

The application will now be running at `http://127.0.0.1:8000/`.

-----

### **Additional Information**

The application is designed to function seamlessly from start to finish. A user creates a tournament, uploads a JSON file, and then is guided through each bracket stage via the user interface. The system ensures that participants who have already been eliminated cannot be selected as winners, providing a smooth and logical user experience.

The CSS relies on `position: absolute` to place the participant slots over a bracket background image. This was chosen to allow for maximum flexibility in arranging the bracket layout for different tournament sizes. The use of separate JavaScript files for each stage was a deliberate design choice to prevent the main JavaScript file from becoming too large and difficult to manage.

This structure allows for a clear separation of concerns, making the project easier to understand, debug, and potentially expand in the future.