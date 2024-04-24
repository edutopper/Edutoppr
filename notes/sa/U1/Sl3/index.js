// Function to render all pages of the PDF
function renderPDF(url, canvasContainer) {
    // Load the PDF document
    pdfjsLib.getDocument(url).promise.then(pdf => {
      // Loop through each page of the PDF
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        // Render the page
        pdf.getPage(pageNum).then(page => {
          const scale = 1.5;
          const viewport = page.getViewport({ scale });
  
          // Create a canvas element to display the page
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
  
          // Render the page content on the canvas
          const renderContext = {
            canvasContext: context,
            viewport: viewport
          };
          page.render(renderContext).promise.then(() => {
            // Append the canvas to the container
            canvasContainer.appendChild(canvas);
            
            // Disable right-click context menu on the canvas
            canvas.addEventListener('contextmenu', e => {
              e.preventDefault();
            });
          });
        });
      }
    });
  }
  
  // URL of the PDF file
  const pdfUrl = 'js.pdf';
  
  // Call the renderPDF function with the URL of the PDF and the container element
  renderPDF(pdfUrl, document.getElementById('pdf-viewer'));
  