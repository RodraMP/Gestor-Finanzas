const ctxIngresos = document.getElementById("pieIngresos").getContext("2d");
const pieIngresos = new Chart(ctxIngresos, {
  type: "pie",
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      chartJsPlugin3d: {
        enabled: true,
        depth: 30,
        viewDistance: 25,
        angle: 40
      }
    }
  }
});

const ctxEgresos = document.getElementById("pieEgresos").getContext("2d");
const pieEgresos = new Chart(ctxEgresos, {
  type: "pie",
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      chartJsPlugin3d: {
        enabled: true,
        depth: 30,
        viewDistance: 25,
        angle: 40
      }
    }
  }
});

const ctxBalance = document.getElementById("pieBalance").getContext("2d");
const pieBalance = new Chart(ctxBalance, {
  type: "pie",
  data: {
    labels: ["Ingresos", "Egresos"],
    datasets: [{
      data: [0, 0],
      backgroundColor: ["#4CAF50", "#F44336"]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      chartJsPlugin3d: {
        enabled: true,
        depth: 30,
        viewDistance: 25,
        angle: 40
      }
    }
  }
});

const ctxBar = document.getElementById("barChart").getContext("2d");
const barChart = new Chart(ctxBar, {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      { label: "Ingresos", data: [], backgroundColor: "#4CAF50" },
      { label: "Egresos", data: [], backgroundColor: "#F44336" }
    ]
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: {
      legend: { position: "top" }
    }
  }
});
