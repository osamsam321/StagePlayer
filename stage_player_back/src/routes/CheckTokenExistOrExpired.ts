import { Request, Response, NextFunction, session} from 'express';

export  const checkTokenExistOrExpired = (req: Request, res: Response, next: NextFunction) => {
  const currentTime = Date.now();
  const expiresAt = req.session.spotifyExpiresAt;
  console.log("let see...... " + req.session.spotifyExpiresAt);
  console.log("req path is " + req.path);
  req.path.search("auth");
  const exclude_url_paths=["auth"];
  const is_auth_path = req.path.includes("auth");
  console.log("is auth path: " + is_auth_path);

  if (expiresAt && currentTime < expiresAt || is_auth_path) {
    console.log("currentTime " + currentTime + "expiresat " +   + expiresAt);
    next(); // Token is valid, proceed to the next middleware or route handler
  } else {
    console.log("no token found redirecting to login page");
    res.redirect("http://localhost:3000/api/auth/login")
    next();
  }
};

