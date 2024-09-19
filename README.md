
# Chat-Buddy 

## Introduction

Chat-Buddy is a real-time chat application designed to provide a free and secure communication platform. It supports 1-on-1 and group messaging and includes additional features such as AI bot interaction, video calls, and file sharing. This README outlines the setup process for the project and explains the technologies used and their purposes.[link](https://chat-buddy-three.vercel.app/)

---

## Features

- **Real-Time Messaging**: Instant communication between users.
- **1-on-1 and Group Chats**: Support for private and group conversations.
- **Notifications**: Alerts for unread messages.
- **Message History**: Persistent chat history storage.
- **Edit Messages**: Real-time editing of sent messages.
- **File Sharing**: Share images and files during chats.
- **User Authentication**: JWT-based authentication to securely manage user sessions.
- **AI Chatbot**: Integrated AI chatbot powered by Gemini for interactive conversations.
- **Video Calls**: Video call functionality integrated using Zegocloud.

---

## Tech Stack

- **Frontend**:  
   Built with [Next.js](https://nextjs.org/) to enable server-side rendering for optimized performance. Pusher are used for real-time messaging.

- **Backend**:  
   Developed with [Node.js](https://nodejs.org/) and RESTful APIs to manage authentication, messaging, notifications, and file storage.

- **Database**:  
   [MongoDB](https://www.mongodb.com/atlas) is used for persistent storage of user data, chat history, and message logs.

- **Real-Time Messaging**:  
   [Pusher](https://pusher.com/) is utilized for real-time, bi-directional communication between the client and server.

- **Authentication**:  
   JWT-based authentication is handled via `next-auth` to securely manage user sessions.

- **AI Bot Integration**:  
   [Gemini](https://ai.google.dev/) provides AI-driven conversational interaction, enriching user engagement.

- **Video Call**:  
   [Zegocloud](https://www.zegocloud.com/) is used for virtual meetings and video calls between users.

---

## Setup Guide

Follow these steps to set up the Chat-Buddy project on your local machine:

### Prerequisites

Ensure you have the following installed on your system:
- **Node.js** (version 14 or above)
- **MongoDB Atlas** (cloud database)
- **Pusher**, **Cloudinary**, **Zegocloud**, **Gemini API keys** (instructions provided below)

### Steps to Setup

1. **Clone the Repository**  
   Run the following command to clone the repository:
   ```bash
   git clone https://github.com/meenalnimje/chat-buddy.git

2. **Install Dependencies**
    Navigate to the project folder and install the required packages:

    ```bash
    cd chat-buddy
    npm install
3. **Configure Environment Variables**
    Create a .env file in the root of the project folder with the following environment variables:

    - **MONGODB_URL**:
        Create an account on [MongoDB Atlas](https://www.mongodb.com/atlas) and set up a cluster. Follow these steps:

        -In the Database section, click on "Connect" and select "Connect your application".

        -Copy the MongoDB connection string and add it to your **MONGODB_URL** .env file
    - **NEXTAUTH_SECRET:**
        Add a random string to your NEXTAUTH_SECRET env variable to generate tokens for secure authentication:
    - **PUSHER configuration**
        Create a [Pusher](https://pusher.com/) account and set up an app

        -Go to the "Channels" section, create an app named "Chat-Buddy", and copy the API keys into your .env file.
        - **PUSHER_APP_ID**
        - **NEXT_PUBLIC_PUSHER_APP_KEY**
        - **PUSHER_SECRET**

    - set **NEXTAUTH_URL** variable to =http://localhost:3000

    - **Cloudinary Configuration:**
        
        - **NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME** : Sign up on [Cloudinary](https://cloudinary.com/) and get the Cloud Name from your dashboard and copy.

    - **Zegocloud Configuration:**
        - Create an account on [Zegocloud](https://www.zegocloud.com/) and set up a new project. Copy the AppID and ServerSecret:
        - **NEXT_PUBLIC_ZEGO_APP_ID**
      -  **NEXT_PUBLIC_ZEGO_SERVER_SECRET**

    - **Gemini API Key**:Go to Google AI Studio and click on get api key,create a project and get the api key and paste it here.
        - **NEXT_PUBLIC_GEMINI_API_KEY**=your_gemini_api_key

4. **Run the application**
    ```bash
    npm run dev

5. **Testing:**
    click on [chat-buddy](https://chat-buddy-three.vercel.app/) and You can log in as a guest user or create your own account:
    - Email: guest@gmail.com
    - Password: 0000
    Watch [Demo-video](https://youtu.be/P3k4BxuexJw) for the demo of the website and its features.
