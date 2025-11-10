import { containerName, imageName } from "../constants.js";

export const containerExists = `docker inspect -f '{{.State.Running}}' ${containerName}`
export const containerStart = `docker start ${containerName}`
export const createContainer = `docker run -d --name ${containerName} --network none ${imageName} tail -f /dev/null`