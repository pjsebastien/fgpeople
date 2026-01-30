/**
 * Analyse approfondie des doublons
 */

const data = require('../data/clubs_libertins_verified.json');

function normalize(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

console.log('='.repeat(70));
console.log('ANALYSE APPROFONDIE DES DOUBLONS');
console.log('='.repeat(70));
console.log(`\nTotal clubs: ${data.clubs.length}\n`);

// 1. Doublons par nom normalisé + ville
console.log('--- DOUBLONS PAR NOM + VILLE ---\n');
const byNameCity = {};
data.clubs.forEach(club => {
  const key = normalize(club.nom) + '|' + normalize(club.ville);
  if (!byNameCity[key]) byNameCity[key] = [];
  byNameCity[key].push(club);
});

let count1 = 0;
Object.entries(byNameCity).forEach(([key, clubs]) => {
  if (clubs.length > 1) {
    count1++;
    console.log(`DOUBLON: "${key}"`);
    clubs.forEach(c => {
      console.log(`  - ${c.id} "${c.nom}" (${c.ville}) - ${c.slug || 'pas de slug'}`);
    });
    console.log('');
  }
});
console.log(`Total doublons nom+ville: ${count1}\n`);

// 2. Doublons par nom similaire (sans la ville)
console.log('--- NOMS TRÈS SIMILAIRES (même ville) ---\n');
const byCity = {};
data.clubs.forEach(club => {
  const city = normalize(club.ville);
  if (!byCity[city]) byCity[city] = [];
  byCity[city].push(club);
});

let count2 = 0;
Object.entries(byCity).forEach(([city, clubs]) => {
  if (clubs.length < 2) return;

  // Comparer chaque paire
  for (let i = 0; i < clubs.length; i++) {
    for (let j = i + 1; j < clubs.length; j++) {
      const name1 = normalize(clubs[i].nom);
      const name2 = normalize(clubs[j].nom);

      // Vérifier si un nom contient l'autre ou très similaire
      if (name1.includes(name2) || name2.includes(name1) ||
          levenshteinSimilarity(name1, name2) > 0.7) {
        count2++;
        console.log(`SIMILAIRES dans ${city}:`);
        console.log(`  - ${clubs[i].id} "${clubs[i].nom}"`);
        console.log(`  - ${clubs[j].id} "${clubs[j].nom}"`);
        console.log('');
      }
    }
  }
});
console.log(`Total noms similaires: ${count2}\n`);

// 3. Doublons par adresse + ville
console.log('--- DOUBLONS PAR ADRESSE + VILLE ---\n');
const byAddressCity = {};
data.clubs.forEach(club => {
  if (!club.adresse) return;
  const key = normalize(club.adresse) + '|' + normalize(club.ville);
  if (!byAddressCity[key]) byAddressCity[key] = [];
  byAddressCity[key].push(club);
});

let count3 = 0;
Object.entries(byAddressCity).forEach(([key, clubs]) => {
  if (clubs.length > 1) {
    count3++;
    console.log(`MÊME ADRESSE: "${key}"`);
    clubs.forEach(c => {
      console.log(`  - ${c.id} "${c.nom}"`);
    });
    console.log('');
  }
});
console.log(`Total doublons adresse+ville: ${count3}\n`);

// 4. Doublons par site web
console.log('--- DOUBLONS PAR SITE WEB ---\n');
const byWebsite = {};
data.clubs.forEach(club => {
  if (!club.site_web) return;
  const key = normalize(club.site_web.replace(/https?:\/\/(www\.)?/, '').replace(/\/$/, ''));
  if (!byWebsite[key]) byWebsite[key] = [];
  byWebsite[key].push(club);
});

let count4 = 0;
Object.entries(byWebsite).forEach(([key, clubs]) => {
  if (clubs.length > 1) {
    count4++;
    console.log(`MÊME SITE WEB: "${key}"`);
    clubs.forEach(c => {
      console.log(`  - ${c.id} "${c.nom}" (${c.ville})`);
    });
    console.log('');
  }
});
console.log(`Total doublons site web: ${count4}\n`);

// 5. Doublons par téléphone
console.log('--- DOUBLONS PAR TÉLÉPHONE ---\n');
const byPhone = {};
data.clubs.forEach(club => {
  if (!club.telephone) return;
  const key = club.telephone.replace(/[^0-9]/g, '');
  if (key.length < 8) return; // Ignorer les numéros trop courts
  if (!byPhone[key]) byPhone[key] = [];
  byPhone[key].push(club);
});

let count5 = 0;
Object.entries(byPhone).forEach(([key, clubs]) => {
  if (clubs.length > 1) {
    count5++;
    console.log(`MÊME TÉLÉPHONE: "${key}"`);
    clubs.forEach(c => {
      console.log(`  - ${c.id} "${c.nom}" (${c.ville})`);
    });
    console.log('');
  }
});
console.log(`Total doublons téléphone: ${count5}\n`);

// Fonction de similarité Levenshtein simplifiée
function levenshteinSimilarity(s1, s2) {
  if (s1.length === 0 || s2.length === 0) return 0;

  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 1.0;

  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }

  return (longer.length - costs[s2.length]) / longer.length;
}

console.log('='.repeat(70));
console.log('RÉSUMÉ');
console.log('='.repeat(70));
console.log(`Doublons nom+ville: ${count1}`);
console.log(`Noms similaires: ${count2}`);
console.log(`Doublons adresse: ${count3}`);
console.log(`Doublons site web: ${count4}`);
console.log(`Doublons téléphone: ${count5}`);
