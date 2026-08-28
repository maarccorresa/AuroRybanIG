from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.background import BackgroundTasks
import os
import tempfile

from metadata import apply_profile, read_metadata, detect_file_type

app = FastAPI(title="AutoRayban API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _cleanup(path: str):
    if os.path.exists(path):
        os.unlink(path)


@app.post("/metadata/read")
async def read_metadata_endpoint(file: UploadFile = File(...)):
    suffix = os.path.splitext(file.filename)[1]
    tmp_path = f"{tempfile.gettempdir()}/autoryban_read_{file.filename}"
    with open(tmp_path, "wb") as tmp:
        tmp.write(await file.read())
    try:
        metadata = read_metadata(tmp_path)
        return {"filename": file.filename, "metadata": metadata}
    finally:
        _cleanup(tmp_path)


@app.post("/metadata/apply")
async def apply_profile_endpoint(file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    suffix = os.path.splitext(file.filename)[1]
    tmp_path = f"{tempfile.gettempdir()}/autoryban_apply_{file.filename}"
    with open(tmp_path, "wb") as tmp:
        tmp.write(await file.read())
    ftype = detect_file_type(tmp_path)
    if ftype == "unknown":
        _cleanup(tmp_path)
        raise HTTPException(status_code=400, detail="Unsupported file type")
    try:
        result_path, kind = apply_profile(tmp_path)
    except ValueError as e:
        _cleanup(tmp_path)
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        _cleanup(tmp_path)
        raise HTTPException(status_code=500, detail=str(e))
    background_tasks.add_task(_cleanup, result_path)
    return FileResponse(
        path=result_path,
        filename=f"rayban_{file.filename}",
        media_type="application/octet-stream",
    )
