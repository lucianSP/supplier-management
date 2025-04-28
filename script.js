const form = document.getElementById("supplier-form");
const tableBody = document.querySelector("#suppliers-table tbody");
const exportBtn = document.getElementById("export");

let suppliers = JSON.parse(localStorage.getItem("suppliers")) || [];
let editIndex = -1;

function renderTable() {
  tableBody.innerHTML = "";
  suppliers.forEach((supplier, index) => {
    const row = document.createElement("tr");
    Object.values(supplier).forEach(val => {
      const td = document.createElement("td");
      td.textContent = val;
      row.appendChild(td);
    });

    const actions = document.createElement("td");
    actions.innerHTML = `
      <button class="edit" onclick="editSupplier(${index})">Edit</button>
      <button class="delete" onclick="deleteSupplier(${index})">Delete</button>
    `;
    row.appendChild(actions);
    tableBody.appendChild(row);
  });
}

function getFormData() {
  return {
    nume: document.getElementById("nume").value,
    cui: document.getElementById("cui").value,
    rc: document.getElementById("rc").value,
    adresa: document.getElementById("adresa").value,
    localitate: document.getElementById("localitate").value,
    tara: document.getElementById("tara").value,
    contact: document.getElementById("contact").value,
    email: document.getElementById("email").value,
    telefon: document.getElementById("telefon").value,
    plata: document.getElementById("plata").value,
    categorie: document.getElementById("categorie").value,
    iban: document.getElementById("iban").value,
    banca: document.getElementById("banca").value,
    observatii: document.getElementById("observatii").value
  };
}

function setFormData(data) {
  for (let key in data) {
    const field = document.getElementById(key);
    if (field) field.value = data[key];
  }
}

function clearForm() {
  form.reset();
  editIndex = -1;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = getFormData();
  if (editIndex === -1) {
    suppliers.push(data);
  } else {
    suppliers[editIndex] = data;
  }
  localStorage.setItem("suppliers", JSON.stringify(suppliers));
  renderTable();
  clearForm();
});

function editSupplier(index) {
  setFormData(suppliers[index]);
  editIndex = index;
}

function deleteSupplier(index) {
  if (confirm("Are you sure you want to delete this supplier?")) {
    suppliers.splice(index, 1);
    localStorage.setItem("suppliers", JSON.stringify(suppliers));
    renderTable();
  }
}

function exportToCSV() {
  if (suppliers.length === 0) return;

  const headers = [
    "Supplier Name", "Tax Code", "Registration No.", "Address", "City", "Country",
    "Contact Person", "Email", "Phone", "Payment Terms", "Product Category",
    "IBAN", "Bank", "Notes"
  ];

  const rows = suppliers.map(s => [
    s.nume, s.cui, s.rc, s.adresa, s.localitate, s.tara, s.contact, s.email,
    s.telefon, s.plata, s.categorie, s.iban, s.banca, s.observatii
  ]);

  const csvContent = [headers, ...rows].map(row => 
    row.map(field => {
      if (typeof field === "string") {
        field = field.replace(/"/g, '""'); // escape ghilimelele din interior
      }
      return `"${field}"`; // fiecare câmp între "..."
    }).join(",")
  ).join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "suppliers.csv";
  link.click();
}

exportBtn.addEventListener("click", exportToCSV);

renderTable();


