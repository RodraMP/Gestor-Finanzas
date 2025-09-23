// Array para guardar las transacciones
let transacciones = [];

// Elementos del DOM
const form = document.getElementById("transaction-form");
const lista = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance-amount");

// Escuchar el formulario
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Capturar valores
  const monto = parseFloat(document.getElementById("amount").value);
  const categoria = document.getElementById("category").value;
  const descripcion = document.getElementById("description").value || "-";
  const tipo = document.getElementById("type").value;

  if (isNaN(monto) || monto <= 0) return;

  // Crear objeto transacción
  const transaccion = {
    fecha: new Date().toLocaleDateString(),
    tipo,
    categoria,
    descripcion,
    monto,
  };

  // Guardar en array
  transacciones.push(transaccion);

  // Renderizar en tabla
  agregarFila(transaccion);

  // Recalcular balance
  actualizarBalance();

  // Actualizar gráficos
  actualizarPieChart();
  actualizarBarChart();

  // Resetear formulario
  form.reset();
});

// Agregar fila a la tabla
function agregarFila(tx) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${tx.fecha}</td>
    <td>${tx.tipo}</td>
    <td>${tx.categoria}</td>
    <td>${tx.descripcion}</td>
    <td>$${tx.monto.toFixed(2)}</td>
  `;
  lista.appendChild(fila);
}

// Calcular balance
function actualizarBalance() {
  let total = 0;
  transacciones.forEach((tx) => {
    if (tx.tipo === "ingreso") total += tx.monto;
    else total -= tx.monto;
  });
  balanceEl.textContent = `$${total.toLocaleString()}`;
}

// Actualizar gráfico de torta
function actualizarPieChart() {
  const categorias = {};
  transacciones
    .filter((tx) => tx.tipo === "egreso")
    .forEach((tx) => {
      categorias[tx.categoria] = (categorias[tx.categoria] || 0) + tx.monto;
    });

  pieChart.data.labels = Object.keys(categorias);
  pieChart.data.datasets[0].data = Object.values(categorias);
  pieChart.update();
}

// Actualizar gráfico de barras
function actualizarBarChart() {
  const resumen = {};

  transacciones.forEach((tx) => {
    const mes = new Date().toLocaleString("default", { month: "short" });
    if (!resumen[mes]) resumen[mes] = { ingresos: 0, egresos: 0 };

    if (tx.tipo === "ingreso") resumen[mes].ingresos += tx.monto;
    else resumen[mes].egresos += tx.monto;
  });

  barChart.data.labels = Object.keys(resumen);
  barChart.data.datasets[0].data = Object.values(resumen).map((m) => m.ingresos);
  barChart.data.datasets[1].data = Object.values(resumen).map((m) => m.egresos);
  barChart.update();
}
