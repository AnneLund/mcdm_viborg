import express from "express";
import guestModel from "../../../db/models/anne/guest.model.mjs";

const overviewRouter = express.Router();

const estimateFromName = (name) => {
  if (!name) return 1;
  return (
    name
      .split(/,| og /i)
      .map((n) => n.trim())
      .filter(Boolean).length || 1
  );
};

// GET /api/admin/overview
overviewRouter.get("/", async (req, res) => {
  try {
    const guests = await guestModel.find().sort({ name: 1 });

    let totalInvited = 0;
    let totalComing = 0;
    let totalDeclined = 0;
    let totalPending = 0;

    guests.forEach((guest) => {
      // Estimér antal inviterede personer
      const invitedCount = estimateFromName(guest.name);

      const isPending =
        guest.isAttending === null || guest.isAttending === undefined;
      const isComing = guest.isAttending === true;
      const isNotComing = guest.isAttending === false;

      totalInvited += invitedCount;

      if (isPending) {
        totalPending += invitedCount;
      } else if (isComing) {
        totalComing += guest.numberOfGuests || 0;
        const notComing = Math.max(
          invitedCount - (guest.numberOfGuests || 0),
          0
        );
        totalDeclined += notComing;
      } else if (isNotComing) {
        totalDeclined += invitedCount;
      }
    });

    res.status(200).json({
      status: "ok",
      data: {
        totalInvited,
        totalComing,
        totalDeclined,
        totalPending,
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
