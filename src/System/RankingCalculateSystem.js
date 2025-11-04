import { S2C_UpdateRankingPacket } from "../../AlkkagiShared/Packets/S2C_UpdateRankingPacket.js";
import { System } from "./System.js";
import { Diagnostics } from "../Utils/ETC/Diagnostics.js";
import { Character } from "../Entity/index.js";

class RankingCalculateSystem extends System {
    constructor(world, gameServer) {
        super(world);
        this.gameServer = gameServer;
        this.counter = 0;
    }

    getSystemID() {
        return "RankingCalculateSystem";
    }
    
    onPostUpdate(deltaTime) {
        this.counter++;
        if(this.counter < globalThis.gameConfig.rankingUpdateTick)
            return;

        this.counter = 0;
        const top5 = Object.values(this.world.entities)
            .filter(c => c instanceof Character && c?.score !== undefined)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        const packet = new S2C_UpdateRankingPacket(top5);
        const buffer = packet.serialize();

        this.gameServer.connectedClients.forEach(client => {
            if (!client.playerHandle)
                return;

            client.send(buffer, packet.constructor.name);
        });
    }    
}

export { RankingCalculateSystem }