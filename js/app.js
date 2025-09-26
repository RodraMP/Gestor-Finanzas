let transacciones = cargarDeStorage();

const form = document.getElementById("transaction-form");
const lista = document.getElementById("transaction-list");
const balanceEl = document.getElementById("balance-amount");
const categoriaSelect = document.getElementById("category");
const tipoSelect = document.getElementById("type");

let categorias = { ingresos: [], egresos: [] };

fetch("data/categorias.json")
  .then((res) => res.json())
  .then((data) => {
    categorias = data;
    actualizarCategorias();
  })
  .catch((err) => console.error("Error cargando categorías:", err));

tipoSelect.addEventListener("change", actualizarCategorias);

function actualizarCategorias() {
  const tipo = tipoSelect.value;
  const key = tipo === "ingreso" ? "ingresos" : "egresos";
  categoriaSelect.innerHTML = "";
  (categorias[key] || []).forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoriaSelect.appendChild(option);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const monto = parseFloat(document.getElementById("amount").value);
  const descripcion = document.getElementById("description").value || "-";
  const tipo = tipoSelect.value;
  const categoria = categoriaSelect.value || "Otros";

  if (isNaN(monto) || monto <= 0) return;

  const ahora = new Date().toISOString();

  const transaccion = {
    fechaISO: ahora,
    tipo,
    categoria,
    descripcion,
    monto,
  };

  transacciones.push(transaccion);
  guardarEnStorage(transacciones);

  agregarFila(transaccion);
  actualizarBalance();
  actualizarPieCharts();
  actualizarBarChart();

  form.reset();
  actualizarCategorias();
  const toastEl = document.getElementById("liveToast");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
});

function renderAll() {
  lista.innerHTML = "";
  transacciones.forEach((tx) => agregarFila(tx));
  actualizarBalance();
  actualizarPieCharts();
  actualizarBarChart();
}

function agregarFila(tx) {
  const fila = document.createElement("tr");
  fila.classList.add(tx.tipo);

  const fechaLegible = new Date(tx.fechaISO).toLocaleDateString();
  fila.innerHTML = `
    <td>${fechaLegible}</td>
    <td>${tx.tipo}</td>
    <td>${tx.categoria}</td>
    <td>${tx.descripcion}</td>
    <td>$${tx.monto.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
  `;
  lista.appendChild(fila);
}

function actualizarBalance() {
  let total = 0;
  transacciones.forEach((tx) => {
    total += tx.tipo === "ingreso" ? tx.monto : -tx.monto;
  });
  balanceEl.textContent = `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function actualizarPieCharts() {
  const ingresosCat = {};
  const egresosCat = {};
  let totalIngresos = 0;
  let totalEgresos = 0;

  transacciones.forEach((tx) => {
    if (tx.tipo === "ingreso") {
      ingresosCat[tx.categoria] = (ingresosCat[tx.categoria] || 0) + tx.monto;
      totalIngresos += tx.monto;
    } else {
      egresosCat[tx.categoria] = (egresosCat[tx.categoria] || 0) + tx.monto;
      totalEgresos += tx.monto;
    }
  });

  pieIngresos.data.labels = Object.keys(ingresosCat);
  pieIngresos.data.datasets[0].data = Object.values(ingresosCat);
  pieIngresos.data.datasets[0].backgroundColor = generarColores(Object.keys(ingresosCat).length);
  pieIngresos.update();


  pieEgresos.data.labels = Object.keys(egresosCat);
  pieEgresos.data.datasets[0].data = Object.values(egresosCat);
  pieEgresos.data.datasets[0].backgroundColor = generarColores(Object.keys(egresosCat).length);
  pieEgresos.update();

  pieBalance.data.datasets[0].data = [totalIngresos, totalEgresos];
  pieBalance.update();
}

function actualizarBarChart() {
  const resumen = {};
  transacciones.forEach((tx) => {
    const d = new Date(tx.fechaISO);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    if (!resumen[key]) resumen[key] = { ingresos: 0, egresos: 0, date: d };
    if (tx.tipo === "ingreso") resumen[key].ingresos += tx.monto;
    else resumen[key].egresos += tx.monto;
  });

  const items = Object.values(resumen).sort((a, b) => a.date - b.date);
  const labels = items.map((it) => it.date.toLocaleString("default", { month: "short", year: "numeric" }));
  const ingresos = items.map((it) => it.ingresos);
  const egresos = items.map((it) => it.egresos);

  barChart.data.labels = labels;
  barChart.data.datasets[0].data = ingresos;
  barChart.data.datasets[1].data = egresos;
  barChart.update();
}

function actualizarMetricas() {
  if (transacciones.length === 0) return;

  let totalIngresos = 0;
  let totalEgresos = 0;
  const categoriasEgreso = {};

  transacciones.forEach(tx => {
    if (tx.tipo === "ingreso") {
      totalIngresos += tx.monto;
    } else {
      totalEgresos += tx.monto;
      categoriasEgreso[tx.categoria] = (categoriasEgreso[tx.categoria] || 0) + tx.monto;
    }
  });
  
  const porcentajeGastado = totalIngresos > 0 ? ((totalEgresos / totalIngresos) * 100).toFixed(1) : 0;

  let catMax = "-";
  let maxGasto = 0;
  for (let [cat, monto] of Object.entries(categoriasEgreso)) {
    if (monto > maxGasto) {
      maxGasto = monto;
      catMax = cat;
    }
  }

  const ahorro = totalIngresos - totalEgresos;

  document.getElementById("metric-porcentaje").textContent = `Se gastó el ${porcentajeGastado}% de los ingresos.`;
  document.getElementById("metric-categoria").textContent = `Categoría con más gasto: ${catMax}`;
  document.getElementById("metric-ahorro").textContent = `Ahorro acumulado: $${ahorro.toLocaleString()}`;
}

function generarColores(n) {
  const base = ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0", "#03A9F4", "#FFC107"];
  return Array.from({ length: n }, (_, i) => base[i % base.length]);
}

actualizarMetricas();
renderAll();