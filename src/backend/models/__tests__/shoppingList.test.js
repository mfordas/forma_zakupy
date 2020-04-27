import { validateShoppingList } from "../shoppingList.js";

describe("ShoppingList validation", () => {
  it("should return valid guest if all conditions are correct", () => {
    const newShoppingList = {
      name: "Biedronka",
      products: [],
      members_id: [],
      completed: false
    };

    const validatedShoppingList = validateShoppingList(newShoppingList);

    expect(validatedShoppingList.value).toEqual({
      name: "Biedronka",
      products: [],
      members_id: [],
      completed: false
    });
  });

  it("should return required errors if data is empty", () => {
    const newShoppingList = {
      name: ""
    }
    
    const validatedShoppingList = validateShoppingList(newShoppingList);

    expect(validatedShoppingList.error.message).toContain("Please type name of list");
  });

  it("should return length errors if data is too short", () => {
    const newShoppingList = {
      name: "A"
       }
       
       const validatedShoppingList = validateShoppingList(newShoppingList);

    expect(validatedShoppingList.error.message).toContain(
      "List name should have at least 3 characters"
    );
  });

  it("should return length errors if data is too long", () => {
    const newShoppingList = {
      name: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    }
            
      const validatedShoppingList = validateShoppingList(newShoppingList);

    expect(validatedShoppingList.error.message).toContain(
      "List name should have maximum 26 characters"
    );
   
  });

});
