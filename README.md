# Kedai J.A - Restaurant Management System

A modern restaurant management system built with Next.js, MongoDB, and Tailwind CSS.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas Connection (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kedai-ja?retryWrites=true&w=majority

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
```

### 2. Get MongoDB Atlas Connection String

Since this project runs in WebContainer (browser environment), you need to use MongoDB Atlas:

1. **Create MongoDB Atlas Account**: Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. **Create a New Cluster**: Choose the free tier
3. **Create Database User**: Set username and password
4. **Whitelist IP Address**: Add `0.0.0.0/0` for WebContainer access
5. **Get Connection String**: Copy the connection string and update `.env.local`

### 3. Install Dependencies

```bash
npm install
```

### 4. Seed Database (Optional)

```bash
npm run seed
```

This will create:
- Admin account: `admin@kedai-ja.com` / `admin123`
- Sample menu items
- Restaurant settings

### 5. Run Development Server

```bash
npm run dev
```

## 📱 Features

- **Public Website**: Menu display, restaurant info, contact page
- **Admin Panel**: Menu management, settings, dashboard
- **Responsive Design**: Works on desktop and mobile
- **Authentication**: Secure admin login system
- **Database Integration**: MongoDB with Mongoose ODM

## 🔗 Important Links

- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB Atlas
- **Authentication**: JWT with cookies
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## 📋 Database Collections

- **admins**: Admin user accounts
- **menuitems**: Restaurant menu items
- **settings**: Restaurant configuration

## 🚨 Troubleshooting

### MongoDB Connection Issues

If you see `ECONNREFUSED 127.0.0.1:27017`:

1. **Check `.env.local`**: Ensure `MONGODB_URI` points to MongoDB Atlas
2. **Verify Connection String**: Test connection in MongoDB Compass
3. **Check Network Access**: Ensure IP whitelist includes `0.0.0.0/0`
4. **Restart Application**: Run `npm run dev` again

### Admin Login Issues

1. **Run Seed Script**: `npm run seed` to create admin account
2. **Check Credentials**: `admin@kedai-ja.com` / `admin123`
3. **Clear Browser Cache**: Clear cookies and local storage

## 📄 License

MIT License - feel free to use this project for your own restaurant!