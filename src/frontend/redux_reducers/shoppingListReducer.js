import {
    TYPES
} from '../redux_actions/types';

const initialState = {
    shoppingLists: [],
    shoppingListAdded: null,
    shoppingListDeleted: null,
    productAdded: null,
    productsProposals: [],
    products: [],
    shoppingListInfo: {
        name: '',
        idShoppingList: '',
        membersIds: [],
    },
    members: [],
    userAdded: false,
    usersProposals: [],
    productDeleted: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case TYPES.SHOWSHOPPINGLISTS:
            return {
                ...state,
                shoppingLists: action.shoppingLists,
            };
        case TYPES.ADDSHOPPINGLIST:
            return {
                ...state,
                shoppingListAdded: action.shoppingListAdded
            };
        case TYPES.DELETESHOPPINGLIST:
            return {
                ...state,
                shoppingListDeleted: action.shoppingListDeleted
            };
        case TYPES.ADDPRODUCT:
            return {
                ...state,
                products: action.products,
                productAdded: action.productAdded
            };
        case TYPES.SHOWPRODUCTPROPOSALS:
            return {
                ...state,
                productsProposals: action.productsProposals
            };
        case TYPES.SHOWSHOPPINGLIST:
            return {
                ...state,
                products: action.products
            };
        case TYPES.CROSSPRODUCT:
            return {
                ...state,
            };
        case TYPES.RESETSHOPPINGLIST:
            return {
                ...state,
            };
        case TYPES.SETSHOPPINGLISTINFO:
            return {
                ...state,
                shoppingListInfo: action.shoppingListInfo
            };
        case TYPES.GETSHOPPINGLISTMEMBERS:
            return {
                ...state,
                members: action.members
            };
        case TYPES.DELETESHOPPINGLISTMEMBER:
            return {
                ...state,
                shoppingListInfo: {
                    ...state.shoppingListInfo,
                    membersIds: action.membersIds,
                },
            };
        case TYPES.ADDSHOPPINGLISTMEMBER:
            return {
                ...state,
                userAdded: action.userAdded,
                shoppingListInfo: {
                    ...state.shoppingListInfo,
                    membersIds: action.membersIds,
                },
            };
        case TYPES.SHOWUSERSPROPOSAL:
            return {
                ...state,
                usersProposals: action.usersProposals
            };
        case TYPES.DELETEPRODUCTFROMSHOPPINGLIST:
            return {
                ...state,
                products: action.products,
                productDeleted: action.productDeleted
            };
        default:
            return state;
    }
}