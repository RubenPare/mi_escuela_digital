from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, SmallInteger
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# ==========================================
# CONFIGURACIÓN DE MYSQL
# ==========================================
# Cambia 'root' y 'tu_contraseña' por tus datos reales y 'miescueladigital' por tu BD
DATABASE_URL = "mysql+pymysql://root:19741026@localhost:3306/gestion_escolar"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==========================================
# MODELO DE LA TABLA 'usuarios'
# ==========================================
class UsuarioModel(Base):
    __tablename__ = "usuarios"
    
    idusuarios = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nombre = Column(String(45), nullable=False)
    apellido = Column(String(45), nullable=False)
    contraseña = Column(String(45), nullable=False)
    fkrol_id = Column(Integer, nullable=False)
    mail = Column(String(45), unique=True, index=True, nullable=False)
    activo = Column(SmallInteger, nullable=False) # tinyint en MySQL se mapea bien como SmallInteger o Integer
    creado_en = Column(DateTime, nullable=False)

app = FastAPI()

# CORS para tu Live Server en el puerto 5500
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependencia para la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# MODELOS PYDANTIC (Validación de datos)
# ==========================================
class UsuarioRegistro(BaseModel):
    nombre: str
    apellido: str
    mail: str
    contraseña: str
    fkrol_id: int

class LoginRequest(BaseModel):
    mail: str
    contraseña: str

# ==========================================
# ENDPOINTS
# ==========================================
@app.get("/")
def inicio():
    return {"mensaje": "API conectada a tu tabla usuarios de MySQL"}

@app.post("/usuarios")
def registrar_usuario(usuario: UsuarioRegistro, db: Session = Depends(get_db)):
    # Verificar si el mail ya existe en MySQL
    db_user = db.query(UsuarioModel).filter(UsuarioModel.mail == usuario.mail).first()
    if db_user:
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    
    # Crear nuevo registro adaptado a tus columnas exactas
    nuevo_usuario = UsuarioModel(
        nombre=usuario.nombre,
        apellido=usuario.apellido,
        mail=usuario.mail,
        contraseña=usuario.contraseña,
        fkrol_id=usuario.fkrol_id,
        activo=1,  # Por defecto activo al registrarse
        creado_en=datetime.now()  # Fecha y hora actual
    )
    
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    
    return {
        "mensaje": "Usuario registrado correctamente en MySQL",
        "usuario": {
            "idusuarios": nuevo_usuario.idusuarios,
            "nombre": nuevo_usuario.nombre,
            "apellido": nuevo_usuario.apellido,
            "mail": nuevo_usuario.mail,
            "fkrol_id": nuevo_usuario.fkrol_id
        }
    }

@app.post("/login")
def login(credenciales: LoginRequest, db: Session = Depends(get_db)):
    # Buscar usuario en MySQL que coincida mail y contraseña
    db_user = db.query(UsuarioModel).filter(
        UsuarioModel.mail == credenciales.mail,
        UsuarioModel.contraseña == credenciales.contraseña
    ).first()
    
    if not db_user:
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")
        
    return {
        "mensaje": "Login exitoso",
        "usuario": {
            "idusuarios": db_user.idusuarios,
            "nombre": db_user.nombre,
            "apellido": db_user.apellido,
            "mail": db_user.mail,
            "fkrol_id": db_user.fkrol_id,
            "activo": db_user.activo
        }

    }
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)