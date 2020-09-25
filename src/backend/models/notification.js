import Joi from "@hapi/joi";
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    actionCreator: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 255,
    },
    action: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
    },
    readByUser: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: new Date()
    },

});

function validateNotification(notification) {
    const schema = Joi.object({
        actionCreator: Joi.string()
            .min(3)
            .max(26)
            .required()
            .messages({
                "string.empty": "Please type action creator name",
                "string.min": "Action creator should have at least 3 characters",
                "string.max": "Action creator should have maximum 26 characters"
            }),
        action: Joi.string()
            .min(5)
            .max(255)
            .required()
            .messages({
                "string.empty": "Please type action",
                "string.min": "Action should have at least 5 characters",
                "string.max": "Action should have maximum 255 characters",
            }),
        readByUser: Joi.boolean(),
        date: Joi.date(),
    }).options({
        abortEarly: false
    });

    return schema.validate(notification);
}

const notification = notificationSchema;

export {
    notification,
    validateNotification
};