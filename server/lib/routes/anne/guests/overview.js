import express from "express";
import guestModel from "../../../db/models/anne/guest.model.mjs";

const overviewRouter = express.Router();

// GET /api/admin/overview
overviewRouter.get("/", async (req, res) => {
  try {
    const guests = await guestModel.find().sort({ name: 1 });

    const totalInvited = guests.length;
    const responded = guests.filter((g) => g.hasResponded);
    const totalComing = responded.reduce(
      (sum, g) => (g.isAttending ? sum + (g.numberOfGuests || 0) : sum),
      0
    );

    res.status(200).json({
      status: "ok",
      data: {
        totalInvited,
        totalResponded: responded.length,
        totalComing,
        guests: guests.map((g) => ({
          name: g.name,
          isAttending: g.isAttending,
          hasResponded: g.hasResponded,
          numberOfGuests: g.numberOfGuests,
          dateResponded: g.dateResponded,
        })),
      },
    });
  } catch (error) {
    console.error("Fejl i guestsOverviewRouter:", error);
    res.status(500).json({
      status: "error",
      message: "Kunne ikke hente gæsteoversigt",
    });
  }
});

export default overviewRouter;
