import requests
from bs4 import BeautifulSoup
from general_tutor.models import GeneralTutorSpace
from sources.models import Source
import re
from django.conf import settings
from urllib.parse import urlparse, unquote
from core.utils import h_encode


# Regular expressions for various YouTube URL formats to extract video ID
url_pattern = re.compile(
    r"^(https?:\/\/)"  # http:// or https://
    r"(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})"  # domain name
    r"(\/[^\s]*)?$"  # optional path
)
VALID_EXTENSIONS = [
    ".pdf",
    ".txt",
    ".doc",
    ".docx",
    ".md",
    ".ppt",
    ".pptx",
    ".png",
    ".jpg",
    ".jpeg",
]
VALID_MIME_TYPES = [
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/markdown",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.google-apps.presentation",
    "application/vnd.google-apps.document",
    "image/png",
    "image/jpeg",
    "image/jpg",
]
MIME_TO_DBTYPE = {
    "application/pdf": "PDF",
    "text/plain": "TEXT",
    "application/msword": "WORD",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "WORD",
    "text/markdown": "TEXT",
    "application/vnd.ms-powerpoint": "PDF",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "PDF",
    "application/vnd.google-apps.presentation": "PDF",
    "application/vnd.google-apps.document": "PDF",
    "image/png": "IMG",
    "image/jpeg": "IMG",
    "image/jpg": "IMG",
}

MAX_FILE_SIZE = 50 * 1024 * 1024


def _get_filename_from_url_or_header(url, headers):
    # Try from Content-Disposition header
    cd = headers.get("Content-Disposition")
    if cd and "filename=" in cd:
        filename = cd.split("filename=")[-1].strip('";')
        return filename

    # Otherwise, fallback to parsing the URL
    path = urlparse(url).path
    return unquote(path.split("/")[-1])


def _fetch_clean_text_from_url(url):
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        raise ValueError(f"Failed to fetch URL content: {e}")

    soup = BeautifulSoup(response.content, "html.parser")

    # Remove script, style, and hidden elements
    for element in soup(
        ["script", "style", "noscript", "header", "footer", "nav", "aside"]
    ):
        element.decompose()

    # Extract visible text from body
    body = soup.body
    if not body:
        return ""
    return body.get_text(separator=" ", strip=True)


def process_upload_files(user, is_general_tutor, object_id, upload_files):
    try:
        if bool(int(is_general_tutor)):
            filter_params = {"space": GeneralTutorSpace.objects.get(pk=object_id)}

        for document in upload_files:
            assert document.name, "name required"
            assert document.size < 25 * 1024 * 1024, "File size must be less than 25MB"
            ext = "." + document.name.split(".")[-1].lower()
            if ext not in VALID_EXTENSIONS:
                raise ValueError("Unsupported file type")
            assert (
                document.content_type in VALID_MIME_TYPES
            ), f"mime type unknown: {document.content_type}"

        objects = []

        for document in upload_files:
            obj = Source.objects.create(
                user=user,
                **filter_params,
                source_type=MIME_TO_DBTYPE[document.content_type],
                name=document.name,
            )
            if not obj:
                continue
            lesson_type = "course"
            if bool(int(is_general_tutor)):
                lesson_type = "general_tutor"
            s3_key = (
                f"souces/user_{h_encode(user.id)}/{lesson_type}/"
                + f"{h_encode(obj.id)}/{document.name}"
            )
            presigned_post = settings.AWS_S3_C.generate_presigned_post(
                Bucket=settings.AWS_BUCKET_NAME,
                Key=s3_key,
                Fields={"Content-Type": document.content_type},
                Conditions=[
                    {"Content-Type": document.content_type},
                    ["content-length-range", 0, MAX_FILE_SIZE],  # max 50MB
                ],
                ExpiresIn=600,  # 10 minutes
            )
            obj.s3_key = s3_key
            obj.presiged_post = presigned_post
            obj.save()
            objects.append(obj)
    except Exception as e:
        print(e)
        return False
    else:
        return objects


def process_picker_files(user, is_general_tutor, object_id, picker_files):
    try:
        if bool(int(is_general_tutor)):
            filter_params = {"space": GeneralTutorSpace.objects.get(pk=object_id)}

        assert type(picker_files) is dict, "err1"
        assert picker_files["docs"], "err2"
        assert len(picker_files["docs"]) > 0, "err4"
        for document in picker_files["docs"]:
            assert (
                document["mimeType"] in VALID_MIME_TYPES
            ), f"mime type unknown: {document['mimeType']}"

        objects = []

        for document in picker_files["docs"]:
            # 2) stream download so we don't load whole file into RAM at once
            download_url = (
                "https://www.googleapis.com/drive/v3/files/"
                + f"{document['id']}?alt=media"
            )
            obj = Source.objects.create(
                user=user,
                **filter_params,
                source_type=MIME_TO_DBTYPE[document["mimeType"]],
                name=document["name"],
                url=download_url,
            )
            lesson_type = "course"
            if bool(int(is_general_tutor)):
                lesson_type = "general_tutor"
            s3_key = (
                f"souces/user_{h_encode(user.id)}/{lesson_type}/"
                + f"{h_encode(obj.id)}/{document['name']}"
                + f".{MIME_TO_DBTYPE[document['mimeType']]}"
            )
            presigned_post = settings.AWS_S3_C.generate_presigned_post(
                Bucket=settings.AWS_BUCKET_NAME,
                Key=s3_key,
                Fields={"Content-Type": document["mimeType"]},
                Conditions=[
                    {"Content-Type": document["mimeType"]},
                    ["content-length-range", 0, MAX_FILE_SIZE],  # max 50MB
                ],
                ExpiresIn=600,  # 10 minutes
            )
            obj.s3_key = s3_key
            obj.presiged_post = presigned_post
            obj.save()
            objects.append(obj)
    except Exception as e:
        print(e)
        return False
    else:
        return objects


def process_webdoc(user, is_general_tutor, object_id, name, url):
    """
    Processes a document URL by validating it, fetching the document,
    and creating a Source entry linked to the appropriate lesson or course.
    """
    try:
        if bool(int(is_general_tutor)):
            filter_params = {"space": GeneralTutorSpace.objects.get(pk=object_id)}

        assert isinstance(url, str), "URL must be a string"
        assert url_pattern.match(url), "Invalid URL format"

        # Fetch the document to verify it exists and is a supported file
        response = requests.head(url, allow_redirects=True, timeout=2)
        if response.status_code >= 400:
            raise ValueError("Document URL returned an error status")

        content_type = response.headers.get("Content-Type", "").split(";")[0].lower()
        filename = _get_filename_from_url_or_header(url, response.headers)

        if not filename:
            raise ValueError("Cannot determine filename from URL or headers")

        # Check file extension
        ext = "." + filename.split(".")[-1].lower()
        if content_type not in VALID_MIME_TYPES and ext not in VALID_EXTENSIONS:
            raise ValueError("Unsupported file type")

    except Exception as e:
        print(f"[process_webdoc] Error: {e}")
        return False
    else:
        # Prepare fields for Source
        source_data = {
            "user": user,
            **filter_params,
            "source_type": "WEBDOC",
            "url": url,
            "name": name,
        }
        obj = Source.objects.create(**source_data)
        lesson_type = "course"
        if bool(int(is_general_tutor)):
            lesson_type = "general_tutor"
        s3_key = (
            f"souces/user_{h_encode(user.id)}/{lesson_type}/"
            + f"{h_encode(obj.id)}/{filename}"
            + f".{MIME_TO_DBTYPE[content_type]}"
        )
        presigned_post = settings.AWS_S3_C.generate_presigned_post(
            Bucket=settings.AWS_BUCKET_NAME,
            Key=s3_key,
            Fields={"Content-Type": content_type},
            Conditions=[
                {"Content-Type": content_type},
                ["content-length-range", 0, MAX_FILE_SIZE],  # max 20MB
            ],
            ExpiresIn=600,  # 10 minutes
        )
        obj.s3_key = s3_key
        obj.presiged_post = presigned_post
        obj.save()

        return obj


def process_website_url(user, is_general_tutor, object_id, name, url):
    try:
        if bool(int(is_general_tutor)):
            filter_params = {"space": GeneralTutorSpace.objects.get(pk=object_id)}

        assert len(name) > 3
        assert type(url) is str
        assert url_pattern.match(url), "Invalid URL format"
    except Exception as e:
        print(e)
        return False
    else:
        return Source.objects.create(
            user=user,
            **filter_params,
            source_type="WEB",
            name=name,
            url=url,
            pipeline_uploaded=True,
        )


def process_raw_text(user, is_general_tutor, object_id, name, content):
    try:
        if bool(int(is_general_tutor)):
            filter_params = {"space": GeneralTutorSpace.objects.get(pk=object_id)}
             
        assert len(name) > 0
        assert len(content) > 0
    except Exception as e:
        print(e)
        return False
    else:
        return Source.objects.create(
            user=user,
            **filter_params,
            source_type="TEXT",
            name=name,
            full_content=content,
            pipeline_uploaded=True,
        )
