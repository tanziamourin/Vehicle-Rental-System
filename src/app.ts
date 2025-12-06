import express, { Request, Response } from 'express'

// import initDb from './config/db';

import { vehicleRoutes } from './modules/vehicles/vehicle.route';
import { protect } from './middleware/auth';
import { authRoute } from './modules/auth/auth.route';
import { userRouter } from './modules/user/user.route';
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
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!')
})
app.get('/api/v1', protect, (req: Request, res: Response) => {
  res.send('Server is running!')
})

// Authentication 
app.use('/api/v1/auth', authRoute);

// User 
app.use('/api/v1/users', userRouter);

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