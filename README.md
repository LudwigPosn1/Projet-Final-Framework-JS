# Campus Matériel

Application Angular de démonstration permettant aux étudiants de consulter et réserver le matériel du campus, et au gestionnaire d’administrer le catalogue et les réservations.

## Prérequis et lancement

- Node.js 20.19+, 22.12+ ou 24+
- npm

```bash
npm install
```

Ouvrir ensuite [http://localhost:4200](http://localhost:4200).

## Comptes de démonstration

La page de connexion propose trois profils à sélectionner :

| Nom            | Rôle         |
| -------------- | ------------ |
| Alice Martin   | Étudiante    |
| Yanis Bernard  | Étudiant     |
| Camille Dupont | Gestionnaire |

Il s’agit d’une simulation pédagogique : aucun mot de passe ni service d’authentification n’est connecté.

## Fonctionnalités

- Consultation du catalogue et recherche par nom.
- Filtrage du matériel par catégorie et consultation du détail.
- Réservation d’un équipement disponible par un étudiant ; un exemplaire ne peut être réservé qu’une fois à la fois.
- Consultation et annulation par l’étudiant de ses propres réservations.
- Accès gestionnaire pour ajouter, modifier ou supprimer un équipement et consulter/annuler les réservations.
- Interdiction de supprimer un équipement tant qu’il est réservé, avec confirmation avant suppression.
- Données et session conservées dans le stockage local du navigateur, avec restauration au rechargement.
- Routes protégées par rôle, écran d’accès refusé et page 404.
- Interfaces adaptatives pour mobile et ordinateur.

## Routes principales

| Route                     | Accès                |
| ------------------------- | -------------------- |
| `/login`                  | Public               |
| `/catalogue`              | Utilisateur connecté |
| `/materiels/:id`          | Utilisateur connecté |
| `/mes-reservations`       | Étudiant             |
| `/gestion`                | Gestionnaire         |
| `/gestion/nouveau`        | Gestionnaire         |
| `/gestion/:id/modifier`   | Gestionnaire         |
| `/materiels-reservations` | Gestionnaire         |
| `/acces-refuse`           | Public               |

## Choix et limites

Le projet est une application front-end pédagogique basée sur Angular standalone, le routeur Angular, des signals pour l’état partagé et les Reactive Forms. Les données sont stockées uniquement dans `localStorage` : elles sont propres au navigateur utilisé et ne sont pas partagées entre utilisateurs ou appareils. Le contrôle d’accès côté client et les comptes de démonstration ne remplacent pas une authentification ou une autorisation côté serveur.
