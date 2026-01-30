const data = require('../data/clubs_libertins_verified.json');

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/Ã©/g, 'é')
    .replace(/Ã¨/g, 'è')
    .replace(/Ãª/g, 'ê')
    .replace(/Ã /g, 'à')
    .replace(/Ã¢/g, 'â')
    .replace(/Ã´/g, 'ô')
    .replace(/Ã®/g, 'î')
    .replace(/Ã¹/g, 'ù')
    .replace(/Ã§/g, 'ç')
    .replace(/Ã«/g, 'ë')
    .replace(/Ã¯/g, 'ï')
    .replace(/Ã¼/g, 'ü')
    .trim();
}

const slugs = data.clubs.map(c => slugify(cleanText(c.nom) + '-' + cleanText(c.ville)));
const duplicates = slugs.filter((s, i) => slugs.indexOf(s) !== i);

console.log('Total clubs:', data.clubs.length);
console.log('Unique slugs:', new Set(slugs).size);
console.log('Duplicates:', duplicates.length);

if (duplicates.length > 0) {
  console.log('\nDuplicate slugs:');
  const uniqueDuplicates = [...new Set(duplicates)];
  uniqueDuplicates.forEach(slug => {
    const clubs = data.clubs.filter(c => slugify(cleanText(c.nom) + '-' + cleanText(c.ville)) === slug);
    console.log(`  - ${slug}:`);
    clubs.forEach(c => console.log(`      ID: ${c.id}, Nom: ${c.nom}, Ville: ${c.ville}`));
  });
}
