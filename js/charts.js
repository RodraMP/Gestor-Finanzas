// Pie chart: distribución de gastos del mes
const ctxPie = document.getElementById("pieChart").getContext("2d");
const pieChart = new Chart(ctxPie, {
  type: "pie",
  data: {
    labels: ["Alimentación", "Transporte", "Ocio"],
    datasets: [{
      data: [3000, 1500, 500],
      backgroundColor: ["#4CAF50", "#2196F3", "#FF9800"]
    }]
  }
});

// Bar chart: ingresos vs egresos de meses anteriores
const ctxBar = document.getElementById("barChart").getContext("2d");
const barChart = new Chart(ctxBar, {
  type: "bar",
  data: {
    labels: ["Enero", "Febrero", "Marzo"],
    datasets: [
      {
        label: "Ingresos",
        data: [50000, 60000, 55000],
        backgroundColor: "#4CAF50"
      },
      {
        label: "Egresos",
        data: [35000, 45000, 40000],
        backgroundColor: "#F44336"
      }
    ]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});
