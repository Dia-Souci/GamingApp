# Gaming E-commerce Frontend

A modern React-based e-commerce frontend for gaming products with comprehensive API integration.

## 🚀 Features

- **Product Catalog**: Browse games by platform with search and filtering
- **Shopping Cart**: Add/remove items with persistent storage
- **Order Management**: Complete checkout flow with form validation
- **API Integration**: RESTful API with error handling and caching
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the application

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── services/           # API services and configuration
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── store/              # State management
└── data/               # Static data and constants
```

## 🔧 API Integration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=5000
VITE_ENVIRONMENT=development
VITE_USE_MOCK_API=false
```

### API Services

The application includes comprehensive API services:

- **Product Service**: CRUD operations for products
- **Order Service**: Order creation and management
- **Auth Service**: Authentication and user management
- **Admin Service**: Administrative operations

### Error Handling

- Automatic retry for failed requests
- User-friendly error messages
- Network error detection
- Authentication error handling

## 🧪 Testing with JSON Server

1. Install JSON Server globally:
```bash
npm install -g json-server
```

2. Start the mock API server:
```bash
json-server --watch src/services/db.json --port 3000
```

3. The API will be available at `http://localhost:3000`

## 📊 API Endpoints

### Products
- `GET /products` - Get all products with filtering
- `GET /products/:id` - Get product by ID
- `GET /products/featured` - Get featured products

### Orders
- `POST /orders` - Create new order
- `GET /orders/:id` - Get order by ID
- `GET /orders` - Get all orders (admin)

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile

## 🔒 Security Features

- JWT token authentication
- Request/response interceptors
- Secure token storage
- CORS handling
- Input validation

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large Desktop: 1440px+

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see above)

3. Start the development server:
```bash
npm run dev
```

4. Start the mock API server (optional):
```bash
json-server --watch src/services/db.json --port 3000
```

## 🏗 Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.