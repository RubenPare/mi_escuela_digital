from datetime import datetime
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime, SmallInteger
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

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
    # ==========================================
# MODELO DE LA TABLA 'alumnos'
# ==========================================

class AlumnoModel(Base):

    __tablename__ = "alumnos"

    idalumnos = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    legajo = Column(
        String(45),
        nullable=False
    )

    nombre = Column(
        String(45),
        nullable=False
    )

    apellido = Column(
        String(45),
        nullable=False
    )

    documento = Column(
        Integer,
        nullable=False
    )

    mail = Column(
        String(45),
        nullable=True
    )

    fecha_nacimiento = Column(
        DateTime,
        nullable=True
    )

    activo = Column(
        SmallInteger,
        nullable=True
    )
# ==========================================
# MODELO DE LA TABLA 'cursos'
# ==========================================

class CursoModel(Base):
    __tablename__ = "cursos"

    idcursos = Column(
        Integer,
        primary_key=True,
        index=True,
        autoincrement=True
    )

    nivel = Column(
        Integer,
        nullable=False
    )

    division = Column(
        String(45),
        nullable=True
    )

app = FastAPI()
# ==========================================
# ARCHIVOS DEL FRONTEND
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

app.mount(
    "/css",
    StaticFiles(directory=BASE_DIR / "css"),
    name="css"
)

app.mount(
    "/js",
    StaticFiles(directory=BASE_DIR / "js"),
    name="js"
)

@app.get("/registro.html")
def registro():
    return FileResponse(BASE_DIR / "registro.html")


@app.get("/login.html")
def login_page():
    return FileResponse(BASE_DIR / "login.html")


@app.get("/indice.html")
def indice():
    return FileResponse(BASE_DIR / "indice.html")


@app.get("/dashboard.html")
def dashboard():
    return FileResponse(BASE_DIR / "dashboard.html")

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
# MODELO PYDANTIC - ALUMNO
# ==========================================

class AlumnoRegistro(BaseModel):

    legajo: str
    nombre: str
    apellido: str
    documento: int
    mail: str | None = None
    fecha_nacimiento: str | None = None
# ==========================================
# DATOS DE CURSO
# ==========================================

class CursoRegistro(BaseModel):
    nivel: int
    division: str    


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
# ==========================================
# OBTENER TODOS LOS ALUMNOS
# ==========================================

@app.get("/alumnos")
def obtener_alumnos(
    db: Session = Depends(get_db)
):

    alumnos = db.query(AlumnoModel).all()

    return [
        {
            "idalumnos": alumno.idalumnos,
            "legajo": alumno.legajo,
            "nombre": alumno.nombre,
            "apellido": alumno.apellido,
            "documento": alumno.documento,
            "mail": alumno.mail,
            "fecha_nacimiento": (
                alumno.fecha_nacimiento.isoformat()
                if alumno.fecha_nacimiento
                else None
            ),
            "activo": alumno.activo
        }

        for alumno in alumnos
    ]
# ==========================================
# REGISTRAR NUEVO ALUMNO
# ==========================================

@app.post("/alumnos")
@app.put("/alumnos/{alumno_id}")
def modificar_alumno(
    alumno_id: int,
    alumno: AlumnoRegistro,
    db: Session = Depends(get_db)
):

    alumno_db = db.query(AlumnoModel).filter(
        AlumnoModel.idalumnos == alumno_id
    ).first()

    if not alumno_db:
        raise HTTPException(
            status_code=404,
            detail="Alumno no encontrado"
        )

    # Verificar que el legajo no pertenezca a otro alumno
    legajo_existente = db.query(AlumnoModel).filter(
        AlumnoModel.legajo == alumno.legajo,
        AlumnoModel.idalumnos != alumno_id
    ).first()

    if legajo_existente:
        raise HTTPException(
            status_code=400,
            detail="El legajo ya pertenece a otro alumno"
        )

    # Convertir fecha
    fecha = None

    if alumno.fecha_nacimiento:
        try:
            fecha = datetime.strptime(
                alumno.fecha_nacimiento,
                "%Y-%m-%d"
            )
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Formato de fecha incorrecto"
            )

    # Actualizar datos
    alumno_db.legajo = alumno.legajo
    alumno_db.nombre = alumno.nombre
    alumno_db.apellido = alumno.apellido
    alumno_db.documento = alumno.documento
    alumno_db.mail = alumno.mail
    alumno_db.fecha_nacimiento = fecha

    db.commit()
    db.refresh(alumno_db)

    return {
        "mensaje": "Alumno modificado correctamente",
        "alumno": {
            "idalumnos": alumno_db.idalumnos,
            "legajo": alumno_db.legajo,
            "nombre": alumno_db.nombre,
            "apellido": alumno_db.apellido,
            "documento": alumno_db.documento,
            "mail": alumno_db.mail,
            "fecha_nacimiento": (
                alumno_db.fecha_nacimiento.isoformat()
                if alumno_db.fecha_nacimiento
                else None
            ),
            "activo": alumno_db.activo
        }
    }
# ==========================================
# ACTIVAR / DESACTIVAR ALUMNO
# ==========================================

@app.put("/alumnos/{alumno_id}/estado")
def cambiar_estado_alumno(
    alumno_id: int,
    db: Session = Depends(get_db)
):

    alumno = db.query(AlumnoModel).filter(
        AlumnoModel.idalumnos == alumno_id
    ).first()

    if not alumno:
        raise HTTPException(
            status_code=404,
            detail="Alumno no encontrado"
        )

    if alumno.activo == 1:
        alumno.activo = 0
        mensaje = "Alumno desactivado correctamente"
    else:
        alumno.activo = 1
        mensaje = "Alumno activado correctamente"

    db.commit()
    db.refresh(alumno)

    return {
        "mensaje": mensaje,
        "idalumnos": alumno.idalumnos,
        "activo": alumno.activo
    }
def registrar_alumno(
    alumno: AlumnoRegistro,
    db: Session = Depends(get_db)
):

    # Verificar si ya existe el legajo

    alumno_existente = db.query(AlumnoModel).filter(
        AlumnoModel.legajo == alumno.legajo
    ).first()

    if alumno_existente:

        raise HTTPException(
            status_code=400,
            detail="El legajo ya está registrado"
        )


    # Convertir fecha

    fecha = None

    if alumno.fecha_nacimiento:

        try:

            fecha = datetime.strptime(
                alumno.fecha_nacimiento,
                "%Y-%m-%d"
            )

        except ValueError:

            raise HTTPException(
                status_code=400,
                detail="Formato de fecha incorrecto"
            )


    # Crear alumno

    nuevo_alumno = AlumnoModel(

        legajo=alumno.legajo,

        nombre=alumno.nombre,

        apellido=alumno.apellido,

        documento=alumno.documento,

        mail=alumno.mail,

        fecha_nacimiento=fecha,

        activo=1

    )


    db.add(nuevo_alumno)

    db.commit()

    db.refresh(nuevo_alumno)


    return {

        "mensaje": "Alumno registrado correctamente",

        "alumno": {

            "idalumnos": nuevo_alumno.idalumnos,

            "legajo": nuevo_alumno.legajo,

            "nombre": nuevo_alumno.nombre,

            "apellido": nuevo_alumno.apellido,

            "documento": nuevo_alumno.documento,

            "mail": nuevo_alumno.mail

        }

    }
# ==========================================
# CREAR CURSO
# ==========================================

@app.post("/cursos")
def registrar_curso(
    curso: CursoRegistro,
    db: Session = Depends(get_db)
):

    nuevo_curso = CursoModel(
        nivel=curso.nivel,
        division=curso.division
    )

    db.add(nuevo_curso)
    db.commit()
    db.refresh(nuevo_curso)

    return {
        "mensaje": "Curso registrado correctamente",
        "curso": {
            "idcursos": nuevo_curso.idcursos,
            "nivel": nuevo_curso.nivel,
            "division": nuevo_curso.division
        }
    }
# ==========================================
# LISTAR CURSOS
# ==========================================

@app.get("/cursos")
def listar_cursos(
    db: Session = Depends(get_db)
):

    cursos = db.query(CursoModel).order_by(
        CursoModel.nivel,
        CursoModel.division
    ).all()

    return [
        {
            "idcursos": curso.idcursos,
            "nivel": curso.nivel,
            "division": curso.division
        }
        for curso in cursos
    ]
# ==========================================
# MODIFICAR CURSO
# ==========================================

@app.put("/cursos/{curso_id}")
def modificar_curso(
    curso_id: int,
    curso: CursoRegistro,
    db: Session = Depends(get_db)
):

    curso_db = db.query(CursoModel).filter(
        CursoModel.idcursos == curso_id
    ).first()

    if not curso_db:

        raise HTTPException(
            status_code=404,
            detail="Curso no encontrado"
        )

    curso_db.nivel = curso.nivel
    curso_db.division = curso.division

    db.commit()
    db.refresh(curso_db)

    return {
        "mensaje": "Curso modificado correctamente",
        "curso": {
            "idcursos": curso_db.idcursos,
            "nivel": curso_db.nivel,
            "division": curso_db.division
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