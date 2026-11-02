from database import engine, get_db
import models
import schemas
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Cria as tabelas no banco de dados automaticamente se não existirem
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pet Notes API", version="1.0.0")

# Configuração do CORS para permitir que o Frontend (React) comunique com o Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, podes restringir para o domínio do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
  return {"message": "PET-Notes API online! Sistema operacional pronto, Operador."}


# Rota para listar todas as notas
@app.get("/notes", response_model=list[schemas.NoteResponse])
def get_notes(db: Session = Depends(get_db)):
  notes = db.query(models.Note).all()
  return notes


# Rota para criar uma nova nota
@app.post("/notes", response_model=schemas.NoteResponse)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
  db_note = models.Note(
      title=note.title, content=note.content, category=note.category
  )
  db.add(db_note)
  db.commit()
  db.refresh(db_note)
  return db_note


# Rota para apagar uma nota por ID
@app.delete("/notes/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
  db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
  if not db_note:
    raise HTTPException(status_code=404, detail="Nota não encontrada")
  db.delete(db_note)
  db.commit()
  return {"message": "Nota apagada com sucesso", "id": note_id}