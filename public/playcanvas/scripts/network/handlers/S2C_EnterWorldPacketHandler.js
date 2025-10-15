/*
	Client-side handler for S2C_EnterWorldPacket. Stores the player entityID on the network script.
*/

(function () {
	if (typeof window === 'undefined') return;

	function S2C_EnterWorldPacketHandler(app, network) {
		this.app = app;
		this.network = network;
	}

	S2C_EnterWorldPacketHandler.prototype.handle = function (packet) {
		// packet.entityID (uint32)
		this.network.playerEntityId = packet.entityID;
		console.log('[S2C_EnterWorldPacketHandler] Entered world with entityID =', packet.entityID);
	};

	window.S2C_EnterWorldPacketHandler = S2C_EnterWorldPacketHandler;
})();


