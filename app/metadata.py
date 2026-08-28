import subprocess
import shutil
import tempfile
import os
import json
from pathlib import Path
from typing import Optional

RAYBAN_MAKE = "Meta AI"
RAYBAN_MODEL = "Ray-Ban Meta Smart Glasses 2"

PHOTO_PROFILE = {
    "Make": RAYBAN_MAKE,
    "Model": RAYBAN_MODEL,
    "Orientation": "Horizontal (normal)",
    "XResolution": 72,
    "YResolution": 72,
    "ResolutionUnit": "inches",
    "YCbCrPositioning": "Centered",
    "ExifVersion": "0221",
    "FlashpixVersion": "0100",
    "ColorSpace": "sRGB",
    "SceneCaptureType": "Standard",
}

VIDEO_PROFILE = {
    "Make": RAYBAN_MAKE,
    "Model": RAYBAN_MODEL,
}


def _run(cmd: list[str]) -> str:
    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip())
    return result.stdout


def _exiftool() -> str:
    path = shutil.which("exiftool")
    if not path:
        raise RuntimeError("exiftool not found in PATH")
    return path


def _ffmpeg() -> str:
    path = shutil.which("ffmpeg")
    if not path:
        raise RuntimeError("ffmpeg not found in PATH")
    return path


def detect_file_type(file_path: str) -> str:
    ext = Path(file_path).suffix.lower()
    image_exts = {".jpg", ".jpeg", ".png", ".heic", ".tif", ".tiff", ".webp"}
    video_exts = {".mp4", ".mov", ".avi", ".mkv", ".3gp", ".m4v"}
    if ext in image_exts:
        return "image"
    if ext in video_exts:
        return "video"
    return "unknown"


def read_metadata(file_path: str) -> dict:
    et = _exiftool()
    output = _run([et, "-j", file_path])
    data = json.loads(output)
    if not data:
        return {}
    return data[0]


def apply_photo_profile(file_path: str) -> str:
    et = _exiftool()
    args = [et, "-overwrite_original"]
    for tag, value in PHOTO_PROFILE.items():
        args.append(f"-{tag}={value}")
    args.append(file_path)
    _run(args)
    return file_path


def apply_video_profile(file_path: str) -> str:
    ff = _ffmpeg()
    tmp_path = file_path + ".tmp.mp4"
    args = [
        ff,
        "-i",
        file_path,
        "-c",
        "copy",
        "-metadata",
        f"make={RAYBAN_MAKE}",
        "-metadata",
        f"model={RAYBAN_MODEL}",
        "-y",
        tmp_path,
    ]
    _run(args)
    os.replace(tmp_path, file_path)
    et = _exiftool()
    _run([et, "-overwrite_original", f"-Make={RAYBAN_MAKE}", f"-Model={RAYBAN_MODEL}", file_path])
    return file_path


def apply_profile(file_path: str) -> tuple[str, str]:
    ftype = detect_file_type(file_path)
    if ftype == "image":
        apply_photo_profile(file_path)
        return file_path, "image"
    elif ftype == "video":
        apply_video_profile(file_path)
        return file_path, "video"
    else:
        raise ValueError(f"Unsupported file type: {file_path}")
