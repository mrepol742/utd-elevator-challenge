import Person from "../models/person.model.js";

let requests = [];
let riders = [];
let currentFloor = 0;
let floorsTraversed = 0;
let stops = 0;
let isDispatching = false;

/**
 * Get all pending requests
 *
 * @returns {Person[]}
 */
export const getRequests = () => requests;

/**
 * Add a new request to the elevator system
 *
 * @param {Object} request - The request object containing name, currentFloor, and dropOffFloor
 * @returns {void}
 */
export const addRequest = (request) => {
  const person = new Person(
    request.name,
    request.currentFloor,
    request.dropOffFloor,
  );
  requests.push(person);
};

/**
 * Get all riders currently in the elevator
 *
 * @returns {Person[]}
 */
export const getRiders = () => riders;

/**
 * Get the current floor of the elevator
 *
 * @returns {number}
 */
export const getCurrentFloor = () => currentFloor;

/**
 * Get the total number of floors traversed by the elevator
 *
 * @returns {number}
 */
export const getFloorsTraversed = () => floorsTraversed;

/**
 * Get the total number of stops made by the elevator
 *
 * @returns {number}
 */
export const getStops = () => stops;

/**
 * Update the current floor of the elevator
 *
 * @param {number} floor - The new floor to set as the current floor
 * @returns {void}
 */
export const updateFloor = (floor) => {
  currentFloor = Number(floor);
};

/**
 * Dispatch the elevator to process all pending requests and riders
 *
 * @returns {Promise<void>}
 */
export const dispatch = async () => {
  isDispatching = true;

  while (isDispatching && (requests.length > 0 || riders.length > 0)) {
    const nextFloor = getNextStop();

    if (nextFloor === null) break;

    while (isDispatching && currentFloor < nextFloor) {
      await moveUp();
    }

    while (isDispatching && currentFloor > nextFloor) {
      await moveDown();
    }

    hasStop();
  }

  isDispatching = false;
};

/**
 * Determine the next floor the elevator should stop at based on current requests and riders
 *
 * @returns {number|null} - The next floor to stop at, or null if there are no pending stops
 */
const getNextStop = () => {
  const dropoffFloors = riders.map((rider) => rider.dropOffFloor);
  const pickupFloors = requests.map((request) => request.currentFloor);

  if (dropoffFloors.length > 0) {
    const aboveOrEqualDropoffs = dropoffFloors
      .filter((floor) => floor >= currentFloor)
      .sort((a, b) => a - b);

    if (aboveOrEqualDropoffs.length > 0) {
      return aboveOrEqualDropoffs[0];
    }

    const belowDropoffs = dropoffFloors
      .filter((floor) => floor < currentFloor)
      .sort((a, b) => b - a);

    if (belowDropoffs.length > 0) {
      return belowDropoffs[0];
    }
  }

  const aboveOrEqualPickups = pickupFloors
    .filter((floor) => floor >= currentFloor)
    .sort((a, b) => a - b);

  if (aboveOrEqualPickups.length > 0) {
    return aboveOrEqualPickups[0];
  }

  const belowPickups = pickupFloors
    .filter((floor) => floor < currentFloor)
    .sort((a, b) => b - a);

  if (belowPickups.length > 0) {
    return belowPickups[0];
  }

  return null;
};

/**
 * Process a single person's request to go from their current floor to their drop-off floor
 *
 * @param {Person} person - The person whose request is being processed
 * @returns {Promise<void>}
 */
export const goToFloor = async (person) => {
  if (!isDispatching) return;

  const moveToFloor = async (floor) => {
    while (currentFloor < floor && isDispatching) await moveUp();
    while (currentFloor > floor && isDispatching) await moveDown();
  };

  await moveToFloor(person.currentFloor);

  const pickupIndex = requests.findIndex(
    (request) =>
      request.name === person.name &&
      request.currentFloor === person.currentFloor &&
      request.dropOffFloor === person.dropOffFloor,
  );

  if (pickupIndex !== -1) {
    riders.push(requests[pickupIndex]);
    requests.splice(pickupIndex, 1);
    stops++;
  }

  await moveToFloor(person.dropOffFloor);

  const riderIndex = riders.findIndex(
    (rider) =>
      rider.name === person.name &&
      rider.currentFloor === person.currentFloor &&
      rider.dropOffFloor === person.dropOffFloor,
  );

  if (riderIndex !== -1) {
    riders.splice(riderIndex, 1);
    stops++;
  }
};

/**
 * Move the elevator up one floor, updating the current floor, floors traversed, and stops if necessary
 *
 * @returns {Promise<void>}
 */
export const moveUp = () => {
  return new Promise((resolve) => {
    currentFloor++;
    floorsTraversed++;
    if (hasStop()) {
      stops++;
    }
    setTimeout(resolve, 1000);
  });
};

/**
 * Move the elevator down one floor, updating the current floor, floors traversed, and stops if necessary
 *
 * @returns {Promise<void>}
 */
export const moveDown = () => {
  return new Promise((resolve) => {
    if (currentFloor > 0) {
      currentFloor--;
      floorsTraversed++;
      if (hasStop()) {
        stops++;
      }
    }
    setTimeout(resolve, 1000);
  });
};

/**
 * Move the elevator back to the lobby (floor 0) after all requests and riders have been processed
 *
 * @returns {Promise<void>}
 */
export const returnToLobby = async () => {
  while (currentFloor > 0) {
    await moveDown();
  }
};

/**
 * Check if the elevator should stop at the current floor to pick up or drop off riders
 *
 * @returns {boolean} - True if the elevator has a stop at the current floor, false otherwise
 */
export const hasStop = () => {
  return hasPickup() || hasDropoff();
};

/**
 * Check if there are any pending pickups at the current floor and process them by adding the riders to the elevator and removing the requests
 *
 * @returns {boolean} - True if there were pickups at the current floor, false otherwise
 */
export const hasPickup = () => {
  const pickups = requests.filter(
    (request) => request.currentFloor === currentFloor,
  );
  if (pickups.length) {
    pickups.forEach((p) =>
      console.info(`Picking up ${p.name} at floor ${currentFloor}`),
    );
    riders.push(...pickups);
    requests = requests.filter(
      (request) => request.currentFloor !== currentFloor,
    );
    return true;
  }
  return false;
};

/**
 * Check if there are any pending drop-offs at the current floor and process them by removing the riders from the elevator
 *
 * @returns {boolean} - True if there were drop-offs at the current floor, false otherwise
 */
export const hasDropoff = () => {
  const hasDropoff = riders.some(
    (rider) => rider.dropOffFloor === currentFloor,
  );
  if (hasDropoff) {
    const dropoffs = riders.filter(
      (rider) => rider.dropOffFloor === currentFloor,
    );
    dropoffs.forEach((d) =>
      console.info(`Dropping off ${d.name} at floor ${currentFloor}`),
    );
    riders = riders.filter((rider) => rider.dropOffFloor !== currentFloor);
    return true;
  }
  return false;
};

/**
 * Check if the elevator should return to the lobby (floor 0) after processing all requests and riders
 *
 * @returns {boolean} - True if the elevator should return to the lobby, false otherwise
 */
export const checkReturnToLobby = () => {
  return requests.length === 0 && riders.length === 0;
};

/**
 * Reset the elevator system to its initial state, clearing all requests, riders, and resetting the current floor, floors traversed, and stops
 *
 * @returns {void}
 */
export const resetElevator = () => {
  requests = [];
  riders = [];
  currentFloor = 0;
  floorsTraversed = 0;
  stops = 0;
  isDispatching = false;
};
