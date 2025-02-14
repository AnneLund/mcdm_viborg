import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  
  const tokenHeader = req.headers['authorization'];
  const useAuthHeader = process.env.USE_JWT || true;
 
  if(useAuthHeader !== 'false')
  {

    if (!tokenHeader) {
    
      return res.json({'status' : 'error', 'message' : 'No access without token.'});
  
    }
    try {
  
      const token = tokenHeader.split(' ')[1];
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
  
    } catch (err) {
  
      console.log('Error', err);
      return res.json({'status' : 'error', 'message' : 'Not a valid Token - are you signed in?'});
  
    }
  }


  return next();

  
}

export default auth;
