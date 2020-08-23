import {
  validateNotification
} from "../models/notification.js";
import express from "express";
const router = express.Router();

//add new notification
router.post("/:id/notification", async (req, res) => {
  const User = res.locals.models.user;
  const Notification = res.locals.models.notification;
  let notification = new Notification(req.body);
  const {
    error
  } = validateNotification(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const userHandler = await User.findById(req.params.id, "notifications", {
    lean: true
  });
  if (!userHandler)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

  if (userHandler.notifications.length === 5) {
    userHandler.notifications.shift();
    userHandler.notifications.push(notification)
  } else {
    userHandler.notifications.push(notification);
  };

  const user = await User.findByIdAndUpdate(
    req.params.id, {
      notifications: userHandler.notifications
    }, {
      new: true
    }
  );

  if (!user)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

  res.send(user);
});

export default router;