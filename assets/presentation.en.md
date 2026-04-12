# intro
Hi everyone. Today, I’ll be presenting my implementation for the 'Jury Blanc' project. I’ll walk you through the core objectives and the tools I used, discuss the data modeling and business logic, and wrap up with an overview of the technical architecture.
# objectives
In this project I focused on three main pillars
- ## Security and Access Control
	I implemented a JWT-based authentication system for login and registration.
	all features of the application are accessed through authentication and authorization middleware, which guarantees data isolation ensuring each client can manage their own data.
- ### Core Business Logic: 
	The system allows for full CRUD management of suppliers and invoices. I also automated the invoice status tracking and built a payment module that validates both partial and full payments.
- ### Statistics and Reporting:
	Finally, the app provides a high-level dashboard with statistics and specific analysis per supplier to help users track their business performance at a glance.

# tech-stack
The server is built using node js and the express js along with some secondary packages for password hashing JWT generation. For storage I used a MongoDB database that I access from the application using the "Mongoose" package.

# system architecture
The system is built using a layered architecture, with a clear separation of concerns between the presentation layer, the business logic layer, and the data access layer. The presentation layer handles all incoming HTTP requests and outgoing responses, while the business logic layer contains all the core functionality of the application, and the data access layer is responsible for interacting with the database.

# data modeling & business logic
As you can see in the class diagram, the main entities in the system are User, Supplier, Invoice, and Payment. Each user can have multiple suppliers, and each supplier can have multiple invoices. The invoice entity has a status field that is automatically updated based on the payment history. The payment entity allows for both partial and full payments, and the system ensures that the total payments do not exceed the invoice amount.

# conclusion
This project has been a good opportunity to apply best practices in REST API development, including secure authentication, layered architecture, and effective data modeling. Thank you for your attention, and I’m happy to answer any questions you may have.

