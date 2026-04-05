# Context de projet

> Dans le quotidien des entreprises et des freelances, la gestion des
> factures fournisseurs devient rapidement complexe. Il est souvent
> difficile de suivre les montants dépensés, d'identifier les factures
> en attente ou en retard, et d'avoir une vision claire des relations
> avec les fournisseurs.
>
> L'objectif de ce projet est de développer une API backend sécurisée
> permettant de :

- Gérer une liste de fournisseursEnregistrer et suivre les factures
  reçues

- Effectuer des paiements partiels ou complets

- Suivre l'état des factures (payée, partiellement payée, en retard...)

- Analyser les dépenses par fournisseur

> Cette API permettra aux utilisateurs d'avoir une vision claire de
> leurs achats et paiements, et pourra être utilisée ultérieurement dans
> une application web ou mobile.

### Objectifs

- Fournir un système d'authentification sécurisé via JWT (register,
  login, profil).

- Permettre la gestion complète des fournisseurs (CRUD) par chaque
  client.

- Permettre la gestion complète des factures et leur suivi de statut
  automatique.

- Gérer les paiements partiels ou complets avec contrôle des montants.

- Garantir l'isolation des données : un client ne voit que ses propres
  données.

- Fournir des statistiques et analyses par fournisseur et vue globale.

# Rôles et contraintes Globales

### Rôles

- **Client:** Entreprise ou freelance. Accède uniquement à ses propres
  données (fournisseurs, factures, paiements).

- **Admin:** Administrateur de la plateforme. Peut consulter les données
  de tous les clients.

### Contraintes Globales

- Un client ne peut accéder qu'à ses propres données

- Un fournisseur appartient à un seul client

- Une facture appartient à un seul client et à un seul fournisseur

- Une facture possède un montant total et une date d'échéanceLes statuts
  de facture sont : unpaid, partially_paid, paidLes paiements peuvent
  être partiels

# User stories

### Authentification (JWT)

> Le système d'authentification utilise des tokens JWT. Le token est
> retourné à la connexion et doit être envoyé dans le header
> Authorization: \*\*Bearer {token}\*\* pour toutes les routes
> protégées.

- **POST - /api/auth/register :** Inscription d'un nouveau client

- **POST - /api/auth/login :** Connexion et obtention d'un token JWT

- **GET - /api/auth/me :** Récupération du profil authentifié

### Gestion des Fournisseurs

> Chaque client gère sa propre liste de fournisseurs. Un fournisseur ne
> peut être modifié ou supprimé que par son propriétaire.

- **POST - /api/suppliers :** Créer un fournisseur (name, contact
  optionnel)

- **GET - /api/suppliers :** Lister tous ses fournisseurs

- **GET - /api/suppliers/:id :** Consulter un fournisseur spécifique

- **PUT - /api/suppliers/:id :** Modifier un fournisseur

- **DELETE - /api/suppliers/:id :** Supprimer un fournisseur

### Gestion des Factures

> Les factures sont liées à un fournisseur et ont un statut calculé
> automatiquement. Une facture ne peut être modifiée que si elle n'est
> pas totalement payée, et supprimée uniquement si aucun paiement n'y
> est associé.

- **POST - /api/invoices :** Créer une facture (supplierId, amount,
  dueDate)

- **GET - /api/invoices :** Lister toutes ses factures (filtres
  disponibles)

- **GET - /api/invoices/:id :** Consulter une facture spécifique

- **PUT - /api/invoices/:id :** Modifier une facture (si non totalement
  payée)

- **DELETE - /api/invoices/:id :** Supprimer une facture (si aucun
  paiement associé)

### Gestion des Paiements

> Les paiements sont enregistrés par facture. Le système vérifie
> automatiquement les contraintes de montant et met à jour le statut de
> la facture après chaque paiement.

- **POST - /api/invoices/:id/payments :** Enregistrer un paiement
  (amount, paymentDate)

- **GET - /api/invoices/:id/payments :** Lister les paiements d'une
  facture

### Suivi & Analyse

> Le système calcule dynamiquement les statistiques par fournisseur et
> la vue globale du client.

- **GET - /api/suppliers/:id/stats :** Statistiques d'un fournisseur
  (factures, montants, %)

- **GET - /api/dashboard :** Vue globale (total factures, dépenses,
  retards)

### Logique de Suivi des Statuts

> Le statut de chaque facture est calculé dynamiquement à chaque
> consultation ou mise à jour :
>
> **unpaid :** Aucun paiement enregistré
>
> **partially_paid :** Paiement partiel reçu (total \< montant facture)
>
> **paid :** Total des paiements égal au montant de la facture
>
> **overdue :** Date d'échéance dépassée et facture non totalement payée

### Routes Admin

> L'administrateur accède à toutes les données via des routes protégées
> par un middleware de vérification du rôle admin.

- **GET - /api/admin/clients :** Lister tous les clients inscrits

- **GET - /api/admin/clients/:id/suppliers :** Consulter les
  fournisseurs d'un client

- **GET - /api/admin/clients/:id/invoices :** Consulter les factures
  d'un client

- **GET - /api/admin/clients/:id/payments :** Consulter les paiements
  d'un client

### Modélisation UML

> Avant de commencer l'implémentation, les diagrammes UML suivants
> doivent être réalisés :

- Diagramme de cas d'utilisation (Use Case Diagram)

- Diagramme de classes (Class Diagram)

- Diagramme de séquence (Sequence Diagram)

### Contraintes technique

- Node.js + Express

- MongoDB avec Mongoose

- Utilisation de middlewares

- Utilisation de async/await

- Gestion correcte des erreurs

- Réponses toujours au format JSON

- Status HTTP cohérents

## Modalités pédagogiques

### Travail individuel.

- **Durée :** 5 jours.

- **Date de lancement du brief :** 06/04/2026 à 10h00.

- **Date limite de soumission des livrables :** 10/04/2026 avant 23h59.
  Tout livrable soumis après la date mentionnée **NE SERA PAS ACCEPTE.**

- Dernière push sur GitHub le \*\*dimanche avant 23h59.\*\*

## Modalités d\'évaluation

> 10 minutes : Présentation (planification + application + journal de
> commits) 10 minutes : Explication du code
>
> 10 minutes : Mise en situation
>
> 10 minutes : Questions de culture web

## Livrables

- lien planification Trello.

- lien présentation.

- lien GitHub

- Captures d'écran des diagrammes UML (Use Case, Class et Sequence)
  intégrées dans le fichier README du projet

## Critères de performance

- Maîtrise de l'utilisation des middlewares avec Express.js.

- Mise en place de la validation des entrées avec Joi ou
  Express-validator.

- Sécurisation des mots de passe avec bcrypt (hashing).

- Implémentation d'une authentification basée sur JWT.

- Gestion des relations entre collections avec MongoDB/Mongoose.

- Implémentation des contrôles d'accès (rôles et ownership des
  ressources).
