# semester-project-2

School semester project 2 assignment.

## 🔗 Live Demo

[golden-conkies-93f7fb.netlify.app](https://golden-conkies-93f7fb.netlify.app)

## 🌟Highlights of this Project

- The Front-end will allow logged-in users to perform **CRUD** operations (Create, Read, Update, and Delete) on their own auctions.
- Features such as **Placing A Bid**,**Search through Listings and Profiles**, and **Adding New Items to the Auction**.
- Tabs like Listing, Bids and Wins lets the user follow the Excitement of the Auction from their Profile Page.
- The create listing function let the user add a image and several thumb images to the Item.

## ℹ️ Overview

This is a **Front-end for student-only auction application**, implemented as a **single-page application (SPA)**, using **Vite** and **Vanilla TypeScript**.
A separate Project Plan includes details about the steps of this project.

The objective is to deliver a student-only auction web application where registered users can create listings, manage their profiles, and place bids using virtual credits.
Visitors can browse and search listings, while full participation in the auction process requires an account with a @stud.noroff.no email address.

### The pages included are:

Core Functionality:

- Landing Page (Discover auctions)
- Details Page (Bidding & Countdown)
- Profile Page (User stats & Wins)
- Search (Listings & Profiles)
- Auth (Login & Registration)
- Listing Management: modal-based UX (Create, Edit, Delete)

## 📐 System Architecture:

### Backend Context

The application utilizes a **Two-Tier (Client-API)** architecture, connecting directly to the external Noroff API, which functions as the backend. The API Base URL is defined in `src/utils/constants.ts`.

### Component Breakdown:

#### Browser(Client):

The Single-Page Application (SPA) built with Vite and TypeScript. It communicates with the external API via standard `fetch` calls. **Authentication(Access Token) is managed client-side in `localStorage`**, and the API Key is sent via the `X-Noroff-API-Key` header.

#### Server(Noroff API):

The external, Noroff API is a unified service that handles all persistence and business logic (Auth, Auctions/Posts, Profiles), and data storage.

## 🖥️ Tech Stack

### Language:

- TypeScript

### Frameworks & Libraries:

- **Tailwindcss** 4.2.1
- **Vite** 7.3.1
- **Vitest** – Unit testing
- **Playwright** – End-to-end (E2E) testing
- **ESLint** – Code quality and linting
- **Prettier** – Code formatting
- **Husky** – Pre-commit hooks

- **Prototyping tool** – [Figma](https://www.figma.com/design/6axa4UnTyUJeQ9oq2HR4Gq/Semester-Project-2?node-id=1-7&t=PipKrimNDbtk2U5f-1)

- **Hosting services** – [Netlify](https://golden-conkies-93f7fb.netlify.app/)
- **Planning tools** – [GitHub Projects](https://github.com/users/Anne-Zwift/projects/9)

### Out of Scope:

- No front-end frameworks (Vue, React, Nuxt.js or Next.js)

### 🛠 Technical Polish

- **Robust Image Handling:** Implemented a custom centralized helper to manage broken URLs and CORS issues, ensuring a professional UI even with unreliable API data.
- **Lighthouse Optimized:** Performance-focused development with skeleton loaders, optimized loading states and smooth transitions.
- **UX-driven Bidding:** Built a smart "Bidding Gatekeeper" that prevents self-bidding and provides clear real-time feedback on auction status.

### ✍️ Author

I'm a Front-End Development student,
[@Anne-Zwift](https://github.com/Anne-Zwift/).
This repository is my [project](https://github.com/Anne-Zwift/semester-project-2) focusing on CRUD for an Auction App.

## 🚀 Usage

### Authentication

To use the application, you must **Register** or **Log in**. The application connects to the Noroff Auction House API.

- **Registration/Login:** Requires a valid Noroff student email (`@stud.noroff.no`).

### Features

Once logged in, you can:

- View the main Landing Page or Profile Page, and open the Details Page to view more information and images to the auctions item.
- Search for **Auctions and Profiles**,
- Place a Bid on other users Auctions,
- Create, Edit, and Delete your own Auctions.

## ⬇️ Installation

#### Getting Started

### Prerequisites

You need to have [Node.js](https://nodejs.org) and npm installed on your computer.

### Steps

#### 1. Clone the repository:

`git clone [git clone https://github.com/Anne-Zwift/semester-project-2.git]`

#### 2. Navigate to the project directory:

`cd semester-project-2`

#### 3. Install the dependencies:

`npm install`

### Running the Project

To start the development server and view the application in your browser, run the following command:
`npm run dev`
The application will be available at a local URL, typically `http://localhost:5173`.

## 💭 Feedback and Contributing

#### 🎓 This is a project for my education purpose only.
