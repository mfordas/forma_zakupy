import { validateNotification } from "../notification.js";

describe("Notification validation", () => {
  it("should return valid notification if all conditions are correct", () => {
    const newNotification = {
        actionCreator:"User",
        action: "Add to shopping list",
    };

    const validatedNotification = validateNotification(newNotification);

    expect(validatedNotification.value).toEqual({
        actionCreator:"User",
        action: "Add to shopping list",
    });
  });

  it("should return required errors if data is empty", () => {
    const newNotification = {
        actionCreator:"",
        action: "",
    }
    
    const validatedNotification = validateNotification(newNotification);

    expect(validatedNotification.error.message).toContain("Please type action creator name");
    expect(validatedNotification.error.message).toContain("Please type action");
  });

  it("should return length errors if data is too short", () => {
    const newNotification = {
        actionCreator:"a",
        action: "a",
       }
       
       const validatedNotification = validateNotification(newNotification);

    expect(validatedNotification.error.message).toContain(
      "Action creator should have at least 3 characters"
    );
    expect(validatedNotification.error.message).toContain(
      "Action should have at least 5 characters"
    );
  });

  it("should return length errors if data is too long", () => {
    const newNotification = {
        actionCreator: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
        action: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      }
      
      const validatedNotification = validateNotification(newNotification);

    expect(validatedNotification.error.message).toContain(
      "Action creator should have maximum 26 characters"
    );
    expect(validatedNotification.error.message).toContain(
      "Action should have maximum 255 characters"
    );
  });
 
});
