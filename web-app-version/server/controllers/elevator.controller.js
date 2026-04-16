import * as elevatorService from "../services/elevator.service.js";

/**
 * Controller for dispatching the elevator to process requests
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const dispatch = async (req, res, next) => {
  try {
    elevatorService.dispatch();
    res.json({ message: "Dispatch complete" });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for getting all pending requests in the elevator system
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const getRequests = async (req, res, next) => {
  try {
    const requests = elevatorService.getRequests();
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for adding a new request to the elevator system
 *
 * @param {Object} req - The request object containing name, currentFloor, and dropOffFloor
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const addRequest = async (req, res, next) => {
  try {
    elevatorService.addRequest(req.body);
    res.status(201).json({ message: "Request added" });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for getting all riders currently in the elevator
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const getRiders = async (req, res, next) => {
  try {
    const riders = elevatorService.getRiders();
    res.json(riders);
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for getting the current floor of the elevator
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const getCurrentFloor = async (req, res, next) => {
  try {
    const currentFloor = elevatorService.getCurrentFloor();
    res.json({ currentFloor });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for getting the total number of floors traversed by the elevator
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const getFloorsTraversed = async (req, res, next) => {
  try {
    const floorsTraversed = elevatorService.getFloorsTraversed();
    res.json({ floorsTraversed });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for getting the total number of stops made by the elevator
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const getStops = async (req, res, next) => {
  try {
    const stops = elevatorService.getStops();
    res.json({ stops });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for updating the current floor of the elevator
 *
 * @param {Object} req - The request object containing the new floor in req.params.floor
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const updateFloor = async (req, res, next) => {
  try {
    elevatorService.updateFloor(req.params.floor);
    res.json({ message: "Floor updated" });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for moving the elevator up one floor
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const moveUp = async (req, res, next) => {
  try {
    elevatorService.moveUp();
    res.json({ message: "Elevator moved up" });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for moving the elevator down one floor
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>
*/
export const moveDown = async (req, res, next) => {
  try {
    elevatorService.moveDown();
    res.json({ message: "Elevator moved down" });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for checking if the elevator has any pending stops
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const hasStop = async (req, res, next) => {
  try {
    const hasStop = elevatorService.hasStop();
    res.json({ hasStop });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for checking if the elevator has any pending pickups
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const hasPickup = async (req, res, next) => {
  try {
    const hasPickup = elevatorService.hasPickup();
    res.json({ hasPickup });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for checking if the elevator has any pending dropoffs
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const hasDropoff = async (req, res, next) => {
  try {
    const hasDropoff = elevatorService.hasDropoff();
    res.json({ hasDropoff });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for checking if the elevator should return to the lobby after completing a one-way trip
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const checkReturnToLobby = async (req, res, next) => {
  try {
    const checkReturnToLobby = elevatorService.checkReturnToLobby();
    res.json({ checkReturnToLobby });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for moving the elevator back to the lobby (floor 0) after all requests and riders have been processed
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const returnToLobby = async (req, res, next) => {
  try {
    elevatorService.returnToLobby();
    res.json({ message: "Elevator returned to lobby" });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller for resetting the elevator system to its initial state (current floor 0, no requests or riders, etc.)
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Promise<void>}
 */
export const resetElevator = async (req, res, next) => {
  try {
    elevatorService.resetElevator();
    res.json({ message: "Elevator reset" });
  } catch (err) {
    next(err);
  }
};
