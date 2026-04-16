const elevator = document.getElementById("elevator");
const pickupFloorInput = document.getElementById("pickup-floor");
const dropFloorInput = document.getElementById("drop-floor");
const elevatorStatus = document.getElementById("elevator-status");
const callButton = document.querySelector("button.bg-blue-500");
const resetButton = document.querySelector("button.bg-red-500");
const floorHeight = 48;

let currentFloor = 0;
let isCallInProgress = false;

// paused state to prevent multiple dispatches while elevator is moving
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Update the elevator position
 *
 * @returns {void}
 */
const updateElevatorPosition = () => {
  elevator.style.bottom = `${currentFloor * floorHeight}px`;
  console.log(
    `Elevator updated to floor ${currentFloor}, bottom: ${currentFloor * floorHeight}px`,
  );
};

/**
 * Update the elevator status based on current requests and riders at the current floor
 *
 * @param {*} requests
 * @param {*} riders
 * @returns {void}
 */
const updateElevatorStatus = (requests, riders) => {
  if (requests.length > 0) {
    const nextPickup = requests.find(
      (request) => request.currentFloor === currentFloor,
    );
    if (nextPickup) {
      elevatorStatus.textContent = `Picking up at floor ${currentFloor}`;
      return;
    }
  }

  if (riders.length > 0) {
    const nextDropoff = riders.find(
      (rider) => rider.dropOffFloor === currentFloor,
    );
    if (nextDropoff) {
      elevatorStatus.textContent = `Dropping off at floor ${currentFloor}`;
      return;
    }
  }

  elevatorStatus.textContent = `Moving... Current floor: ${currentFloor}`;
};

/**
 * Get the current floor of the elevator
 *
 * @returns {Promise<void>}
 */
const getCurrentFloor = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/elevator/current-floor",
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log("Current floor from server:", data);
    currentFloor = data.currentFloor;
    updateElevatorPosition();
    return data;
  } catch (err) {
    console.error("Error fetching current floor:", err);
  }
};

/**
 * Get all pending requests in the elevator system
 *
 * @returns {Promise<void>}
 */
const getRequests = async () => {
  try {
    const response = await fetch("http://localhost:3000/elevator/requests");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log("Requests:", data);
    return data;
  } catch (err) {
    console.error("Error fetching requests:", err);
    return [];
  }
};

/**
 * Get all riders currently in the elevator
 *
 * @returns {Promise<void>}
 */
const getRiders = async () => {
  try {
    const response = await fetch("http://localhost:3000/elevator/riders");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log("Riders:", data);
    return data;
  } catch (err) {
    console.error("Error fetching riders:", err);
    return [];
  }
};

/**
 * Create a new request in the elevator system
 *
 * @param {*} pickupFloor
 * @param {*} dropFloor
 * @returns {Promise<void>}
 */
const createRequest = async (pickupFloor, dropFloor) => {
  try {
    console.log(`Creating request: pickup ${pickupFloor}, drop ${dropFloor}`);
    const response = await fetch("http://localhost:3000/elevator/requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `Person-${Date.now()}`,
        currentFloor: pickupFloor,
        dropOffFloor: dropFloor,
      }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log("Request created:", data);
    return data;
  } catch (err) {
    console.error("Error creating request:", err);
  }
};

/**
 * Dispatch the elevator to process all pending requests and riders
 *
 * @returns {Promise<void>}
 */
const dispatchElevator = async () => {
  try {
    console.log("Dispatching elevator...");
    const response = await fetch("http://localhost:3000/elevator/dispatch", {
      method: "POST",
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log("Dispatch response:", data);
    return data;
  } catch (err) {
    console.error("Error dispatching elevator:", err);
  }
};

/**
 * Reset the elevator to the lobby and clear all requests and riders
 *
 * @returns {Promise<void>}
 */
const resetElevator = async () => {
  try {
    console.log("Resetting elevator...");
    const response = await fetch(
      "http://localhost:3000/elevator/reset-elevator",
      {
        method: "DELETE",
      },
    );
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log("Reset response:", data);
    currentFloor = 0;
    updateElevatorPosition();
    pickupFloorInput.value = "";
    dropFloorInput.value = "";
    elevatorStatus.textContent = "Elevator reset to lobby";
    return data;
  } catch (err) {
    console.error("Error resetting elevator:", err);
  }
};

/**
 * Main function to handle calling the elevator to a pickup floor and dropping off at a destination floor
 *
 * @returns {Promise<void>}
 */
const callFloor = async () => {
  const pickupFloor = Number(pickupFloorInput.value);
  const dropFloor = Number(dropFloorInput.value);

  if ((!pickupFloor && pickupFloor !== 0) || (!dropFloor && dropFloor !== 0)) {
    alert("Please enter both pickup and drop floors");
    isCallInProgress = false;
    return;
  }

  console.log("Call floor started:", { pickupFloor, dropFloor });
  elevatorStatus.textContent = `Request ${pickupFloor}`;

  try {
    await createRequest(pickupFloor, dropFloor);

    if (isCallInProgress) {
      console.log("Call already in progress, ignoring new call");
      return;
    }

    isCallInProgress = true;
    await sleep(500);
    await dispatchElevator();

    let isMoving = true;
    let reachedPickup = false;

    while (isMoving) {
      await getCurrentFloor();

      if (!reachedPickup && currentFloor === pickupFloor) {
        elevatorStatus.textContent = `Arrive at floor ${dropFloor} to dropoff`;
        reachedPickup = true;
      }

      const requests = await getRequests();
      const riders = await getRiders();

      // by this time the server already move req to rider
      if (riders.some((req) => req.currentFloor === currentFloor)) {
        elevatorStatus.textContent = `Arrive at floor ${currentFloor} to pickup`;
      }

      console.log(
        `Polling - Floor: ${currentFloor}, Requests: ${requests.length}, Riders: ${riders.length}`,
      );

      if (requests.length === 0 && riders.length === 0) {
        elevatorStatus.textContent = `Arrived at floor ${currentFloor}`;
        console.log("All passengers delivered, stopping polling");
        isMoving = false;
      }

      await sleep(500);
    }

    pickupFloorInput.value = "";
    dropFloorInput.value = "";
  } finally {
    isCallInProgress = false;
  }
};

/**
 * Handling the call and reset button clicks to trigger the appropriate functions
 */
document.addEventListener("DOMContentLoaded", async () => {
  resetButton.addEventListener("click", () => {
    resetElevator();
  });

  callButton.addEventListener("click", () => {
    callFloor();
  });

  await getCurrentFloor();
});
