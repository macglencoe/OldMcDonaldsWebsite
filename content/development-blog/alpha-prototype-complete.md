# Alpha Prototype Complete!

The first phase of the project, a high-fidelity interactive prototype, is finally complete! This iteration is a sort of detailed rough draft showcasing the _design_ and _functionality_ of the website, mostly using placeholder content.
This version enables the stakeholders to explore a tidy, functional product and give me feedback on what should be adjusted or added next.

---
## Gallery
The final straw for this iteration was the addition of the Gallery page.
I've implemented a simple, maintainable gallery solution: the gallery automatically displays any images added to the `public/gallery/` directory. This means images can be uploaded directly into this folder, and they'll automatically appear with the next site build.

To achieve this functionality, the `/gallery` route is rendered dynamically on the server:
```jsx
export const dynamic = 'force-dynamic';
```
Rendering the page server-side allows the use of Node's built-in `fs` module to directly access files on the server:
```jsx
const galleryDir = path.join(process.cwd(), 'public', 'gallery');

let allFiles;

try {
    allFiles = await fs.readdir(galleryDir);
} catch (e) {
    console.error('Could not read gallery directory:', e)
    allFiles = [];
}

// Filter to only image files (jpg, png, gif, etc.)
const images = allFiles.filter((file) =>
    /\.(jpe?g|png|gif|webp|avif)$/i.test(file)
)
```

---
## What's next?
I'll be utilizing [Statsig](https://www.statsig.com) to implement feature flags which will allow us to hide and show seasonal Hero sections without interacting with code.

Currently the Hero section says:
> Open soon
> **Real Farm Fun**
> Available Through August 20:
> Book Your Event | Vendor Application

Clearly, this Hero is only really valid until fall, when it'll have to be changed to say something like "Open Now" and link to the Visit page.
By using feature flags, I can make and test predefined content for the Hero section, but have them hidden until they are enabled in Vercel.

This feature is being tracked as [Issue #2](https://github.com/macglencoe/OldMcDonaldsWebsite/issues/2)