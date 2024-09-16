
# mysite-web

# Déploiement de l'application Node.js avec Express sur Heroku

Ce projet est une application web utilisant Node.js, Express pour le backend, et HTML, CSS, et JavaScript pour le frontend. Ce guide explique comment déployer cette application sur Heroku en utilisant GitHub Actions pour automatiser le déploiement.

## Prérequis

- Un compte Heroku ([Inscription](https://signup.heroku.com/))
- Un dépôt GitHub avec votre projet
- Le CLI Heroku installé localement ([Guide d'installation](https://devcenter.heroku.com/articles/heroku-cli))

## Installation des outils

1. Installez le CLI Heroku et connectez-vous :
   ```bash
   heroku login
Structure du projet
Assurez-vous que votre projet inclut les éléments suivants :

index.js : Point d'entrée de votre serveur Express.
public/ : Dossier contenant vos fichiers statiques (HTML, CSS, JS).
views/ : Dossier contenant vos templates si vous utilisez un moteur de rendu comme EJS.
package.json : Fichier listant les dépendances de votre projet.
Procfile : Fichier de configuration pour indiquer à Heroku comment démarrer votre application.
Exemple du fichier Procfile :
makefile
Copier le code
web: node index.js

Déploiement automatique avec GitHub Actions
1. Configurer GitHub Secrets
Dans GitHub, allez dans Settings > Secrets > Actions et ajoutez les secrets suivants :

HEROKU_API_KEY : Clé API Heroku (obtenue dans les paramètres de votre compte Heroku).
HEROKU_APP_NAME : Le nom de votre application Heroku (par exemple, monsite-web).

2. Configurer GitHub Actions
Créez un fichier deploy.yml dans le dossier .github/workflows avec le contenu suivant :

yaml
Copier le code
name: Deploy to Heroku

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v2

    - name: Set up Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'

    - name: Install dependencies
      run: npm install

    - name: Deploy to Heroku
      env:
        HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        HEROKU_APP_NAME: ${{ secrets.HEROKU_APP_NAME }}
      run: |
        heroku git:remote -a ${{ secrets.HEROKU_APP_NAME }}
        git push heroku main


3. Déployer l'application
Chaque fois que vous poussez du code sur la branche main, GitHub Actions déclenche automatiquement un déploiement sur Heroku.

bash
Copier le code
git add .
git commit -m "Déploiement initial"
git push origin main

Configuration du domaine personnalisé (facultatif)
Ajoutez votre domaine personnalisé dans Settings > Domains sur Heroku.
Configurez les DNS chez votre fournisseur de nom de domaine avec les informations fournies par Heroku.
Activez le SSL pour garantir la sécurité de votre site.

Commandes Heroku utiles
heroku login : Se connecter à Heroku.
heroku create : Créer une nouvelle application sur Heroku.
git push heroku main : Déployer l'application sur Heroku.
heroku logs --tail : Voir les logs de l'application en direct.
heroku open : Ouvrir l'application dans le navigateur.

Technologies utilisées
Backend : Node.js, Express
Frontend : HTML, CSS, JavaScript
Déploiement : Heroku, GitHub Actions
Auteur
Omar Baraze - Freelance ingénieur DevOps cloud AWS et développeur junior.

