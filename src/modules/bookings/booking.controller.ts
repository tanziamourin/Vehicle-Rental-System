import { Request, Response } from "express";
import { bookingService } from "./booking.service";


export const bookingController = {
    // create
    async createBooking(req: Request, res: Response){
        try {
            const {customer_id, vehicle_id ,rent_start_date, rent_end_date}= req.body;
            if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
                return res.status(400).json({
                    success:false,
                    message:"missing somethings",
                    errors:"all are required"
                });
            }
            const booking = await bookingService.createBooking({
                customer_id, 
                vehicle_id ,
                rent_start_date, 
                rent_end_date
            })
          res.status(201).json({
        success: true,
        message: 'Booking successfully',
        data: booking
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: 'booking failed',
        errors: error.message
      });
    }
  },
//  get all 

async getAllBookings (req:Request, res:Response){
    try {
        const {user:{id:userId,role }}=req as any;
        const isAdmin = role === "admin";
        const bookings =await bookingService.getBookings(userId,role,isAdmin);
        res.status(200).json({
            success : true,
            message: isAdmin ? "all bookings" : "your bookings",
            data : bookings
        })

    } catch (error:any) {
        res.status(400).json({
        success: false,
        message: 'failed fetch bookings',
        errors: error.message
      });
    }
},
// update status
async updateBooking (req : Request , res : Response){
    try {
      const {bookingId} = req.params as {bookingId: string};
      const {status} = req.body;
      const {user:{id:userId,role}}= req as any
      
      if (!status) {
        return res.status(400).json({
            success:false,
            message:"status is required",
            errors: 'Provide the status field'
        });
      }
      const booking =await bookingService.updateBookingStatus(
        parseInt(bookingId),
        status,
        userId,
        role
      );
      const message = status=== "cancelled"? "booking cancelled ": status === "returned"?"booking returned ,vehicle available": "booking updated ";
       res.status(200).json({
        success: true,
        message,
        data: booking
      });
    } catch (error : any) {
         res.status(400).json({
        success: false,
        message: 'Failed to update booking',
        errors: error.message
      });
    }
}
}