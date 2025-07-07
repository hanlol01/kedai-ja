# Kedai J.A - Restaurant Website

A full-stack restaurant website built with Next.js, MongoDB, and Tailwind CSS.

## Features

- 🏠 **Public Website**: Home, Menu, About, Contact pages
- 👨‍💼 **Admin Panel**: Dashboard, Menu Management, Settings
- 🔐 **Authentication**: JWT-based admin login
- 🤖 **AI Chatbot**: Flowise integration ready
- 📱 **Responsive Design**: Mobile-first approach
- 🎨 **Modern UI**: Tailwind CSS with beautiful components

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Icons**: Lucide React
- **Database**: MongoDB

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd kedai-ja
npm install
```

2. **Set up environment variables:**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/kedai-ja
JWT_SECRET=super_secret_key_kedai_ja_2024
```

3. **Start MongoDB:**
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env.local
```

4. **Seed the database:**
```bash
npm run seed
```

5. **Start the development server:**
```bash
npm run dev
```

6. **Open your browser:**
- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## Default Credentials

- **Email**: admin@kedai-ja.com
- **Password**: admin123

## Project Structure

```
kedai-ja/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Home page
│   ├── menu/              # Menu page
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── admin/             # Admin panel
│   │   ├── login/         # Admin login
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── menu/          # Menu management
│   │   └── settings/      # Settings management
│   └── api/               # API routes
├── lib/                   # Utilities
│   ├── db.ts             # MongoDB connection
│   └── auth.ts           # JWT authentication
├── models/               # Mongoose models
│   ├── Admin.ts
│   ├── MenuItem.ts
│   └── Settings.ts
├── scripts/
│   └── seed.ts           # Database seeding
├── public/
│   └── chatbot.js        # Flowise chatbot
└── middleware.ts         # Route protection
```

## API Endpoints

### Public
- `GET /api/menu` - Get all menu items
- `GET /api/settings` - Get restaurant settings

### Admin (Protected)
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `POST /api/menu` - Create menu item
- `PUT /api/menu/[id]` - Update menu item
- `DELETE /api/menu/[id]` - Delete menu item
- `PUT /api/settings` - Update settings

## Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secure_jwt_secret
NODE_ENV=production
```

## Database Schema

### Admin
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### MenuItem
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: 'Makanan' | 'Minuman',
  image: String (URL),
  available: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Settings
```javascript
{
  restaurantName: String,
  description: String,
  address: String,
  contact: String,
  hours: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Chatbot Integration

The project includes Flowise AI chatbot integration. To activate:

1. Set up your Flowise instance
2. Update `public/chatbot.js` with your chatflow ID and API host
3. The chatbot will appear as a floating button on all pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, email admin@kedai-ja.com or create an issue in the repository.