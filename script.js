document.addEventListener('DOMContentLoaded', () => {
  const uploadBox = document.getElementById('upload-box');
  const fileInput = document.getElementById('file-upload');
  const uploadError = document.getElementById('upload-error');
  const uploadSuccess = document.getElementById('upload-success');
  const filterSection = document.getElementById('filter-section');
  const categorySelect = document.getElementById('category-select');
  const monthSelect = document.getElementById('month-select');
  const continueBtn = document.getElementById('continue-btn');
  const tableSection = document.getElementById('table-section');
  const csvTable = document.getElementById('csv-table');
  const processBtn = document.getElementById('process-btn');

  let csvData = null;
  let fileName = '';

    // add this function
  function stageFile(file) {
    fileName = file.name;
    csvData = null; // not parsing now, only staging
    uploadSuccess.innerHTML = `File <strong>${fileName}</strong> staged successfully. You can now select the filters.`;
    filterSection.classList.remove('hidden');
    categorySelect.disabled = false;
    monthSelect.disabled = false;
    continueBtn.disabled = !(categorySelect.value && monthSelect.value);
  }

  // Drag & Drop handlers
  uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('dragover');
  });
  uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
  });
  uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    handleFile(e.dataTransfer.files[0]);
  });
  // uploadBox.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
  });

  function handleFile(file) {
    uploadError.textContent = '';
    uploadSuccess.textContent = '';
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv')) {
      uploadError.textContent = 'Please upload a valid CSV file.';
      return;
    }
    // Stage the file without reading/parsing it
    stageFile(file);
    // fileName = file.name; // Store the file name for later use
    // uploadSuccess.textContent = `File ${fileName} staged successfully. You can now select the filters.`;
    // filterSection.classList.remove('hidden');
    // continueBtn.disabled = true; // Disable continue button until filters are selected
    // Uncomment the following lines if you want to read and parse the CSV file immediately
    // const reader = new FileReader();
    // reader.onload = function(e) {
    //   const text = e.target.result;
    //   parseCSV(text);
    // };
    // reader.readAsText(file);
    // fileName = file.name;
    // const reader = new FileReader();
    // reader.onload = function(e) {
    //   const text = e.target.result;
    //   parseCSV(text);
    // };
    // reader.readAsText(file);
  }



//   function parseCSV(text) {
//   // Use PapaParse for robust CSV parsing
//   const result = Papa.parse(text, {
//     header: true,
//     skipEmptyLines: true,
//     trimHeaders: true
//   });
//   if (result.errors.length) {
//     uploadError.textContent = 'Error parsing CSV file.';
//     return;
//   }
//   const headers = result.meta.fields.map(h => h.trim().toLowerCase());
//   if (
//     headers.length !== 4 ||
//     (headers[0] !== 'date') ||
//     headers[1] !== 'amount' ||
//     headers[2] !== 'description' ||
//     headers[3] !== 'category'
//   ) {
//     uploadError.textContent = 'CSV must have columns: Date (or Data), Amount, Description, Category.';
//     return;
//   }
//   csvData = result.data.map(row => ({
//     Data: row[Object.keys(row)[0]],
//     Amount: row[Object.keys(row)[1]],
//     Description: row[Object.keys(row)[2]],
//     Category: row[Object.keys(row)[3]]
//   }));
//   uploadSuccess.textContent = 'File staged and ready to use.';
//   filterSection.classList.remove('hidden');
// }

  // Enable Continue button when both dropdowns are selected
  [categorySelect, monthSelect].forEach(sel => {
    sel.addEventListener('change', () => {
      continueBtn.disabled = !(categorySelect.value && monthSelect.value);
    });
  });

  continueBtn.addEventListener('click', () => {
    // // renderTable();
    // tableSection.classList.remove('hidden');
    uploadSuccess.textContent = 'Ready to proceed. Table rendering is temporarily disabled.'; 
    continueBtn.disabled = true;
  });

// function renderTable() {
//   if (!csvData) return;
//   let html = '<thead><tr><th>Data</th><th>Amount</th><th>Description</th><th>Category</th></tr></thead><tbody>';
//   csvData.forEach(row => {
//     html += `<tr>
//       <td>${row.Data}</td>
//       <td>${row.Amount}</td>
//       <td>${row.Description}</td>
//       <td>${row.Category}</td>
//     </tr>`;
//   }); // <-- removed stray 's' here
//   html += '</tbody>';
//   csvTable.innerHTML = html;
// }

  processBtn.addEventListener('click', () => {
    // Simulate API call/processing
    const monthNum = monthSelect.value;
    const categoryType = categorySelect.value;
    const command = `python3 categorize_transactions.py /path/to/${fileName} ${monthNum} ${categoryType}`;
    alert(`Would send to API: ${command}`);
    // Here you would send the data to your backend/API
  });
});