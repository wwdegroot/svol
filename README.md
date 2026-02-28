# Svol
Sveltekit and openlayers component library. Made with svelte 5.

## Installation
```bash
pnpm add svol
```

### Peer Dependencies
Ensure you have the following installed in your project:
- svelte >= 5.16.0

## Components
- OpenlayersMap.svelte

### Sources
- WFS
- Dynamic GeoJSON
- Flatgeobuf

### Ui Controls
- BboxExport.svelte
- WidgetGroup.svelte
- Expand.svelte
- GoToXY.svelte
- Print.svelte
- ShowXY.svelte
- SimpleInfoPopup.svelte
- SimpleFeatureInfoTable.svelte

## Styling & Tailwind CSS Setup

svol is built with Tailwind CSS v4. To ensure the components look correct in your project, you have two options for handling styles.

### Pre-compiled CSS
If you aren't using Tailwind CSS in your project, or you just want to get up and running quickly, import the pre-built stylesheet in your root +layout.svelte:
```svelte
<script>
  import 'svol/styles.css';
</script>
```

### Tailwind v4 
If you are already using Tailwind CSS v4 in your project, this is the recommended method. It allows Tailwind to scan svol for used classes, ensuring your final CSS bundle remains tiny and your theme variables are shared.

1. Skip the CSS import from Option 1.
2. Add the @source directive to your global CSS file (usually src/app.css):
```css
@import "tailwindcss";

/* 
    Tell Tailwind v4 to scan the svol library for classes. This ensures only the styles you actually use are bundled.
*/
@source "../node_modules/svol/dist/**/*.svelte";
```

### Customizing the Theme
Because svol uses standard Tailwind tokens, it will automatically inherit your project's theme. If you define a custom primary color, svol components will use it:


## Acknowledgments
- ui components made with [shadcn-svelte](https://next.shadcn-svelte.com/)
- maps displayed with [OpenLayers](https://openlayers.org/)
- icons used from [Lucide](https://lucide.dev)
