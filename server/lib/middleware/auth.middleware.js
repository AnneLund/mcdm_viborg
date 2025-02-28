import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const tokenHeader = req.headers["authorization"];
  const useAuthHeader = process.env.USE_JWT === "false" ? false : true;

  if (useAuthHeader) {
    if (!tokenHeader) {
      return res.status(401).json({
        status: "error",
        message: "Adgang nægtet! Ingen token blev fundet i headeren.",
      });
    }

    const tokenParts = tokenHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({
        status: "error",
        message:
          "Ugyldigt token-format! Token skal være i formatet: Bearer <token>",
      });
    }

    const token = tokenParts[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      console.error("Token verificeringsfejl:", err);
      return res.status(401).json({
        status: "error",
        message: "Ugyldigt eller udløbet token! Log ind igen.",
      });
    }
  } else {
    next();
  }
};

export default auth;
