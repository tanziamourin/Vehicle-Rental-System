import { pool } from './../../config/db';


export const bookingService ={
    // create booking
    async createBooking(data:{
        customer_id:number;
        vehicle_id:number;
        rent_start_date:string;
        rent_end_date:string;
    }){
        
    const {customer_id ,vehicle_id ,rent_start_date,rent_end_date } = data ;
    // validate dates

    const startDate = new Date (rent_start_date);
    const endDate = new Date (rent_end_date);
        if (endDate <= startDate) {
            throw new Error("end date must be greater than start  date");
            
        }
        // check vehicle availability

        const vehicleRes = await pool.query(
            `SELECT * FROM vehicles WHERE id = $1`,
            [vehicle_id]
        );
        if (vehicleRes.rows.length ===0) {
            throw new Error("vehicle not found");
            
        }
        const vehicle = vehicleRes.rows[0];

        // total cost 
        const days = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000* 60*60*24)
        );
     const totalPrice = days* parseFloat(vehicle.daily_rent_price);

        // insert booking
        const bookingRes = await pool.query(
            `INSERT INTO bookings 
            (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [customer_id, vehicle_id, rent_start_date, rent_end_date,totalPrice,'active']
        );
        // update veh to booked

        await pool.query(
            `UPDATE vehicles SET availability_status = $1 WHERE id = $2`,
            ["booked",vehicle_id]
        );
        return{
            ...bookingRes.rows[0],
            vehicle:{
                name : vehicle.vehicle_name,
                price_per_day : vehicle.daily_rent_price 
            }
        };
    },

    // get bookings by admin or customer
    async getBookings(userId:number, role:string, isAdmin:boolean = false){
        let query = "";
        let params : any [] = [];
        if (isAdmin) {
            query = `
             SELECT 
            bk.*, 
            usr.name AS customer_name,
            usr.email AS customer_email,
            veh.vehicle_name,
            veh.registration_number
            FROM bookings AS bk
            JOIN users AS usr ON bk.customer_id = usr.id
            JOIN vehicles AS veh ON bk.vehicle_id = veh.id
            ORDER BY bk.id;`
        } else {
            query = `
            SELECT 
            bk.id,
            bk.vehicle_id,
            bk.rent_start_date,
            bk.rent_end_date,
            bk.total_price,
            bk.status,
            veh.vehicle_name,
            veh.registration_number,
            veh.type
            FROM bookings AS bk
            JOIN vehicles AS veh ON bk.vehicle_id = veh.id
            WHERE bk.customer_id = $1
            ORDER BY bk.id;
            `
            params = [userId];
        }
        const result = await pool.query(query,params);
        return result.rows;
    },
    // get booking by id

    async getBookingById (id:number){
         const result = await pool.query(
              `SELECT * FROM bookings WHERE id=$1`,
                [id]
         );
         if (result.rows.length === 0) {
            throw new Error("booking not found");
            
         }
         return result.rows[0];
    },

  async updateBookingStatus(
    id: number,
    status: string,
    userId: number,
    role: string
  ) {
    const booking = await this.getBookingById(id);
    if (role === 'customer') {
        if (status !== 'cancelled') {
            throw new Error("customer can only cancel booking");
            
        }
        if (booking.customer_id !== userId) {
            throw new Error("can't cancel another customer's booking");
            
        }
        if (new Date() >= new Date(booking.rent_start_date) ) {
            throw new Error("cannot cancel after the booking start date");
            
        }
       
    }
// admin mark
     if (status === 'returned' && role !== 'admin') {
            throw new Error("only admin can booking as returned");
            
        }
        const updateRes = await pool.query(
            `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, id]
        );
        if (status === 'cancelled' || status === 'returned') {
            await pool.query(
                `UPDATE vehicles SET availability_status = $1 WHERE id = $2`, ['available', booking.vehicle_id]
            );
            if (status === 'returned') {
                const VercelRes = await pool.query(
                    `SELECT availability_status FROM vehicles WHERE id = $1`, [booking.vehicle_id]
                );
                return{
                    ...updateRes.rows[0],
                    vehicle:{
                    availability_status : VercelRes.rows[0].availability_status 
                    }
                };
            }
        }
        return updateRes.rows[0];
  },
//   delete booking 
async deleteBooking(id:number){
     const booking = await this.getBookingById(id);
     if (booking.status === 'active') {
        await pool.query(
            `UPDATE vehicles SET availability_status =$1 WHERE id = $2` ,
            ['availability', booking.vehicle_id]
        );
     }
     const result = await pool.query(`
        DELETE FROM bookings WHERE id =$1 RETURNING id`,
        [id]);
   return result.rows[0];
}
    
};


