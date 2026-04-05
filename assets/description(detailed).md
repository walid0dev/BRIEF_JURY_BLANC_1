> **Contexte**
>
> Dans le quotidien des entreprises et des freelances, la gestion des
> factures fournisseurs devient rapidement complexe. Il est souvent
> difﬁcile de suivre les montants dépensés, d'identiﬁer les factures en
> attente ou en retard, et d'avoir une vision claire des relations avec
> les fournisseurs.
>
> L'objectif de ce projet est de développer une **API backend
> sécurisée** permettant de :

- Gérer une liste de fournisseurs

- Enregistrer et suivre les factures reçues

- Effectuer des paiements partiels ou complets

- Suivre l'état des factures (payée, partiellement payée, en retard...)

- Analyser les dépenses par fournisseur

> Cette API permettra aux utilisateurs d'avoir une **vision claire de
> leurs achats et paiements**, et pourra être utilisée ultérieurement
> dans une application web ou mobile.
>
> **Objectifs**

- Fournir un système d'authentiﬁcation sécurisé via JWT (register,
  login, proﬁl).

- Permettre la gestion complète des fournisseurs (CRUD) par chaque
  client.

- Permettre la gestion complète des factures et leur suivi de statut
  automatique.

- Gérer les paiements partiels ou complets avec contrôle des montants.

- Garantir l'isolation des données : un client ne voit que ses propres
  données.

- Fournir des statistiques et analyses par fournisseur et vue globale.

> **Rôles et contraintes Globales**

## Rôles

> **Client**: Entreprise ou freelance. Accède uniquement à ses propres
> données (fournisseurs, factures, paiements).
>
> **Admin**: Administrateur de la plateforme. Peut consulter les données
> de tous les clients.

## Contraintes Globales

- Un client ne peut accéder qu'à ses propres données

- Un fournisseur appartient à un seul client

- Une facture appartient à un seul client et à un seul fournisseur

- Une facture possède un montant total et une date d'échéance

- Les statuts de facture sont : unpaid, partially_paid, paid, overdue

- Les paiements peuvent être partiels

- Une facture devient automatiquement overdue si la date est dépassée et
  qu'elle n'est pas totalement payée

+--------------------------------------------------------------------+
| **Règles Métier Importantes**                                      |
+====================================================================+
| - Une facture ne peut pas recevoir de paiement si elle est déjà    |
|   payée                                                            |
|                                                                    |
| - Le montant d'un paiement doit être strictement supérieur à 0     |
|                                                                    |
| - Le total des paiements ne doit pas dépasser le montant de la     |
|   facture                                                          |
|                                                                    |
| - Les calculs (totaux, pourcentages) doivent être dynamiques       |
|                                                                    |
| - Les montants doivent toujours rester cohérents                   |
+--------------------------------------------------------------------+

# Exigences Fonctionnelles

## Authentiﬁcation (JWT)

> Le système d'authentiﬁcation utilise des tokens JWT. Le token est
> retourné à la connexion et doit être envoyé dans le header
> Authorization: Bearer {token} pour toutes les routes protégées.

  --------------------------------------------------------------------------
  **Méthode**   **Endpoint**             **Description**
  ------------- ------------------------ -----------------------------------
  **POST**      /api/auth/register       Inscription d'un nouveau client

  **POST**      /api/auth/login          Connexion et obtention d'un token
                                         JWT

  **GET**       /api/auth/me             Récupération du proﬁl authentiﬁé
  --------------------------------------------------------------------------

## Gestion des Fournisseurs

> Chaque client gère sa propre liste de fournisseurs. Un fournisseur ne
> peut être modiﬁé ou supprimé que par son propriétaire.

  --------------------------------------------------------------------------
  **Méthode**   **Endpoint**             **Description**
  ------------- ------------------------ -----------------------------------
  **POST**      /api/suppliers           Créer un fournisseur (name, contact
                                         optionnel)

  **GET**       /api/suppliers           Lister tous ses fournisseurs

  **GET**       /api/suppliers/:id       Consulter un fournisseur spéciﬁque

  **PUT**       /api/suppliers/:id       Modiﬁer un fournisseur

  **DELETE**    /api/suppliers/:id       Supprimer un fournisseur
  --------------------------------------------------------------------------

## Gestion des Factures

> Les factures sont liées à un fournisseur et ont un statut calculé
> automatiquement. Une facture ne peut être modiﬁée que si elle n'est
> pas totalement payée, et supprimée uniquement si aucun paiement n'y
> est associé.

  --------------------------------------------------------------------------
  **Méthode**   **Endpoint**             **Description**
  ------------- ------------------------ -----------------------------------
  **POST**      /api/invoices            Créer une facture (supplierId,
                                         amount, dueDate)

  **GET**       /api/invoices            Lister toutes ses factures (ﬁltres
                                         disponibles)

  **GET**       /api/invoices/:id        Consulter une facture spéciﬁque

  **PUT**       /api/invoices/:id        Modiﬁer une facture (si non
                                         totalement payée)

  **DELETE**    /api/invoices/:id        Supprimer une facture (si aucun
                                         paiement associé)
  --------------------------------------------------------------------------

## Gestion des Paiements

> Les paiements sont enregistrés par facture. Le système vériﬁe
> automatiquement les contraintes de montant et met à jour le statut de
> la facture après chaque paiement.

  ------------------------------------------------------------------------------
  **Méthode**   **Endpoint**                 **Description**
  ------------- ---------------------------- -----------------------------------
  **POST**      /api/invoices/:id/payments   Enregistrer un paiement (amount,
                                             paymentDate)

  **GET**       /api/invoices/:id/payments   Lister les paiements d'une facture
  ------------------------------------------------------------------------------

## Suivi & Analyse

> Le système calcule dynamiquement les statistiques par fournisseur et
> la vue globale du client.

  ----------------------------------------------------------------------------
  **Méthode**   **Endpoint**               **Description**
  ------------- -------------------------- -----------------------------------
  **GET**       /api/suppliers/:id/stats   Statistiques d'un fournisseur
                                           (factures, montants, %)

  **GET**       /api/dashboard             Vue globale (total factures,
                                           dépenses, retards)
  ----------------------------------------------------------------------------

## Routes Admin

> L'administrateur accède à toutes les données via des routes protégées
> par un middleware de vériﬁcation du rôle admin.

  ------------------------------------------------------------------------------------
  **Méthode**   **Endpoint**                       **Description**
  ------------- ---------------------------------- -----------------------------------
  **GET**       /api/admin/clients                 Lister tous les clients inscrits

  **GET**       /api/admin/clients/:id/suppliers   Consulter les fournisseurs d'un
                                                   client

  **GET**       /api/admin/clients/:id/invoices    Consulter les factures d'un client

  **GET**       /api/admin/clients/:id/payments    Consulter les paiements d'un client
  ------------------------------------------------------------------------------------

# Logique de Suivi des Statuts

> Le statut de chaque facture est calculé dynamiquement à chaque
> consultation ou mise à jour :

  ------------------------------------------------------------------------
  **Statut**           **Condition**
  -------------------- ---------------------------------------------------
  **unpaid**           Aucun paiement enregistré

  **partially_paid**   Paiement partiel reçu (total \< montant facture)

  **paid**             Total des paiements égal au montant de la facture

  **overdue**          Date d'échéance dépassée et facture non totalement
                       payée
  ------------------------------------------------------------------------

# User Stories

## Authentiﬁcation

+--------------------------------------------------------------------+
| **US-01 --- Inscription utilisateur**                              |
+====================================================================+
| En tant que nouveau client, je veux m'inscrire via l'API aﬁn de    |
| créer mon compte.                                                  |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - POST /api/auth/register accepte : name, email, password,         |
|   password_conﬁrmation                                             |
|                                                                    |
| - Champ name : requis, min 2 caractères                            |
|                                                                    |
| - Champ email : requis, format valide, unique en base --- doublon  |
|   → 422                                                            |
|                                                                    |
| - Champ password : requis, min 8 caractères --- non respecté → 422 |
|                                                                    |
| - password_conﬁrmation doit correspondre à password --- sinon 422  |
|                                                                    |
| - Succès : réponse 201 avec token JWT + { id, name, email, role,   |
|   createdAt }                                                      |
|                                                                    |
| - Le mot de passe est hashé en base (bcrypt)                       |
|                                                                    |
| - Rôle assigné automatiquement : \'client\'                        |
|                                                                    |
| - Utilisateur non authentiﬁé → accès aux routes protégées refusé   |
|   (401)                                                            |
+--------------------------------------------------------------------+

+--------------------------------------------------------------------+
| **US-02 --- Connexion utilisateur**                                |
+====================================================================+
| En tant que client inscrit, je veux me connecter et obtenir un     |
| token JWT.                                                         |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - POST /api/auth/login accepte : email, password                   |
|                                                                    |
| - Identiﬁants valides → 200 avec token JWT + { id, name, email,    |
|   role }                                                           |
|                                                                    |
| - Identiﬁants invalides → 401 avec message explicite               |
|                                                                    |
| - Compte inexistant → 401 (ne pas révéler si l'email existe ou     |
|   non)                                                             |
|                                                                    |
| - Token JWT utilisable dans Authorization: Bearer {token} pour     |
|   toutes les routes protégées                                      |
+--------------------------------------------------------------------+

- Token expiration conﬁgurable (ex : 7 jours)

+--------------------------------------------------------------------+
| **US-03 --- utilisateur authentiﬁé**                               |
+====================================================================+
| En tant que **utilisateur authentiﬁé**                             |
|                                                                    |
| Je veux consulter mon proﬁl utilisateur                            |
|                                                                    |
| Aﬁn de vériﬁer mes informations personnelles                       |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - GET /api/auth/me retourne les informations de l'utilisateur      |
|   connecté (200)                                                   |
|                                                                    |
| - Champs retournés : id, name, email, role, createdAt              |
|                                                                    |
| - Le mot de passe n'est jamais inclus dans la réponse              |
|                                                                    |
| - Sans token valide → 401                                          |
+--------------------------------------------------------------------+

## Gestion des Fournisseurs

+--------------------------------------------------------------------+
| **US-04 --- Créer un fournisseur**                                 |
+====================================================================+
| En tant que client authentiﬁé, je veux ajouter un fournisseur à ma |
| liste.                                                             |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - POST /api/suppliers accepte : name (requis), contact             |
|   (optionnel), email (optionnel), phone (optionnel), address       |
|   (optionnel)                                                      |
|                                                                    |
| - Champ name : requis, min 2 caractères --- absent ou vide → 422   |
|                                                                    |
| - Champ email : format valide si fourni --- format invalide → 422  |
|                                                                    |
| - Le fournisseur est automatiquement associé au userId du client   |
|   connecté                                                         |
|                                                                    |
| - Succès : 201 avec { id, userId, name, contact, email, phone,     |
|   address, createdAt }                                             |
|                                                                    |
| - Sans token valide → 401                                          |
+--------------------------------------------------------------------+

+--------------------------------------------------------------------+
| **US-05 --- Consulter la liste des fournisseurs**                  |
+====================================================================+
| En tant que client authentiﬁé, Je veux consulter la liste de tous  |
| mes fournisseurs                                                   |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - GET /api/suppliers retourne uniquement les fournisseurs du       |
|   client connecté (200)                                            |
|                                                                    |
| - Les fournisseurs d'autres clients ne sont jamais visibles        |
|                                                                    |
| - Chaque fournisseur inclut : id, name, contact, email, phone,     |
|   address, createdAt                                               |
+--------------------------------------------------------------------+

- Possibilité de ﬁltrer par name via query string (?name=\...)

- Réponse paginable (paramètres ?page et ?limit)

- Sans token valide → 401

+--------------------------------------------------------------------+
| **US-06 --- Consulter un fournisseur Spéciﬁque**                   |
+====================================================================+
| En tant que client authentiﬁé, je veux supprimer un fournisseur de |
| ma liste.                                                          |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - GET /api/suppliers/:id retourne le fournisseur demandé (200)     |
|                                                                    |
| - La réponse inclut : id, userId, name, contact, email, phone,     |
|   address, createdAt, updatedAt                                    |
|                                                                    |
| - Inclut le nombre de factures associées (invoiceCount)            |
|                                                                    |
| - Fournisseur inexistant → 404                                     |
|                                                                    |
| - Fournisseur appartenant à un autre client → 403                  |
|                                                                    |
| - Sans token valide → 401                                          |
+--------------------------------------------------------------------+

+--------------------------------------------------------------------+
| **US-07 --- Supprimer un fournisseur**                             |
+====================================================================+
| En tant que client authentiﬁé, je veux supprimer un fournisseur de |
| ma liste.                                                          |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - DELETE /api/suppliers/:id supprime le fournisseur spéciﬁé        |
|                                                                    |
| - Le middleware vériﬁe que le fournisseur appartient au client     |
|   (sinon 403)                                                      |
|                                                                    |
| - Fournisseur inexistant → 404                                     |
|                                                                    |
| - Conﬁrmation de suppression (200 ou 204)                          |
+--------------------------------------------------------------------+

+--------------------------------------------------------------------+
| **US-08 --- Modiﬁer un fournisseur**                               |
+====================================================================+
| En tant que client authentiﬁé. Je veux modiﬁer les informations    |
| d'un fournisseur.                                                  |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - PUT /api/suppliers/:id accepte : name, contact, email, phone,    |
|   address (tous optionnels                                         |
|                                                                    |
| --- mise à jour partielle)                                         |
|                                                                    |
| - Champ name : min 2 caractères si fourni --- sinon 422            |
|                                                                    |
| - Champ email : format valide si fourni --- sinon 422              |
|                                                                    |
| - Middleware vériﬁe que le fournisseur appartient au client        |
|   connecté --- sinon 403                                           |
+--------------------------------------------------------------------+

- Fournisseur inexistant → 404

- Succès : 200 avec le fournisseur mis à jour (tous les attributs)

- Sans token valide → 401

## Gestion des Factures

+--------------------------------------------------------------------+
| **US-09 --- Créer une facture**                                    |
+====================================================================+
| En tant que client, je veux créer une facture pour l'un de mes     |
| fournisseurs.                                                      |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - POST /api/invoices accepte : supplierId (requis), amount         |
|   (requis), dueDate (requis), description (optionnel)              |
|                                                                    |
| - Champ supplierId : requis, doit correspondre à un fournisseur du |
|   client connecté --- sinon 403                                    |
|                                                                    |
| - Champ amount : requis, nombre, strictement \> 0 --- sinon 422    |
|                                                                    |
| - Champ dueDate : requis, date valide --- sinon 422                |
|                                                                    |
| - Champ description : optionnel, string                            |
|                                                                    |
| - Statut initial automatique : unpaid                              |
|                                                                    |
| - userId assigné automatiquement depuis le token                   |
|                                                                    |
| - Succès : 201 avec { id, userId, supplierId, amount, dueDate,     |
|   status, description, createdAt }                                 |
|                                                                    |
| - Sans token valide → 401                                          |
+--------------------------------------------------------------------+

+--------------------------------------------------------------------+
| **US-10 --- Consulter la liste des factures**                      |
+====================================================================+
| En tant que client authentiﬁé. Je veux consulter la liste de       |
| toutes mes factures                                                |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - GET /api/invoices retourne uniquement les factures du client     |
|   connecté (200)                                                   |
|                                                                    |
| - Les factures d'autres clients ne sont jamais visibles            |
|                                                                    |
| - Chaque facture inclut : id, supplierId, supplierName, amount,    |
|   dueDate, status, totalPaid, remainingAmount, createdAt           |
|                                                                    |
| - Filtres disponibles via query strings : ?status=unpaid           |
|                                                                    |
| - Filtre par fournisseur : ?supplierId=\...                        |
|                                                                    |
| - Réponse paginable : ?page=1&limit=15 (défaut 15 par page)        |
|                                                                    |
| - Sans token valide → 401                                          |
+--------------------------------------------------------------------+

+--------------------------------------------------------------------+
| **US-11 --- Modiﬁer une facture**                                  |
+====================================================================+
| En tant que client, je veux modiﬁer une facture non totalement     |
| payée.                                                             |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - PUT /api/invoices/:id accepte les champs modiﬁables              |
|                                                                    |
| - Facture totalement payée → modiﬁcation refusée (422)             |
|                                                                    |
| - Middleware vériﬁe l'appartenance (sinon 403)                     |
|                                                                    |
| - Facture inexistante → 404                                        |
+--------------------------------------------------------------------+

+--------------------------------------------------------------------+
| **US-11 --- Supprimer une facture**                                |
+====================================================================+
| En tant que client authentiﬁé. Je veux supprimer une facture       |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - DELETE /api/invoices/:id supprime la facture spéciﬁée            |
|                                                                    |
| - Suppression impossible si au moins un paiement est associé ---   |
|   refusé avec 422 et message explicite                             |
|                                                                    |
| - Middleware vériﬁe l'appartenance au client connecté --- sinon    |
|   403                                                              |
|                                                                    |
| - Facture inexistante → 404                                        |
|                                                                    |
| - Succès : 200 { message: \'Facture supprimée\' } ou 204           |
|                                                                    |
| - Sans token valide → 401                                          |
+--------------------------------------------------------------------+

> **Gestion des Paiements**

+--------------------------------------------------------------------+
| **US-12 --- Enregistrer un paiement**                              |
+====================================================================+
| En tant que client, je veux enregistrer un paiement partiel ou     |
| complet pour une facture.                                          |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - POST /api/invoices/:id/payments accepte : amount (requis),       |
|   paymentDate (requis), note (optionnel)                           |
|                                                                    |
| - Champ amount : requis, strictement \> 0 --- sinon 422            |
|                                                                    |
| - Champ amount : total payé + le montant ne doit pas dépasser le   |
|   total de la facture --- sinon 422 avec message explicite         |
|                                                                    |
| - Champ paymentDate : requis, date valide, ne peut pas être dans   |
|   le futur --- sinon 422                                           |
|                                                                    |
| - Champ mode_paiement: requis, string(espèces, chèque, virement)   |
|                                                                    |
| - Facture avec statut \'paid\' → paiement refusé avec 422          |
|                                                                    |
| - Middleware vériﬁe que la facture appartient au client connecté   |
|   --- sinon 403                                                    |
+--------------------------------------------------------------------+

- Statut de la facture mis à jour automatiquement (partially_paid ou
  paid)

- Succès : 201 avec { id, invoiceId, userId, amount, paymentDate, note,
  createdAt } + facture mise à jour

- Facture inexistante → 404

- Sans token valide → 401

+--------------------------------------------------------------------+
| **US-13 --- Consulter la liste des paiements d'une facture**       |
+====================================================================+
| En tant que client authentiﬁé. Je veux consulter la liste des      |
| paiements d'une facture                                            |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - GET /api/invoices/:id/payments retourne tous les paiements de la |
|   facture (200)                                                    |
|                                                                    |
| - Chaque paiement inclut : id, invoiceId, userId, amount,          |
|   paymentDate, mode de paiement, createdAt                         |
|                                                                    |
| - Inclut un résumé : totalPaid, remainingAmount, statut de la      |
|   facture                                                          |
|                                                                    |
| - Middleware vériﬁe que la facture appartient au client connecté   |
|   --- sinon 403                                                    |
|                                                                    |
| - Facture inexistante → 404                                        |
|                                                                    |
| - Sans token valide → 401                                          |
+--------------------------------------------------------------------+

> **Suivi & Analyse**

+--------------------------------------------------------------------+
| **US-14 --- Statistiques par fournisseur**                         |
+====================================================================+
| En tant que client, je veux consulter les statistiques de mes      |
| achats par fournisseur.                                            |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - GET /api/suppliers/:id/stats retourne les statistiques du        |
|   fournisseur (200):                                               |
|                                                                    |
|   - Réponse inclut : supplierId, supplierName                      |
|                                                                    |
|   - totalInvoices : nombre total de factures associées             |
|                                                                    |
|   - totalAmount : somme des montants de toutes les factures        |
|                                                                    |
|   - totalPaid : somme de tous les paiements reçus                  |
|                                                                    |
|   - totalRemaining : montant total restant à payer                 |
|                                                                    |
|   - overdueCount : nombre de factures en retard                    |
|                                                                    |
|   - percentage : pourcentage des dépenses de ce fournisseur par    |
|     rapport au total global du client                              |
|                                                                    |
|   - invoicesByStatus : répartition { unpaid, partially_paid, paid, |
|     overdue }                                                      |
|                                                                    |
|   - Fournisseur inexistant → 404                                   |
|                                                                    |
|   - Fournisseur appartenant à un autre client → 403                |
|                                                                    |
|   - Sans token valide → 401                                        |
+--------------------------------------------------------------------+

+--------------------------------------------------------------------+
| **US-15 --- Vue globale (dashboard)**                              |
+====================================================================+
| En tant que client, je veux un résumé global de ma situation       |
| ﬁnancière.                                                         |
|                                                                    |
| **Critères d'acceptation :**                                       |
|                                                                    |
| - GET /api/dashboard retourne le résumé global du client connecté  |
|   (200):                                                           |
|                                                                    |
|   - totalSuppliers : nombre total de fournisseurs                  |
|                                                                    |
|   - totalInvoices : nombre total de factures                       |
|                                                                    |
|   - totalAmount : somme de tous les montants de factures           |
|                                                                    |
|   - totalPaid : somme de tous les paiements effectués              |
|                                                                    |
|   - totalRemaining : montant total restant à payer (totalAmount −  |
|     totalPaid)                                                     |
|                                                                    |
|   - overdueCount : nombre de factures avec statut \'overdue\'      |
|                                                                    |
|   - overdueAmount : montant total des factures en retard           |
|                                                                    |
|   - invoicesByStatus : { unpaid: N, partially_paid: N, paid: N,    |
|     overdue: N }                                                   |
|                                                                    |
|   - topSuppliers : les 3 fournisseurs avec le plus de dépenses     |
|                                                                    |
|   - Sans token valide → 401                                        |
+--------------------------------------------------------------------+

# Exigences Techniques

## Architecture & Stack

- Framework : Node.js avec Express

- Authentiﬁcation : JWT (jsonwebtoken) + bcrypt

- Base de données : MongoDB (Mongoose) ou PostgreSQL (Sequelize/prisma)

- Architecture : API RESTful avec séparation routes / controllers /
  services (optionnel) / models / middlewares

- Validation : Joi ou Express-validator

## Middleware d'Autorisation

> Deux niveaux de protection doivent être mis en place :

+----------------------+---------------------------------------------+
| **Middleware**       | **Rôle**                                    |
+======================+=============================================+
| **authenticate**     | Vériﬁe la présence et validité du token JWT |
|                      | sur toutes les routes protégées             |
+----------------------+---------------------------------------------+
| **isAdmin**          | Vériﬁe que l'utilisateur possède le rôle    |
|                      | admin pour les routes                       |
|                      |                                             |
|                      | /api/admin                                  |
+----------------------+---------------------------------------------+
| **isOwner**          | Vériﬁe que la ressource demandée appartient |
|                      | bien au client connecté (403 sinon)         |
+----------------------+---------------------------------------------+
