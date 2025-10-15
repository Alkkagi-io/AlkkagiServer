/*
	Client-side handler for S2C_UpdateWorldPacket. Iterates entity datas and logs positions.
	You can replace logics later to update scene entities.
*/

(function () {
	if (typeof window === 'undefined') return;

	function S2C_UpdateWorldPacketHandler(app, network) {
		this.app = app;
		this.network = network;
	}

	S2C_UpdateWorldPacketHandler.prototype.handle = function (packet) {
		// packet.entityDatas: Array<{ entityID, position(Vector) }>
		for (var i = 0; i < packet.entityDatas.length; i++) {
			var e = packet.entityDatas[i];
			console.log('[S2C_UpdateWorld] entity=', e.entityID, 'pos=', e.position.x, e.position.y);
		}
	};

	window.S2C_UpdateWorldPacketHandler = S2C_UpdateWorldPacketHandler;
})();


