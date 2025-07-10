# My Sheets Frontend

A spreadsheet-like React app styled to match Google Sheets/Airtable, built with Vite and TypeScript. Features include:

- CSS Grid-based table (no `<table>`), with always-aligned rows/columns
- Editable cells with keyboard navigation
- Column resizing (drag to resize, persistent widths)
- Consistent grid lines (gray-200)
- Modular, DRY React components
- Extensible: add columns, more features possible

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the app:**
   ```sh
   npm run dev
   ```
3. **Open in browser:**
   Visit [http://localhost:5173](http://localhost:5173)

## Project Structure

- `src/sections/TableSection.tsx` — Main spreadsheet UI
- `src/styles/Spreadsheet.css` — Main spreadsheet styles
- `src/components/ui/` — Reusable UI components
- `public/` — Static assets

## Features

- **Editable cells:** Click or tab to edit any cell
- **Column resizing:** Drag the resizer between columns
- **Consistent grid lines:** All lines use Tailwind gray-200 (`#e5e7eb`)
- **Add columns:** Click the `+` in the header to add columns
- **Modern, clean UI:** Matches Figma/Airtable/Sheets look

## Customization
- Change colors, fonts, or add features in `Spreadsheet.css` and `TableSection.tsx`
- Add more spreadsheet features as needed

## License
MIT
