Rendering optimization to-do list:
- [ ] Pre-draw the entire map on a separate canvas, then render the appropriate section.
- [ ] Use multiple canvases. One for hexes, one for objects. Animations / re-rendering would only need to take place on the object canvas. Combined with above method, the underlying tile canvas need only be rendered one time.

Other:
- [ ] GameMap tile discovery should change from simple flag to array of flags (one for each player)
