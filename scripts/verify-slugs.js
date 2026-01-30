/**
 * Vérification des slugs après intégration
 */

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./data/clubs_libertins_verified.json', 'utf-8'));

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Générer les slugs comme le ferait transformClub
const slugs = data.clubs.map(c => {
  const nom = c.nom || 'Club sans nom';
  const ville = c.ville || 'Ville inconnue';
  return c.slug || slugify(nom + '-' + ville);
});

const uniqueSlugs = new Set(slugs);
console.log('Total clubs:', data.clubs.length);
console.log('Slugs uniques:', uniqueSlugs.size);

const duplicates = [];
const seen = {};
slugs.forEach((s, i) => {
  if (seen[s]) {
    duplicates.push({ slug: s, club: data.clubs[i] });
  }
  seen[s] = true;
});

if (duplicates.length > 0) {
  console.log('\nDoublons de slug:', duplicates.length);
  duplicates.slice(0, 10).forEach(d => {
    console.log('  ' + d.slug + ' (' + d.club.nom + ', ' + d.club.ville + ')');
  });
} else {
  console.log('\nAucun doublon de slug!');
}

// Afficher quelques nouveaux clubs
console.log('\nExemples de nouveaux clubs avec slugs fgpeople:');
data.clubs.filter(c => c.id.startsWith('FG')).slice(0, 5).forEach(c => {
  console.log('  ' + c.id + ': ' + c.slug);
});
