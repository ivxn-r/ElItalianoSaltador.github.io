export async function loadAssets() {
  const characterImages = ['Momo', 'ElBana', 'Especial', 'Davo', 'MomoSkin2'];
  for (const name of characterImages) {
    const img = new Image();
    img.src = `./assets/${name}.png`;
    await new Promise(resolve => {
      img.onload = resolve;
    });
    window[`${name}Img`] = img;
  }
}
