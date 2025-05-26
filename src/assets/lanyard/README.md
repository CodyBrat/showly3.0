# Lanyard Component

## How It Works

The Lanyard ticket component in this project now generates textures programmatically, so you don't need to provide external asset files anymore.

### Changes from the Original Implementation:

1. **No External Files Required**
   - The component now creates textures directly in the code
   - Card textures are generated using HTML Canvas
   - Lanyard band textures are also generated using HTML Canvas

2. **3D Geometry**
   - Instead of using an imported GLB file, we now use built-in geometries from Three.js
   - The card uses a simple box geometry
   - The lanyard clip uses a cylinder geometry

### If You Want to Customize:

You can still customize the appearance by modifying the canvas drawing code in `src/components/Lanyard.jsx`:

1. **For the card texture**: Find the `createCardTexture` function and modify the drawing operations
2. **For the lanyard band**: Update the texture generation code in the Band component

## Original Implementation Requirements (No Longer Needed)

~~This directory should contain two important files for the Lanyard ticket component:~~

~~1. **card.glb** - A 3D model file for the ticket card~~
~~2. **lanyard.png** - A texture file for the lanyard band~~

The component now works out-of-the-box without requiring these files. 