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
  uploadBox.addEventListener('click', () => fileInput.click());
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
    fileName = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      parseCSV(text);
    };
    reader.readAsText(file);
  }

  function parseCSV(text) {
    // Simple CSV parsing (no external lib)
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    if (headers.length !== 4 ||
        headers[0].toLowerCase() !== 'data' ||
        headers[1].toLowerCase() !== 'amount' ||
        headers[2].toLowerCase() !== 'description' ||
        headers[3].toLowerCase() !== 'category') {
      uploadError.textContent = 'CSV must have columns: Data, Amount, Description, Category.';
      return;
    }
    csvData = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim());
      return {
        Data: cols[0],
        Amount: cols[1],
        Description: cols[2],
        Category: cols[3]
      };
    });
    uploadSuccess.textContent = 'File staged and ready to use.';
    filterSection.classList.remove('hidden');
  }

  // Enable Continue button when both dropdowns are selected
  [categorySelect, monthSelect].forEach(sel => {
    sel.addEventListener('change', () => {
      continueBtn.disabled = !(categorySelect.value && monthSelect.value);
    });
  });

  continueBtn.addEventListener('click', () => {
    renderTable();
    tableSection.classList.remove('hidden');
    continueBtn.disabled = true;
  });

  function renderTable() {
    if (!csvData) return;
    let html = '<thead><tr><th>Data</th><th>Amount</th><th>Description</th><th>Category</th></tr></thead><tbody>';
    csvData.forEach(row => {
      html += `<tr>
        <td>${row.Data}</td>
        <td>${row.Amount}</td>
        <td>${row.Description}</td>
        <td>${row.Category}</td>
      </tr>`;
    });s
    html += '</tbody>';
    csvTable.innerHTML = html;
  }

  processBtn.addEventListener('click', () => {
    // Simulate API call/processing
    const monthNum = monthSelect.value;
    const categoryType = categorySelect.value;
    const command = `python3 categorize_transactions.py /path/to/${fileName} ${monthNum} ${categoryType}`;
    alert(`Would send to API: ${command}`);
    // Here you would send the data to your backend/API
  });
});