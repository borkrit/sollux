# Project Rules (AGENTS.md)

## Tech Stack
- Semantic HTML5, Tailwind CSS, Vanilla JavaScript (ES6+).
- Keep the project zero-build or simple to run locally (e.g. Tailwind via CDN or minimal CLI build documented in `README.md`).

## Assets & Figma MCP Workflow
- Use `Framelink_Figma_MCP` (`get_figma_data`, `download_figma_images`) to inspect layout, typography, colors, spacing, and assets.
- **Image paths rule:** When calling `download_figma_images`, always pass an **absolute local directory path** (e.g., `/full/path/to/project/assets/images`). When referencing downloaded images in `index.html` or CSS, always use **relative paths** (e.g., `./assets/images/card-1.webp`).

## Animation & Interaction Rules
- Short interactions (hover, focus): `200–250 ms`.
- Larger transitions / zooms: `500–800 ms`.
- Easing: `ease-in-out` (`cubic-bezier(0.4, 0, 0.2, 1)`) everywhere by default; `ease-out` for scale/zoom animations.
- Performance: animate `transform` and `opacity` wherever possible (use `transition-colors` only when a color change is explicitly specified).