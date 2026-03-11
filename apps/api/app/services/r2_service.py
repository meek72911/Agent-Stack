import boto3
from botocore.config import Config
from typing import BinaryIO, Optional
from app.core.config import settings

class R2Service:
    def __init__(self):
        if not settings.CLOUDFLARE_R2_ACCOUNT_ID:
            self.client = None
            return
            
        self.endpoint_url = f"https://{settings.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
        self.client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            aws_access_key_id=settings.CLOUDFLARE_R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )
        self.bucket = settings.CLOUDFLARE_R2_BUCKET_NAME

    def upload_file(self, file_obj: BinaryIO, key: str, content_type: Optional[str] = None) -> str:
        """Uploads a file to R2 and returns the public/private URL."""
        if not self.client:
            raise ValueError("R2 client not initialized. Check environment variables.")
            
        extra_args = {}
        if content_type:
            extra_args["ContentType"] = content_type
            
        self.client.upload_fileobj(file_obj, self.bucket, key, ExtraArgs=extra_args)
        return f"{key}"

    def get_download_url(self, key: str, expires_in: int = 3600) -> str:
        """Generates a presigned URL for downloading a file."""
        if not self.client:
            raise ValueError("R2 client not initialized.")
            
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=expires_in,
        )

    def delete_file(self, key: str):
        """Deletes a file from R2."""
        if not self.client:
            return
            
        self.client.delete_object(Bucket=self.bucket, Key=key)

r2_service = R2Service()
