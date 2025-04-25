# Simplefy - Spotify Clone

Simplefy is a frontend-only Spotify clone built with HTML, CSS, and JavaScript. It dynamically loads and displays songs from a local directory, extracting the song details (author and name) from `.mp3` filenames. The app also fetches album cover images, matching them with the song filename, and if no cover is available, it defaults to a simple music note image. This project mimics the basic functionality of a music player, providing a lightweight, responsive, and intuitive interface.

## How It Works

1. **Directory Search**:  
   The application scans a folder named `songs` (in lowercase) within the directory where the website files are located. This folder contains all the `.mp3` files and their respective album covers.

2. **Song Detection**:  
   Each `.mp3` file is named in the format:  
   `Author name - Song name.mp3`  
   The app splits the filename by the `-` delimiter to extract the **author name** and **song name**, which are then used to populate the HTML dynamically.

3. **Cover Image Handling**:  
   For each song, the app checks if there is a corresponding cover image with the same name as the `.mp3` file (e.g., `Author name - Song name.jpg`). If the cover image is found, it is displayed alongside the song details. If no cover image is available, a default image (a simple music note) is used.

4. **Populating the HTML**:  
   Once the author and song details are extracted, and the cover image is detected, the app dynamically adds them to the webpage, creating a user-friendly interface that mimics a real music player.

## Folder Structure

- **songs Folder**: Contains all the `.mp3` files and album cover images (with matching names).
- **Default Cover Image**: Used if no specific cover image is found for a song.

## Disclaimer

Due to **CORS (Cross-Origin Resource Sharing)** restrictions, this project may not work properly when opened directly from the `file://` protocol. To bypass this issue, follow one of the methods below:

1. **Using VS Code Live Preview Extension**:
   - Install the **Live Server** extension in Visual Studio Code.
   - Right-click on `index.html` and select **"Open with Live Server"**.
   - This will serve your project over HTTP, bypassing CORS restrictions.

2. **Using a Local Server**:
   - You can also use any local web server such as:
     - **Python HTTP Server**:  
       Run the following command in the terminal (ensure you're in the project folder):
       ```bash
       python -m http.server
       ```
     - **Node.js HTTP Server**:  
       Install `http-server` globally using npm:
       ```bash
       npm install -g http-server
       ```
       Then run the server in your project folder:
       ```bash
       http-server
       ```

   - After starting the server, visit `http://localhost:8000` (for Python) or `http://localhost:8080` (for Node.js) in your browser to view the project.

## How to Use

1. Download or clone the repository.
2. Ensure that your `songs` folder contains the `.mp3` files and matching cover images.
3. Open the project using a local server (e.g., VS Code Live Preview, Python HTTP server, or Node.js HTTP server) to bypass CORS restrictions.
4. Open `index.html` in your browser to see the Spotify clone in action.
