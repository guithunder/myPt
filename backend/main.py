import logging
import os

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, get_db

logger = logging.getLogger("pet-notes")

# Cria as tabelas se não existirem. Se o banco estiver indisponível, o servidor
# sobe mesmo assim (o /docs abre e o erro aparece no log), em vez de cair em loop.
try:
    models.Base.metadata.create_all(bind=engine)
except Exception as exc:
    logger.error("Não foi possível criar as tabelas: %s", exc)

app = FastAPI(title="Pet Notes API", version="1.0.0")

# CORS: defina ALLOWED_ORIGINS no Render com as URLs do frontend, separadas por vírgula.
# Exemplo: https://meu-projeto.vercel.app,http://localhost:5173
# Se a variável não existir, libera tudo ("*") para não bloquear o frontend.
_origins_env = os.getenv("ALLOWED_ORIGINS", "").strip()
allowed_origins = (
    [o.strip().rstrip("/") for o in _origins_env.split(",") if o.strip()]
    if _origins_env
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,  # o frontend não usa cookies
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "PET-Notes API online! Sistema operacional pronto, Operador."}


@app.get("/health")
def health(db: Session = Depends(get_db)):
    """Confere se a API consegue falar com o banco."""
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ok", "database": "online"}
    except Exception as exc:
        logger.error("Health check falhou: %s", exc)
        raise HTTPException(status_code=503, detail="Banco de dados indisponível")


# Listar todas as notas
@app.get("/notes", response_model=list[schemas.NoteResponse])
def get_notes(db: Session = Depends(get_db)):
    return db.query(models.Note).order_by(models.Note.id.desc()).all()


# Criar uma nova nota
@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_note = models.Note(
        title=note.title, content=note.content, category=note.category
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


# Apagar uma nota por ID
@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Nota não encontrada")
    db.delete(db_note)
    db.commit()
    return {"message": "Nota apagada com sucesso", "id": note_id}