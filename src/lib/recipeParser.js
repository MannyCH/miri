/**
 * Parses a recipe from the Bring app TXT export format.
 *
 * Expected sections (each header on its own line followed by content):
 *   Recipe Title: / Ingredients: / Instructions: / Servings: / Categories: / Website: (ignored)
 */
export function parseRecipeTxt(text) {
  const lines = text.split('\n').map((l) => l.trimEnd());

  const SECTION_MAP = {
    'Recipe Title:': 'title',
    'Ingredients:': 'ingredients',
    'Instructions:': 'directions',
    'Servings:': 'servings',
    'Categories:': 'categories',
    'Website:': 'website',
  };

  const result = { title: '', ingredients: [], directions: [], servings: '', categories: [] };
  let currentSection = null;
  let currentLines = [];

  const flush = () => {
    if (!currentSection || currentSection === 'website') return;
    const nonEmpty = currentLines.filter((l) => l.trim() !== '');

    if (currentSection === 'title') {
      result.title = nonEmpty.join(' ').trim();
    } else if (currentSection === 'ingredients') {
      result.ingredients = nonEmpty;
    } else if (currentSection === 'directions') {
      result.directions = nonEmpty;
    } else if (currentSection === 'servings') {
      result.servings = nonEmpty.join(' ').trim();
    } else if (currentSection === 'categories') {
      result.categories = nonEmpty
        .join(' ')
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
    }
    currentLines = [];
  };

  for (const line of lines) {
    const sectionKey = Object.keys(SECTION_MAP).find((k) => line.trim() === k || line.trim().startsWith(k + ' '));
    if (sectionKey) {
      flush();
      currentSection = SECTION_MAP[sectionKey];
      const inline = line.trim().slice(sectionKey.length).trim();
      if (inline) currentLines.push(inline);
      continue;
    }
    if (currentSection !== null) currentLines.push(line);
  }
  flush();

  return result;
}

/**
 * Compresses an image File to a JPEG data URL (max 800px wide, 0.75 quality).
 * Keeps storage size manageable when saving to the DB image_url field.
 */
export async function compressImageToDataUrl(file, maxWidth = 800, quality = 0.75) {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = objectUrl;
  });
}
