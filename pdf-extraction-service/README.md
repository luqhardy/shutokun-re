# PDF & OCR Extraction Service

This directory contains a simple Python Flask service to extract text from PDF files and images. It is designed to be run on a home server (like Proxmox) and accessed by the Shutokun-re mobile app.

## How It Works

The service provides two endpoints:
- `/extract`: Accepts a `POST` request with a PDF file. It uses `PyMuPDF` to extract text.
- `/ocr`: Accepts a `POST` request with an image file (e.g., PNG, JPG). It uses `Tesseract` to perform OCR and extract text.

In both cases, the service returns the extracted text in a JSON response.

## Setup and Deployment

Follow these steps to run the service on a Linux-based server (e.g., a Debian VM or LXC container).

### 1. System Dependencies

This service requires the Tesseract OCR engine to be installed on the server.

**On Debian/Ubuntu:**
```bash
sudo apt-get update
sudo apt-get install -y tesseract-ocr
```

### 2. Project Setup

Navigate to this directory on your server.
```bash
cd /path/to/shutokun-re/pdf-extraction-service
```

### 3. Create a Virtual Environment (Recommended)

It's best practice to use a virtual environment to manage dependencies.
```bash
# Create the environment
python3 -m venv venv

# Activate the environment
source venv/bin/activate
```

### 4. Install Python Dependencies

Install the required Python libraries using `pip`. The new requirements for OCR have been added to the `requirements.txt` file.
```bash
pip install -r requirements.txt
```

### 5. Run the Service

Start the Flask web server.
```bash
python3 pdf_extractor.py
```
The service will start and listen on port `5000`.

### 6. Configure Networking

For the mobile app to reach this service, you must:
1.  **Find the Server's IP Address:**
    *   If using a VPN like **Tailscale** (recommended), find the Tailscale IP address (usually starts with `100.x.x.x`).
    *   Otherwise, find the server's local network IP address (e.g., `192.168.1.100`).
2.  **Update the Mobile App:**
    *   Open the file `app/(tabs)/custom-mode.tsx` in the project.
    *   Find the `PDF_EXTRACTOR_URL` constant near the top of the file.
    *   Replace the placeholder `<YOUR_SERVER_IP>` with the IP address from the previous step.

    Example:
    ```javascript
    const PDF_EXTRACTOR_URL = 'http://100.101.102.103:5000/extract';
    ```
The service is now ready to receive requests from the app.