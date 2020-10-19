import _ from "lodash";
import express from "express";
import { auth } from "../middleware/authorization.js";

import {
  validateNotification
} from "../models/notification.js";
const router = express.Router();

const addNewNotification = async (req, res) => {
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
};

router.post("/:id/notification", addNewNotification);

const getNotifications = async (req, res) => {
  const User = res.locals.models.user;
  const user = await User.findById(req.params.id);

  if (!user)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");

  const notifications = _.filter(user.notifications);

  res.send(notifications);
}

router.get("/:id", auth, getNotifications);

const setNotificationAsReaded = async (req, res) => {
  const User = res.locals.models.user;
  const userHandler = await User.findById(req.params.id, "notifications", {
    lean: true
  });

  if (!userHandler)
    return res.status(404).send("Nie znaleziono użytkowanika z takim ID.");
  
    userHandler.notifications.map(notification => notification._id.toString() === req.params.idNotification ? notification.readByUser=true : null );
    const user = await User.findByIdAndUpdate(
      req.params.id, {
        notifications: userHandler.notifications
      }, {
        new: true
      }
    );

  res.send(user);
};

router.put("/:id/notification/:idNotification", auth, setNotificationAsReaded);

export default router;