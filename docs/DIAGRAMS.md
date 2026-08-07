# EstateHub — Technical System Architecture & Diagrams Document

This document provides a comprehensive technical overview of the **EstateHub** real estate application. All diagrams, schemas, sequence flows, and component hierarchies are derived directly from the active project source code across the `client`, `api`, `socket`, and `prisma/schema.prisma` modules.

---

## Table of Contents
1. [System Architecture Diagram](#1-system-architecture-diagram)
2. [Entity-Relationship (ER) Diagram](#2-entity-relationship-er-diagram)
3. [API Route Map](#3-api-route-map)
4. [Authentication Flow (Sequence Diagram)](#4-authentication-flow-sequence-diagram)
5. [Property Listing Flow (Sequence Diagram)](#5-property-listing-flow-sequence-diagram)
6. [Real-Time Chat Flow (Sequence Diagram)](#6-real-time-chat-flow-sequence-diagram)
7. [Frontend Component Tree & Page Structure](#7-frontend-component-tree--page-structure)
8. [User Journey Flowchart](#8-user-journey-flowchart)

---

## 1. System Architecture Diagram

### Overview
The system architecture of EstateHub uses a decoupled three-tier architecture:
- **Frontend (Client)**: Built with React 18 and Vite (`http://localhost:5173`), utilizing Tailwind CSS, React Router v6, Axios REST client, Socket.io-client, and Cloudinary Upload Widget.
- **Backend REST API**: Built with Node.js and Express (`http://localhost:8800`), connecting to MongoDB via Prisma ORM v5, featuring JWT authentication stored in `httpOnly` HTTP cookies.
- **Real-Time WebSocket Server**: Built with Node.js and Socket.io (`ws://localhost:4000`), managing online user sockets and routing peer-to-peer real-time chat messages.
- **Database Layer**: MongoDB Single-Node Replica Set (`rs0` on port `27018` or `27017`), handling document transactions and relational modeling via Prisma.
- **External CDN**: Cloudinary Media Server handling unsigned direct image uploads from the client browser.

```mermaid
graph TB
    subgraph ClientLayer ["Client Layer (React / Vite - Port 5173)"]
        ReactApp["React 18 Application"]
        AuthCtx["AuthContext (JWT State)"]
        SocketCtx["SocketContext (WS State)"]
        ZustandStore["Notification Store (Zustand)"]
        CloudinaryWidget["UploadWidget (Cloudinary SDK)"]
    end

    subgraph ExternalCloud ["External Media Services"]
        Cloudinary["Cloudinary CDN"]
    end

    subgraph BackendLayer ["Backend Services"]
        subgraph RESTAPI ["Express REST API (Port 8800)"]
            AuthRoutes["/api/auth (Register, Login, Logout)"]
            UserRoutes["/api/users (Profile, Save, Notifications)"]
            PostRoutes["/api/posts (CRUD Properties)"]
            ChatRoutes["/api/chats (Fetch & Read Threads)"]
            MessageRoutes["/api/messages (Send Messages)"]
            VerifyMW["verifyToken Middleware (JWT Cookie)"]
        end

        subgraph WSServer ["Socket.io Server (Port 4000)"]
            OnlineUsers["onlineUsers Array [{userId, socketId}]"]
            SocketEvents["WS Event Handlers (newUser, sendMessage)"]
        end
    end

    subgraph DatabaseLayer ["Database Layer"]
        PrismaORM["Prisma ORM Client"]
        MongoDB[("MongoDB Replica Set rs0 (Port 27018 / 27017)")]
    end

    %% Client Interactions
    ReactApp -->|REST HTTP Requests / Axios| RESTAPI
    ReactApp -->|WebSocket Events| WSServer
    CloudinaryWidget -->|Direct Image Upload| Cloudinary
    Cloudinary -->|Returns Image URLs| CloudinaryWidget

    %% REST API Interactions
    RESTAPI --> VerifyMW
    RESTAPI --> PrismaORM
    PrismaORM -->|CRUD Queries| MongoDB

    %% Socket Operations
    WSServer -->|Emits getMessage| ReactApp
```

**Key Source Files**: `client/src/lib/apiRequest.js`, `socket/app.js`, `api/app.js`, `api/lib/prisma.js`, `client/src/components/uploadWidget/UploadWidget.jsx`.

---

## 2. Entity-Relationship (ER) Diagram

### Overview
EstateHub uses 6 main models defined in `api/prisma/schema.prisma`:
1. `User`: Account entity storing credentials, email, username, avatar image, and `chatIDs` relation.
2. `Post`: Core real estate property entity storing pricing, beds/baths, coordinates (`latitude`, `longitude`), `type` (`buy` | `rent`), `property` (`apartment` | `house` | `condo` | `land`), and owner relation `userId`.
3. `PostDetail`: 1-to-1 extension of `Post` storing description (`desc`), square footage (`size`), policies (`utilities`, `pet`, `income`), and nearby distances (`school`, `bus`, `restaurant`).
4. `SavedPost`: Junction collection establishing a Many-to-Many relation between `User` and `Post` with a compound unique index `[userId, postId]`.
5. `Chat`: Conversation thread between multiple users storing `userIDs`, `seenBy` user arrays, and `lastMessage`.
6. `Message`: Individual text message referencing `chatId` and `userId`.

```mermaid
erDiagram
    User ||--o{ Post : "creates / owns"
    User ||--o{ SavedPost : "saves"
    User }o--o{ Chat : "belongs to (chatIDs / userIDs)"
    Post ||--|| PostDetail : "has details (postId unique)"
    Post ||--o{ SavedPost : "is saved in"
    Chat ||--o{ Message : "contains"

    User {
        ObjectId id PK
        String email UK
        String username UK
        String password
        String avatar
        DateTime createdAt
        ObjectIdArray chatIDs FK
    }

    Post {
        ObjectId id PK
        String title
        Int price
        StringArray images
        String address
        String city
        Int bedroom
        Int bathroom
        String latitude
        String longitude
        Type type "enum: buy, rent"
        Property property "enum: apartment, house, condo, land"
        DateTime createdAt
        ObjectId userId FK
    }

    PostDetail {
        ObjectId id PK
        String desc
        String utilities
        String pet
        String income
        Int size
        Int school
        Int bus
        Int restaurant
        ObjectId postId FK,UK
    }

    SavedPost {
        ObjectId id PK
        ObjectId userId FK
        ObjectId postId FK
        DateTime createdAt
    }

    Chat {
        ObjectId id PK
        ObjectIdArray userIDs FK
        ObjectIdArray seenBy
        String lastMessage
        DateTime createdAt
    }

    Message {
        ObjectId id PK
        String text
        String userId
        ObjectId chatId FK
        DateTime createdAt
    }
```

**Key Source Files**: `api/prisma/schema.prisma`.

---

## 3. API Route Map

### Overview
All REST endpoints are exposed under `/api` in `api/app.js` and protected where appropriate using the `verifyToken` middleware (`api/middleware/verifyToken.js`), which verifies the `token` cookie containing the signed JWT payload.

| Route Group | HTTP Method | Endpoint Path | Controller Function | Access Level | Description |
|---|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/register` | `register()` | Public | Hashes password via `bcrypt` and creates User |
| **Auth** | `POST` | `/api/auth/login` | `login()` | Public | Authenticates user, signs JWT, sets `token` HttpOnly cookie |
| **Auth** | `POST` | `/api/auth/logout` | `logout()` | Public | Clears `token` cookie |
| **Users** | `GET` | `/api/users/` | `getUsers()` | Public | Lists all users |
| **Users** | `PUT` | `/api/users/:id` | `updateUser()` | Protected | Updates user username, email, password, or avatar |
| **Users** | `DELETE` | `/api/users/:id` | `deleteUser()` | Protected | Deletes user account |
| **Users** | `POST` | `/api/users/save` | `savePost()` | Protected | Toggles saving/unsaving a property for current user |
| **Users** | `GET` | `/api/users/profilePosts` | `profilePosts()` | Protected | Fetches user's created listings and saved listings |
| **Users** | `GET` | `/api/users/notification` | `getNotificationNumber()`| Protected | Counts unread chats for badge notification |
| **Posts** | `GET` | `/api/posts/` | `getPosts()` | Public | Fetches filtered properties (type, city, price range, beds) |
| **Posts** | `GET` | `/api/posts/:id` | `getPost()` | Public | Fetches single property detail with owner info |
| **Posts** | `POST` | `/api/posts/` | `addPost()` | Protected | Creates new property post and nested PostDetail |
| **Posts** | `PUT` | `/api/posts/:id` | `updatePost()` | Protected | Updates property post and PostDetail attributes |
| **Posts** | `DELETE` | `/api/posts/:id` | `deletePost()` | Protected | Deletes post owned by current user |
| **Chats** | `GET` | `/api/chats/` | `getChats()` | Protected | Fetches all chat threads for logged in user |
| **Chats** | `GET` | `/api/chats/:id` | `getChat()` | Protected | Fetches chat messages and marks thread as read |
| **Chats** | `POST` | `/api/chats/` | `addChat()` | Protected | Initiates new chat thread between users |
| **Chats** | `PUT` | `/api/chats/read/:id` | `readChat()` | Protected | Adds current user ID to `seenBy` array |
| **Messages** | `POST` | `/api/messages/:chatId` | `addMessage()` | Protected | Appends text message to chat and updates `lastMessage` |

```mermaid
graph TD
    subgraph ExpressApp ["Express API Application (/api)"]
        subgraph AuthGroup ["Authentication Routes (/api/auth)"]
            A1["POST /register -> register() [Public]"]
            A2["POST /login -> login() [Public]"]
            A3["POST /logout -> logout() [Public]"]
        end

        subgraph UserGroup ["User Routes (/api/users)"]
            U1["GET / -> getUsers() [Public]"]
            U2["PUT /:id -> updateUser() [Protected]"]
            U3["DELETE /:id -> deleteUser() [Protected]"]
            U4["POST /save -> savePost() [Protected]"]
            U5["GET /profilePosts -> profilePosts() [Protected]"]
            U6["GET /notification -> getNotificationNumber() [Protected]"]
        end

        subgraph PostGroup ["Property Routes (/api/posts)"]
            P1["GET / -> getPosts() [Public]"]
            P2["GET /:id -> getPost() [Public]"]
            P3["POST / -> addPost() [Protected]"]
            P4["PUT /:id -> updatePost() [Protected]"]
            P5["DELETE /:id -> deletePost() [Protected]"]
        end

        subgraph ChatGroup ["Chat Routes (/api/chats)"]
            C1["GET / -> getChats() [Protected]"]
            C2["GET /:id -> getChat() [Protected]"]
            C3["POST / -> addChat() [Protected]"]
            C4["PUT /read/:id -> readChat() [Protected]"]
        end

        subgraph MessageGroup ["Message Routes (/api/messages)"]
            M1["POST /:chatId -> addMessage() [Protected]"]
        end
    end
```

**Key Source Files**: `api/app.js`, `api/routes/*.js`, `api/middleware/verifyToken.js`.

---

## 4. Authentication Flow (Sequence Diagram)

### Overview
This sequence diagram documents the complete user registration, authentication, JWT cookie generation, and protected route authorization lifecycle.

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Browser)
    participant Client as React Client (Login.jsx)
    participant API as Express API (/api/auth)
    participant DB as MongoDB (Prisma)
    participant Context as AuthContext

    %% Registration Sub-flow
    rect rgb(240, 245, 255)
        note right of User: User Registration Flow
        User->>Client: Submit Form (username, email, password)
        Client->>API: POST /api/auth/register { username, email, password }
        API->>API: bcrypt.hash(password, 10)
        API->>DB: prisma.user.create({ data: { username, email, password: hashedPassword } })
        DB-->>API: User record created
        API-->>Client: 201 Created { message: "User created successfully" }
        Client-->>User: Redirect to /login
    end

    %% Login Sub-flow
    rect rgb(255, 245, 240)
        note right of User: User Login & Cookie Token Flow
        User->>Client: Submit Credentials (username, password)
        Client->>API: POST /api/auth/login { username, password }
        API->>DB: prisma.user.findUnique({ where: { username } })
        DB-->>API: User record (including hashedPassword)
        API->>API: bcrypt.compare(password, user.password)
        API->>API: jwt.sign({ id: user.id }, JWT_SECRET_KEY, { expiresIn: 7 days })
        API-->>Client: 200 OK + Set-Cookie: token=<JWT>; HttpOnly + JSON userInfo
        Client->>Context: updateUser(userInfo)
        Client-->>User: Redirect to Homepage / Dashboard
    end

    %% Protected Route Access
    rect rgb(245, 255, 245)
        note right of User: Protected Route Request
        User->>Client: Navigate to /profile or /add
        Client->>API: GET /api/users/profilePosts (Cookie: token=<JWT>)
        API->>API: verifyToken middleware -> jwt.verify(token, JWT_SECRET_KEY)
        API->>DB: Fetch protected data for req.userId
        DB-->>API: User listings & saved posts
        API-->>Client: 200 OK + Data
        Client-->>User: Render Dashboard UI
    end
```

**Key Source Files**: `client/src/routes/login/login.jsx`, `api/controllers/auth.controllers.js`, `api/middleware/verifyToken.js`, `client/src/context/AuthContext.jsx`.

---

## 5. Property Listing Flow (Sequence Diagram)

### Overview
This sequence diagram details the process of creating a new property post: uploading high-res photos directly to Cloudinary, sending form payload to `/api/posts`, saving nested documents in MongoDB, and rendering property cards & Leaflet map markers.

```mermaid
sequenceDiagram
    autonumber
    actor User as Agent / User
    participant Page as NewPostPage.jsx
    participant Widget as UploadWidget (Cloudinary)
    participant CDN as Cloudinary CDN
    participant API as Express API (/api/posts)
    participant MW as verifyToken Middleware
    participant DB as MongoDB (Prisma)
    participant List as ListPage / HomePage

    %% Image Upload
    User->>Page: Fill property fields (title, price, city, beds...)
    User->>Widget: Click "Upload Property Images"
    Widget->>CDN: Direct upload images via unsigned preset "estatehub"
    CDN-->>Widget: Return Cloudinary CDN Image URLs
    Widget->>Page: Update React State setImages([url1, url2...])

    %% Post Submission
    User->>Page: Click "Publish Property"
    Page->>API: POST /api/posts { postData: {...}, postDetail: {...} } (with Cookie)
    API->>MW: verifyToken(req, res, next)
    MW-->>API: Attach req.userId from decoded JWT
    API->>DB: prisma.post.create({ data: { ...postData, userId, postDetail: { create: postDetail } } })
    DB-->>API: Return created Post object with ID
    API-->>Page: 200 OK { id: "post_123", ... }
    Page-->>User: Redirect to /post_123 or /profile

    %% Listing Display
    User->>List: Browse /list or Homepage
    List->>API: GET /api/posts?type=buy&city=...
    API->>DB: prisma.post.findMany({ where: query })
    DB-->>API: Return posts array
    API-->>List: 200 OK + posts JSON
    List-->>User: Render Property Cards & Map Pins
```

**Key Source Files**: `client/src/routes/newPostPage/newPostPage.jsx`, `client/src/components/uploadWidget/UploadWidget.jsx`, `api/controllers/post.controller.js`, `client/src/routes/listPage/listPage.jsx`.

---

## 6. Real-Time Chat Flow (Sequence Diagram)

### Overview
EstateHub employs a dual-track messaging workflow:
1. **HTTP REST Track**: Saves text message records to MongoDB via Express (`/api/messages/:chatId`) and updates `lastMessage` and `seenBy` array fields.
2. **WebSocket Track**: Broadcasts the message payload in real time to the receiver's socket ID via Socket.io server (`:4000`), triggering UI state updates and Zustand notification badge increments.

```mermaid
sequenceDiagram
    autonumber
    actor Sender as Sender Client (User A)
    participant SocketServer as Socket.io Server (:4000)
    participant API as REST API Server (:8800)
    participant DB as MongoDB (Prisma)
    actor Receiver as Receiver Client (User B)

    %% Socket Connection Initialization
    rect rgb(240, 245, 255)
        note right of Sender: Connection & Online Registration
        Sender->>SocketServer: connect()
        Sender->>SocketServer: emit("newUser", userId_A)
        SocketServer->>SocketServer: onlineUser.push({ userId: A, socketId: 101 })

        Receiver->>SocketServer: connect()
        Receiver->>SocketServer: emit("newUser", userId_B)
        SocketServer->>SocketServer: onlineUser.push({ userId: B, socketId: 202 })
    end

    %% Message Sending & Dual-Track Flow
    rect rgb(255, 245, 240)
        note right of Sender: Message Submission & Real-time Broadcast
        Sender->>API: POST /api/messages/:chatId { text: "Hello!" } (with JWT Cookie)
        API->>DB: prisma.message.create({ data: { text, chatId, userId: A } })
        API->>DB: prisma.chat.update({ where: { id: chatId }, data: { lastMessage: "Hello!", seenBy: [A] } })
        DB-->>API: Message record created
        API-->>Sender: 200 OK + Message JSON

        Sender->>SocketServer: emit("sendMessage", { receiverId: B, data: messageObj })
        SocketServer->>SocketServer: getUser(receiverId_B) -> socketId: 202
        SocketServer->>Receiver: io.to(202).emit("getMessage", messageObj)
        Receiver->>Receiver: Append messageObj to Chat state
        Receiver->>Receiver: If chat not active, increment unread badge (Zustand)
    end

    %% Message Reading
    rect rgb(245, 255, 245)
        note right of Receiver: Marking Chat as Read
        Receiver->>API: PUT /api/chats/read/:chatId
        API->>DB: prisma.chat.update({ data: { seenBy: { push: B } } })
        DB-->>API: Chat updated
        API-->>Receiver: 200 OK { message: "Chat read" }
    end
```

**Key Source Files**: `client/src/components/chat/Chat.jsx`, `api/controllers/message.controller.js`, `socket/app.js`, `client/src/lib/notificationStore.js`.

---

## 7. Frontend Component Tree & Page Structure

### Overview
This diagram shows the React component hierarchy managed by React Router v6 in `client/src/App.jsx`. Layout containers (`<Layout />` and `<RequireAuth />`) inject standard shared components (`Navbar`, `Footer`) around outlet views.

```mermaid
graph TD
    App["App.jsx (createBrowserRouter)"]

    subgraph PublicLayout ["Public Layout (<Layout />)"]
        Navbar1["Navbar.jsx"]
        Outlet1["<Outlet />"]
        Footer1["Footer.jsx"]

        P_Home["HomePage.jsx"]
        P_List["ListPage.jsx"]
        P_Single["SinglePage.jsx"]
        P_Login["Login.jsx"]
        P_Reg["Register.jsx"]
    end

    subgraph ProtectedLayout ["Protected Layout (<RequireAuth />)"]
        Navbar2["Navbar.jsx"]
        Outlet2["<Outlet />"]

        P_Profile["ProfilePage.jsx"]
        P_ProfUpdate["ProfileUpdatePage.jsx"]
        P_NewPost["NewPostPage.jsx"]
        P_UpdatePost["UpdatePostPage.jsx"]
    end

    subgraph SharedComponents ["Shared UI Components"]
        C_Card["Card.jsx"]
        C_Filter["Filter.jsx"]
        C_SearchBar["SearchBar.jsx"]
        C_Map["Map.jsx"]
        C_Pin["Pin.jsx"]
        C_Slider["Slider.jsx"]
        C_Chat["Chat.jsx"]
        C_Upload["UploadWidget.jsx"]
        C_List["List.jsx"]
        C_Notif["Notification.jsx"]
    end

    %% Router Mapping
    App --> PublicLayout
    App --> ProtectedLayout

    PublicLayout --> Navbar1
    PublicLayout --> Outlet1
    PublicLayout --> Footer1

    ProtectedLayout --> Navbar2
    ProtectedLayout --> Outlet2

    %% Page to Component Dependencies
    P_Home --> C_SearchBar
    P_Home --> C_List
    P_Home --> C_Footer1

    P_List --> C_Filter
    P_List --> C_Card
    P_List --> C_Map
    C_Map --> C_Pin

    P_Single --> C_Slider
    P_Single --> C_Map

    P_Login --> C_Notif

    P_Profile --> C_List
    P_Profile --> C_Chat
    C_List --> C_Card

    P_ProfUpdate --> C_Upload
    P_NewPost --> C_Upload
    P_UpdatePost --> C_Upload
```

**Key Source Files**: `client/src/App.jsx`, `client/src/routes/layout/layout.jsx`, `client/src/components/*`.

---

## 8. User Journey Flowchart

### Overview
This flowchart depicts the main visitor navigation paths, authorization check triggers, and user dashboard management flows.

```mermaid
flowchart TD
    Start([Visitor lands on EstateHub Homepage]) --> ActionChoice{What does visitor want to do?}

    ActionChoice -->|Search Location / Type| Search[Use SearchBar / Filter]
    ActionChoice -->|Explore Featured| Browse[Browse Featured Rentals & Sale Cards]
    ActionChoice -->|Sign In / Register| Auth[Navigate to /login or /register]

    Search --> ListPage[View ListPage /list with Grid & Map]
    Browse --> SinglePage[View Property Detail /:id]
    ListPage --> SinglePage

    SinglePage --> DetailChoice{Interested in Property?}
    DetailChoice -->|View High-Res Photos| Gallery[Open Image Slider Lightbox]
    DetailChoice -->|Save Property| CheckAuth1{Is User Logged In?}
    DetailChoice -->|Contact Agent / Send Msg| CheckAuth2{Is User Logged In?}

    CheckAuth1 -->|No| Auth
    CheckAuth1 -->|Yes| Save[Toggle Saved Status in DB via /api/users/save]
    
    CheckAuth2 -->|No| Auth
    CheckAuth2 -->|Yes| Chat[Open Socket.io Chat & Send Message]

    Auth --> Dashboard[Logged In User Dashboard /profile]
    
    Dashboard --> UserTask{Dashboard Task}
    UserTask -->|Create Listing| AddPage[Fill NewPostPage /add + Upload Images]
    UserTask -->|Edit Listing| EditPage[Edit Post /posts/update/:id]
    UserTask -->|Manage Profile| UpdateProf[Update Profile /profile/update]
    UserTask -->|Chat with Buyers/Renters| ActiveChat[Respond in Real-time Chat Drawer]

    AddPage --> Published[Property Published & Displayed on List/Home]
    EditPage --> Published
```

**Key Source Files**: `client/src/App.jsx`, `client/src/routes/homePage/homePage.jsx`, `client/src/routes/singlePage/singlePage.jsx`.
