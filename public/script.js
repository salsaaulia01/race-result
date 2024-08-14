document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append('file', document.getElementById('upload').files[0]);

  fetch('/upload', {
      method: 'POST',
      body: formData
  })
  .then(response => response.text())
  .then(data => {
      alert(data);
      // Hide the upload form after successful upload
      document.getElementById('uploadForm').style.display = 'none';
  })
  .catch(error => {
      console.error('Error:', error);
  });
});

function searchResult() {
  const bibNumber = document.getElementById('bibNumber').value;
  window.location.href = `result.html?bib=${bibNumber}`;
}

// Show the upload form if the user hasn't uploaded a file yet
window.onload = function() {
  const urlParams = new URLSearchParams(window.location.search);
  const uploaded = urlParams.get('uploaded');
  if (!uploaded) {
      document.getElementById('uploadForm').style.display = 'block';
  }
}
