
import app from "./app";


const PORT = process.env.PORT || 5000;
if (process.env.VERCEL != '1') {
  
app.listen(PORT, () => {
  console.log(`Server is running on post 5000 ${PORT}`);
});

}
export default app ;