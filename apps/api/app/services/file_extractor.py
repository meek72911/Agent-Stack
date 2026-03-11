import io
import pypdf
import docx
from typing import List, Dict, Any, Optional

class FileExtractor:
    """
    Service to extract text and metadata from various file formats 
    for injection into agent context (RAG).
    """
    
    @staticmethod
    def extract_text(file_content: bytes, filename: str) -> str:
        ext = filename.split(".")[-1].lower()
        
        if ext == "pdf":
            return FileExtractor._extract_pdf(file_content)
        elif ext in ["docx", "doc"]:
            return FileExtractor._extract_docx(file_content)
        elif ext in ["txt", "md", "csv", "json"]:
            return file_content.decode("utf-8", errors="ignore")
        else:
            raise ValueError(f"Unsupported file extension: {ext}")

    @staticmethod
    def _extract_pdf(content: bytes) -> str:
        pdf_file = io.BytesIO(content)
        reader = pypdf.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    @staticmethod
    def _extract_docx(content: bytes) -> str:
        docx_file = io.BytesIO(content)
        doc = docx.Document(docx_file)
        return "\n".join([para.text for para in doc.paragraphs])

    @staticmethod
    def chunk_text(text: str, chunk_size: int = 2000, overlap: int = 200) -> List[str]:
        """Simple sliding window chunking."""
        chunks = []
        if not text:
            return chunks
            
        start = 0
        while start < len(text):
            end = start + chunk_size
            chunks.append(text[start:end])
            start += chunk_size - overlap
            
        return chunks

file_extractor = FileExtractor()
