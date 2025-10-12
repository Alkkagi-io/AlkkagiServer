const { ShopManager } = require("../Shop/ShopManager");
const { ServerPacketHandler } = require("./Base/ServerPacketHandler");

class C2S_BuyItemPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        ShopManager.buyItem(playerHandle.playerEntity, packet.buyItemId);
    }   
}