import { S2C_UpdateRankingPacket } from "../../AlkkagiShared/Packets/S2C_UpdateRankingPacket.js";
import { System } from "./System.js";

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

        const top5 = Array.from(this.gameServer.connectedClients)
            .filter(c => c?.playerHandle?.playerEntity?.score !== undefined)
            .sort((a, b) => b.playerHandle.playerEntity.score - a.playerHandle.playerEntity.score)
            .slice(0, 5)
            .map(c => c.playerHandle.playerEntity);

        const packet = new S2C_UpdateRankingPacket(top5);
        const buffer = packet.serialize();

        this.gameServer.connectedClients.forEach(client => {
            if (!client.playerHandle)
                return;

            client.send(buffer);
        });
    }    
}

export { RankingCalculateSystem }