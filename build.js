import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

const currentYear = new Date().getFullYear();  // Récupérer l'année actuelle
const authorName = 'Omar BARAZE';  // Remplace par le nom de l'auteur

const views = [
  { src: 'views/index.ejs', dest: 'public/index.html', data: { isAvailable: true, lang: 'fr', message: 'success', year: currentYear, author: authorName } },
  { src: 'views/index-en.ejs', dest: 'public/index-en.html', data: { isAvailable: false, lang: 'en', message: 'success', year: currentYear, author: authorName } }
];

views.forEach(view => {
  ejs.renderFile(view.src, view.data, (err, html) => {
    if (err) {
      console.error(`Erreur lors du rendu de ${view.src}:`, err);
    } else {
      fs.writeFileSync(path.join(path.resolve(), view.dest), html);
      console.log(`Fichier ${view.dest} généré.`);
    }
  });
});

