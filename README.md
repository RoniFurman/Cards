# Business Cards Management System

A comprehensive web application for managing business cards and business information. This project is built with React and includes a full-featured business card management system.

## Features

- User Authentication (Login/Register)
- Business Card Management (CRUD operations)
- Dark/Light Mode
- Responsive Design
- Search Functionality
- Favorites System
- Google Maps Integration
- User Role Management (Admin/Business/Regular users)
- Form Validation
- Toast Notifications

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── context/           # React context providers
├── services/          # API services
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
├── assets/            # Static assets
└── styles/            # CSS styles
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Technologies Used

- React
- React Router
- Axios
- JWT
- Bootstrap
- React Icons
- Formik & Yup
- Google Maps API
- React Toastify

## API Endpoints

The application communicates with a RESTful API. The main endpoints include:

- Authentication: `/api/auth/*`
- Business Cards: `/api/cards/*`
- Users: `/api/users/*`
- Favorites: `/api/favorites/*`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
