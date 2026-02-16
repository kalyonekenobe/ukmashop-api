export const ORDER_CONTROLLER_MESSAGES = {
  FIND_ALL: {
    ORDERS_SUCCESSFULLY_FETCHED: {
      EN: 'The list of orders was successfully fetched',
    },
  },
  FIND_ALL_PRIVATE: {
    ORDERS_SUCCESSFULLY_FETCHED: {
      EN: 'The private list of orders was successfully fetched',
    },
  },
  FIND_ONE: {
    ORDER_SUCCESSFULLY_FETCHED: {
      EN: 'The order was successfully fetched',
    },
    ORDER_NOT_FOUND: {
      EN: 'Order was not found',
    },
  },
  FIND_ONE_OR_THROW: {
    ORDER_SUCCESSFULLY_FETCHED: {
      EN: 'The order was successfully fetched',
    },
    ORDER_NOT_FOUND: {
      EN: 'Order was not found',
    },
  },
  FIND_ONE_PRIVATE: {
    ORDER_SUCCESSFULLY_FETCHED: {
      EN: 'The private order was successfully fetched',
    },
    ORDER_NOT_FOUND: {
      EN: 'Private order was not found',
    },
  },
  CREATE: {
    ORDER_SUCCESSFULLY_CREATED: {
      EN: 'New order was successfully created',
    },
  },
  UPDATE: {
    ORDER_SUCCESSFULLY_UPDATED: {
      EN: 'The order was successfully updated',
    },
    ORDER_IS_FORBIDDEN_TO_UPDATE: {
      EN: 'Cannot update the order with the id different from yours',
    },
  },
  REMOVE: {
    ORDER_SUCCESSFULLY_REMOVED: {
      EN: 'The order was successfully removed',
    },
    ORDER_IS_FORBIDDEN_TO_REMOVE: {
      EN: 'Cannot remove the order with the id different from yours',
    },
  },
};
