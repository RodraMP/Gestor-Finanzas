// Clave en localStorage
const STORAGE_KEY = "gestor_finanzas_transacciones";

// Guardar
function guardarEnStorage(transacciones) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transacciones));
  } catch (err) {
    console.error("No se pudo guardar en storage:", err);
  }
}

// Cargar
function cargarDeStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error leyendo storage:", err);
    return [];
  }
}
