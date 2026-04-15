export default class Elevator {
  constructor() {
    this.currentFloor = 0;
    this.stops = 0;
    this.floorsTraversed = 0;
    this.requests = [];
    this.riders = [];
  }

  dispatch() {
    this.requests.forEach((request) => {
      if (this.riders.length || this.requests.length) {
        this.goToFloor(request);
      }
    });
  }

  goToFloor(person) {
    // ensure we return to lobby after one-way trip (if no other pending requests/riders) to minimize wait time for future riders
    const isOneWayTrip = this.requests.length === 1 && this.riders.length === 0;
    const targetName = person.name;
    const targetDrop = person.dropOffFloor;

    //console.log(`requests: ${this.requests.map(r => r.name).join(', ')} | riders: ${this.riders.map(r => r.name).join(', ')}`)

    const targetStillInSystem = () =>
      this.requests.some(
        (r) => r.name === targetName && r.dropOffFloor === targetDrop,
      ) ||
      this.riders.some(
        (r) => r.name === targetName && r.dropOffFloor === targetDrop,
      );

    while (targetStillInSystem()) {
      // build candidate next stops from current system state
      const pickupFloors = this.requests.map((r) => r.currentFloor);
      const dropoffFloors = this.riders.map((r) => r.dropOffFloor);
      const candidates = [...pickupFloors, ...dropoffFloors];

      // if no candidates, we're done
      if (!candidates.length) break;

      // nearest next stop policy (ex: pick Angela before Oliver dropoff when appropriate)
      const nextFloor = candidates.reduce((best, f) => {
        return Math.abs(f - this.currentFloor) <
          Math.abs(best - this.currentFloor)
          ? f
          : best;
      }, candidates[0]);

      while (this.currentFloor < nextFloor) this.moveUp();
      while (this.currentFloor > nextFloor) this.moveDown();

      // if already at stop floor and still pending events there, process them once
      if (this.hasStop()) this.stops++;
    }

    if (isOneWayTrip && this.checkReturnToLoby()) {
      this.returnToLoby();
    }
  }

  moveUp() {
    this.currentFloor++;
    this.floorsTraversed++;
    // console.log(this.currentFloor, this.floorsTraversed)
    if (this.hasStop()) {
      this.stops++;
    }
  }

  moveDown() {
    if (this.currentFloor > 0) {
      this.currentFloor--;
      this.floorsTraversed++;
      //  console.log(this.currentFloor, this.floorsTraversed)
      if (this.hasStop()) {
        this.stops++;
      }
    }
  }

  hasStop() {
    return this.hasPickup() || this.hasDropoff();
  }

  hasPickup() {
    const pickups = this.requests.filter(
      (request) => request.currentFloor === this.currentFloor,
    );
    if (pickups.length) {
      pickups.forEach((p) =>
        console.info(`Picking up ${p.name} at floor ${this.currentFloor}`),
      );
      this.riders.push(...pickups);
      this.requests = this.requests.filter(
        (request) => request.currentFloor !== this.currentFloor,
      );
      return true;
    }
    return false;
  }

  hasDropoff() {
    const hasDropoff = this.riders.some(
      (rider) => rider.dropOffFloor === this.currentFloor,
    );
    if (hasDropoff) {
      const dropoffs = this.riders.filter(
        (rider) => rider.dropOffFloor === this.currentFloor,
      );
      dropoffs.forEach((d) =>
        console.info(`Dropping off ${d.name} at floor ${this.currentFloor}`),
      );
      this.riders = this.riders.filter(
        (rider) => rider.dropOffFloor !== this.currentFloor,
      );
      return true;
    }
    return false;
  }

  checkReturnToLoby() {
    return this.requests.length === 0 && this.riders.length === 0;
  }

  returnToLoby() {
    while (this.currentFloor > 0) {
      this.moveDown();
    }
  }

  reset() {
    this.currentFloor = 0;
    this.stops = 0;
    this.floorsTraversed = 0;
    this.riders = [];
  }
}
