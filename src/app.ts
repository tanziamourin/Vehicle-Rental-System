import express, { Request, Response } from 'express'

import initDb from './config/db';
import logger from './middleware/logger';
import { userRoutes } from './modules/user/user.route';
import { authRoutes } from './modules/auth/auth.routes';
import { vehicleRoutes } from './modules/vehicles/vehicle.route';
// import { bookingRoutes } from './modules/bookings/booking.route';

const app = express()

// Middleware 
app.use(express.json());


// initDb().catch(err => console.error('Database initialization error:', err));

// Health
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root Endpoint
app.get('/', logger, (req: Request, res: Response) => {
  res.send('Wow😲Vehicle Rental System Server is running!')
})
app.get('/api/v1', logger, (req: Request, res: Response) => {
  res.send('Wow😲Vehicle Rental System Server is running!')
})

// Authentication 
app.use('/api/v1/auth', authRoutes);

// User 
app.use('/api/v1/users', userRoutes);

// Vehicle
app.use('/api/v1/vehicles', vehicleRoutes);

// Booking 
// app.use('/api/v1/bookings', bookingRoutes);

// Not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;