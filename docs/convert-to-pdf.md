# How to Convert Architecture Document to PDF

## Option 1: Using Online Tools (Easiest)

1. **Markdown to PDF Online**:
   - Go to https://www.markdowntopdf.com/
   - Upload `system-architecture-food-delivery.md`
   - Download PDF

2. **Dillinger**:
   - Go to https://dillinger.io/
   - Copy content from `system-architecture-food-delivery.md`
   - Click "Export as" → "PDF"

3. **StackEdit**:
   - Go to https://stackedit.io/
   - Paste markdown content
   - Export as PDF

## Option 2: Using VS Code Extension

1. Install "Markdown PDF" extension in VS Code
2. Open `system-architecture-food-delivery.md`
3. Right-click → "Markdown PDF: Export (pdf)"

## Option 3: Using Pandoc (Command Line)

```bash
# Install Pandoc (if not installed)
# Windows: choco install pandoc
# Mac: brew install pandoc
# Linux: sudo apt-get install pandoc

# Convert to PDF
pandoc system-architecture-food-delivery.md -o system-architecture.pdf --pdf-engine=wkhtmltopdf
```

## Option 4: Using Node.js (md-to-pdf)

```bash
# Install globally
npm install -g md-to-pdf

# Convert to PDF
md-to-pdf system-architecture-food-delivery.md
```

## Option 5: Copy to Excalidraw

1. Go to https://excalidraw.com/
2. Use the flowcharts from `system-architecture-flowcharts.md` as reference
3. Draw the diagrams in Excalidraw
4. Export as PDF from Excalidraw

## Recommended Approach for Interview

1. **Use Excalidraw** for visual diagrams:
   - Draw the architecture diagrams
   - Draw the workflow flowcharts
   - Export each as PDF

2. **Use Markdown to PDF** for documentation:
   - Convert `system-architecture-food-delivery.md` to PDF
   - This gives you detailed explanations

3. **Combine both**:
   - Visual diagrams from Excalidraw
   - Detailed documentation from markdown PDF
   - Perfect for interview presentation

