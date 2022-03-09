# 3D CSS Training Room
[View the Current Live Version (Development)](https://3dcsstrainingroom.tnharvey.repl.co/ "3D CSS Training Room live of Replit")

This is a (relatively) simple concept for a 3D room using (mostly) HTML and CSS. It grew to use JS to load models rather than loading and maintaining them manually.

The intent is to allow for the creation of simple scenarios in which users can have simple interactions with a basic 3D environment. Due to the limitations of CSS 3D transforms on divs, this is so far limited to very simple geometries (cubes, cylinders, prisms, pyramids), and I found that using [TriDiv](https://www.tridiv.com "TriDiv 3D CSS Modeling") to build the models expedited the modeling process.

### Current Features:
- Load models from JS (not currently automated)
- Keyboard and click based rotation of room
- Additional camera views to approach objects in room
- Click interactions with modal dialogs
- Skinning/textures on models and room via images or sprite atlas

## Areas for Expansion

### Dev Controls Data
- Generate object of views
  - Change listeners to set views based on this object instead
- Generate object of all models with all subobjects

### Controls
- On interface control, generate dropdown list to select item to adjust
- Secondary dropdown to select subobject (optional)
- Sliders disabled until selection
- Sliders for position and rotation,
- Show/Hide Toggle
- Skins toggle
- Geometry toggle
- Rotation animation toggle?
- Copy code to clipboard
- Reset to default