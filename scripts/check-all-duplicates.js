const data = require('../data/clubs_libertins_verified.json');
const clubs = data.clubs;

console.log('=== VÉRIFICATION DES DOUBLONS ===\n');
console.log('Total clubs:', clubs.length);

// 1. Vérifier les IDs en double
const ids = clubs.map(c => c.id);
const duplicateIds = ids.filter((id, i) => ids.indexOf(id) !== i);
console.log('\n1. IDs en double:', duplicateIds.length > 0 ? duplicateIds : 'Aucun');

// 2. Vérifier les noms identiques
const names = clubs.map(c => c.nom?.toLowerCase().trim());
const duplicateNames = names.filter((n, i) => n && names.indexOf(n) !== i);
const uniqueDupNames = [...new Set(duplicateNames)];
if (uniqueDupNames.length > 0) {
  console.log('\n2. Noms identiques trouvés:');
  uniqueDupNames.forEach(name => {
    const matching = clubs.filter(c => c.nom?.toLowerCase().trim() === name);
    console.log('  -', name, '(' + matching.length + ' occurrences):');
    matching.forEach(c => console.log('     ID:', c.id, '| Ville:', c.ville));
  });
} else {
  console.log('\n2. Noms identiques: Aucun');
}

// 3. Vérifier les téléphones en double (hors vides)
const phones = clubs.filter(c => c.telephone).map(c => c.telephone.replace(/\s/g, ''));
const duplicatePhones = phones.filter((p, i) => phones.indexOf(p) !== i);
const uniqueDupPhones = [...new Set(duplicatePhones)];
if (uniqueDupPhones.length > 0) {
  console.log('\n3. Téléphones en double:');
  uniqueDupPhones.forEach(phone => {
    const matching = clubs.filter(c => c.telephone?.replace(/\s/g, '') === phone);
    console.log('  -', phone, ':');
    matching.forEach(c => console.log('     ', c.nom, '|', c.ville));
  });
} else {
  console.log('\n3. Téléphones en double: Aucun');
}

// 4. Vérifier les sites web en double (hors vides)
const sites = clubs.filter(c => c.site_web).map(c => c.site_web.toLowerCase().replace(/\/$/, ''));
const duplicateSites = sites.filter((s, i) => sites.indexOf(s) !== i);
const uniqueDupSites = [...new Set(duplicateSites)];
if (uniqueDupSites.length > 0) {
  console.log('\n4. Sites web en double:');
  uniqueDupSites.slice(0, 10).forEach(site => {
    const matching = clubs.filter(c => c.site_web?.toLowerCase().replace(/\/$/, '') === site);
    console.log('  -', site, ':');
    matching.forEach(c => console.log('     ', c.nom, '|', c.ville, '| ID:', c.id));
  });
  if (uniqueDupSites.length > 10) console.log('  ... et', uniqueDupSites.length - 10, 'autres');
} else {
  console.log('\n4. Sites web en double: Aucun');
}

// 5. Vérifier les adresses identiques dans la même ville
const addressCity = clubs.filter(c => c.adresse && c.ville).map(c => (c.adresse + '|' + c.ville).toLowerCase());
const duplicateAddr = addressCity.filter((a, i) => addressCity.indexOf(a) !== i);
const uniqueDupAddr = [...new Set(duplicateAddr)];
if (uniqueDupAddr.length > 0) {
  console.log('\n5. Mêmes adresses dans la même ville:');
  uniqueDupAddr.forEach(addr => {
    const [adresse, ville] = addr.split('|');
    const matching = clubs.filter(c => c.adresse?.toLowerCase() === adresse && c.ville?.toLowerCase() === ville);
    console.log('  -', adresse, '(', ville, '):');
    matching.forEach(c => console.log('     ', c.nom, '| ID:', c.id));
  });
} else {
  console.log('\n5. Mêmes adresses: Aucune');
}

// 6. Recherche de noms très similaires (potentiels doublons avec typos)
console.log('\n6. Noms très similaires (potentiels doublons):');
function similarity(s1, s2) {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  if (longer.length === 0) return 1.0;
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j;
      else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1))
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return (longer.length - costs[s2.length]) / longer.length;
}

const checked = new Set();
let similarFound = 0;
for (let i = 0; i < clubs.length && similarFound < 20; i++) {
  for (let j = i + 1; j < clubs.length && similarFound < 20; j++) {
    const name1 = clubs[i].nom?.toLowerCase().trim();
    const name2 = clubs[j].nom?.toLowerCase().trim();
    if (!name1 || !name2) continue;

    const key = [name1, name2].sort().join('|');
    if (checked.has(key)) continue;
    checked.add(key);

    const sim = similarity(name1, name2);
    // Très similaires (>85%) mais pas identiques
    if (sim > 0.85 && sim < 1) {
      console.log('  - Similarité', Math.round(sim * 100) + '%:');
      console.log('     ', clubs[i].nom, '|', clubs[i].ville, '| ID:', clubs[i].id);
      console.log('     ', clubs[j].nom, '|', clubs[j].ville, '| ID:', clubs[j].id);
      similarFound++;
    }
  }
}
if (similarFound === 0) console.log('  Aucun nom très similaire trouvé');

console.log('\n=== FIN DE LA VÉRIFICATION ===');
