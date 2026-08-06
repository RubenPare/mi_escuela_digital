import mysql.connector
from mysql.connector import Error

def conectar_base_datos():
    conexion = None
    try:
        # Configuración de los parámetros de conexión
        conexion = mysql.connector.connect(
            host='localhost',          # o '127.0.0.1'
            port=3306,                 # Puerto por defecto de MySQL
            user='root',               # Tu usuario de MySQL
            password='19741026',  # Tu contraseña de MySQL
            database='gestion_escolar'   # Nombre de tu base de datos
        )

        if conexion.is_connected():
            print("✅ Conexión exitosa a la base de datos MySQL.")
            
            # Obtener información del servidor
            info_servidor = conexion.get_server_info()
            print(f"Versión del servidor MySQL: {info_servidor}")
            
            return conexion

    except Error as e:
        print(f"❌ Error al conectar a MySQL: {e}")
        return None

# --- Ejemplo de uso y prueba ---
if __name__ == "__main__":
    db = conectar_base_datos()
    
    # Si la conexión fue exitosa, cerramos la conexión
    if db and db.is_connected():
        db.close()
        print("🔒 Conexión cerrada correctamente.")