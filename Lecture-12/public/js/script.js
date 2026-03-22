document.getElementById('imageInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  
  if (file && file.size > maxSize) {
    alert('File size must be less than 5MB!');
    e.target.value = ''; // Clear input
    return false;
  }
});