import fitz  # PyMuPDF
from flask import Flask, request, jsonify
import os
import pytesseract
from PIL import Image

# Create a directory for uploads if it doesn't exist
if not os.path.exists('uploads'):
    os.makedirs('uploads')

app = Flask(__name__)

def process_and_cleanup(filepath, processing_function):
    """Helper function to process a file and ensure it gets deleted."""
    try:
        result_text = processing_function(filepath)
        return jsonify({'text': result_text})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

@app.route('/extract', methods=['POST'])
def extract_text_from_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.lower().endswith('.pdf'):
        filepath = os.path.join('uploads', file.filename)
        file.save(filepath)
        
        def pdf_processor(path):
            doc = fitz.open(path)
            text = ""
            for page in doc:
                text += page.get_text()
            doc.close()
            return text
            
        return process_and_cleanup(filepath, pdf_processor)
    else:
        return jsonify({'error': 'Invalid file type, please upload a PDF'}), 400

@app.route('/ocr', methods=['POST'])
def extract_text_from_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Check for allowed image extensions
    allowed_extensions = {'png', 'jpg', 'jpeg', 'bmp', 'gif', 'tiff'}
    file_ext = file.filename.lower().split('.')[-1]
    if file and file_ext in allowed_extensions:
        filepath = os.path.join('uploads', file.filename)
        file.save(filepath)

        def ocr_processor(path):
            # Use pytesseract to do OCR on the image, specifying Japanese
            # For vertical text, use 'jpn_vert'
            text = pytesseract.image_to_string(Image.open(path), lang='jpn')
            return text

        return process_and_cleanup(filepath, ocr_processor)
    else:
        return jsonify({'error': 'Invalid file type, please upload an image'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)