# Introduction
Bonjour à tous. Aujourd’hui, je vais vous présenter ma mise en œuvre du projet « Jury Blanc ». Je vais vous exposer les principaux objectifs et les outils que j’ai utilisés, aborder la modélisation des données et la logique métier, puis conclure par un aperçu de l’architecture technique.
# Objectifs
Dans ce projet, je me suis concentré sur trois piliers principaux
- ## Sécurité et contrôle d'accès
    J'ai mis en place un système d'authentification basé sur JWT pour la connexion et l'inscription.
    Toutes les fonctionnalités de l'application sont accessibles via un middleware d'authentification et d'autorisation, ce qui garantit l'isolation des données et permet à chaque client de gérer ses propres données.
- ### Logique métier principale : 
    Le système permet une gestion CRUD complète des fournisseurs et des factures. J'ai également automatisé le suivi du statut des factures et développé un module de paiement qui valide les paiements partiels et complets.
- ### Statistiques et rapports :
    Enfin, l'application fournit un tableau de bord avec des statistiques et des analyses spécifiques par fournisseur pour aider les utilisateurs à suivre leurs performances commerciales.

# pile technologique
Le serveur est développé à l'aide de Node.js et d'Express.js, ainsi que de quelques bibliothèques complémentaires pour le hachage des mots de passe et la génération de jetons JWT. Pour le stockage, j'ai utilisé une base de données MongoDB à laquelle j'accède depuis l'application via la bibliothèque « Mongoose ».

# architecture du système
Le système est construit selon une architecture en couches, avec une séparation claire des préoccupations entre la couche de présentation, la couche de logique métier et la couche d'accès aux données. La couche de présentation gère toutes les requêtes HTTP entrantes et les réponses sortantes, tandis que la couche de logique métier contient toutes les fonctionnalités principales de l'application, et la couche d'accès aux données est chargée d'interagir avec la base de données.

# Modélisation des données et logique métier
Comme vous pouvez le voir sur le diagramme de classes, les principales entités du système sont Utilisateur, Fournisseur, Facture et Paiement. Chaque utilisateur peut avoir plusieurs fournisseurs, et chaque fournisseur peut avoir plusieurs factures. L'entité Facture comporte un champ « statut » qui est automatiquement mis à jour en fonction de l'historique des paiements. L'entité Paiement permet à la fois les paiements partiels et les paiements intégraux, et le système veille à ce que le total des paiements ne dépasse pas le montant de la facture.

# Conclusion
Ce projet a été une excellente occasion de mettre en pratique les meilleures pratiques en matière de développement d'API REST, notamment l'authentification sécurisée, l'architecture en couches et la modélisation efficace des données. Je vous remercie de votre attention et je me tiens à votre disposition pour répondre à toutes vos questions.