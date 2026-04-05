> ⚠️ **Portfolio Project**  
> This repository is intended for demonstration and portfolio purposes only.  
> It is not designed, maintained, or secured for production use.


# Transfer Management App
A React Native application for managing transfer requests, built with TypeScript and Firebase Cloud Messaging.

## Tech Stack

- React Native (TypeScript)
- Firebase Cloud Messaging
- Node.js (backend)
- Android (tested)

## Goal
The goal of this application is to solve a real world problem I experience at work. Working on a multi-unit complex, managing the transfers across campus often requires text messages between directors and drivers. Having a unified portal for requesting a product, agreeing to transfer the product, monitor in-transit and delivered transfers, solves this problem.


## Users
Users register through the app. 
- Bcrypt is used on the server side to encrypt password before storage.
- Users are created with a "type" i.e drivers, operators
- Users are created with a "unit number" that is used to channel notifications appropriately. 

Users are currently stored in a database with the following fields:
- username 
- encrypted password,
- fcmToken, 
- unit number

## Transfers
Transfers are currently stored in a database with the following fields:
- requestingUser (record only)
- type: enum: requested, accepted, in-transit,delivered
- item
- quantity requested
- quantity sent
- quanityt type requested i.e case, each, lb
- quantity type sent
- receiving unit (requesting)
- sending unit 
- date/time


## App Use Flow
Assumptions: 
- multiple users have app open/installed/background. 
- At least 2 operators with different unit numbers 
- At least 1 driver.

User1: unit num 1
User2: unit num 2

- User1 requests x product y quantity z type (Bananas, 4, case).
    - *Notification is sent to all users in db
    - **NOTIF"Unit Number 1 has requested Bananas"
    - **Transfer is visible in operator screen in "Open Transfers"
- User 2 sees the requested transfer in "Open Transfers" tab
- User 2 accepts the transfer, with user2 inputting amount/type sent(Bananas, 2, case).
    - *Notification is sent to all users in unit 1
    - **NOTIF"Unit Number 2 has accepted your tranasfer of Banana(s)"
    - **Transfer is visible in operator screen in "My Transfers" for both -unit 1 and unit 2, tagged as accepted
    - **Transfer is visible in driver screen "Accepted Transfers" tab
- Driver sees transfer in "Accepted Transfers" tab.
- Driver picks up product, marks as "in-transit"
    - *Notification is sent to all users in Unit 1
    - **NOTIF"Your transfer request for Banana(s) is now in-transit"
    - **Transfer is visible in transfer screen in "My Transfers" for both -unit 1 and unit 2, tagged as in-transit
    - **Transfer is visible in driver screen in "in transit" tab
- Driver sees transfer in "in-transit" tab, marks as "delivered"
    - *Notification sent to all users in unit 1
    - **NOTIF"Your transfer request for Banana(s) is now delivered"
    - **Transfer is visible in transfer screen in "My Transfers" for both -unit 1 and unit 2, tagged as delievered
    - **Transfer is visible in driver screen "recently delivered"
## Server Operations

The backend server for this project is built with **Node.js** and manages user authentication, transfer records, and push notification delivery. It uses MongoDB for data storage and exposes RESTful API endpoints for the mobile app.

### Key Features

- **User Authentication:**  
  Handles registration and login, storing passwords securely with bcrypt hashing.

- **Transfer Management:**  
  Stores and updates transfer requests, including status changes (requested, accepted, in-transit, delivered), item details, and unit assignments.

- **Push Notifications:**  
  Integrates with Firebase Cloud Messaging to send real-time notifications to users based on transfer events.

- **RESTful API:**  
  Provides endpoints for user management, transfer operations, and notification handling.

### Main Server Files

- `server.js` — Main entry point for the Node.js server.
- `models/User.js` — Mongoose schema for user data.
- `models/Transfer.js` — Mongoose schema for transfer records.
- `routes/users.js` — User registration and authentication routes.
- `routes/transfers.js` — Transfer request and status update routes.
- `routes/notifs.js` — Notification-related endpoints.
- `routes/fcm.js` — Firebase Cloud Messaging integration.

### Data Storage

- Uses **MongoDB** (see `data/` directory) for persistent storage of users and transfers.
- Stores FCM tokens for each user to enable targeted notifications.

### Example API Endpoints

- `POST /users/register` — Register a new user
- `POST /users/login` — Authenticate a user
- `POST /transfers` — Create a new transfer request
- `PUT /transfers/:id` — Update transfer status
- `POST /notifs/send` — Send a notification to a user or group

---

## Future
The future of this project could be improved with:
- User functionality:
    - Password reset
- Creating settings for a campus i.e organized unit numbers, admins
- Weekly/Monthly reports
- Price/Inventory database integration


## Author
See my github profile for more projects: [Dustin Bruce](github.com/dustinbruce50)
Also check out my [portfolio site](dustinbruceresume.portfolio.app)
