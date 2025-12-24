import express, { Request, Response } from 'express'
import { vehicleRoutes } from './modules/vehicles/vehicle.route';
import { authRoute } from './modules/auth/auth.route';
import { userRouter } from './modules/user/user.route';
import { bookingRoutes } from './modules/bookings/booking.route';
// import { initDB } from './config/db';
import { logger } from './middleware/log.middleware';
import { initDB } from './config/db';



const app = express()

// Middleware 
app.use(express.json());
app.use(logger);

async function initDatabase (){
  try {
    await initDB();
    console.log("db initialized")
  } catch (error) {
    console.error(error);
  }
}
 initDatabase();

 
// Health
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Root Endpoint
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running!!!!!')
})
app.get('/api/v1', (req: Request, res: Response) => {
  res.send('Server is running! on vercel')
})

// Authentication 
app.use('/api/v1/auth', authRoute);

// User 
app.use('/api/v1/users', userRouter);

// Vehicle
app.use('/api/v1/vehicles', vehicleRoutes);

// Booking 
app.use('/api/v1/bookings', bookingRoutes);

// Not found
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;