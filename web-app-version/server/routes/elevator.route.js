import express from "express";
import * as elevatorController from "../controllers/elevator.controller.js";

const router = express.Router();

// Elevator routes
router.post("/dispatch", elevatorController.dispatch);
router.get("/requests", elevatorController.getRequests);
router.post("/requests", elevatorController.addRequest);
router.get("/riders", elevatorController.getRiders);
router.get("/current-floor", elevatorController.getCurrentFloor);
router.get("/floors-traversed", elevatorController.getFloorsTraversed);
router.get("/stops", elevatorController.getStops);
router.patch("/update-floor/:floor", elevatorController.updateFloor);
router.post("/move-up", elevatorController.moveUp);
router.post("/move-down", elevatorController.moveDown);
router.get("/has-stop", elevatorController.hasStop);
router.get("/has-pickup", elevatorController.hasPickup);
router.get("/has-dropoff", elevatorController.hasDropoff);
router.get("/check-return-to-lobby", elevatorController.checkReturnToLobby);
router.post("/return-to-lobby", elevatorController.returnToLobby);
router.delete("/reset-elevator", elevatorController.resetElevator);

export default router;
