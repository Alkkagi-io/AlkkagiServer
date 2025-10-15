/*
	Client-side handler for MessagePacket. Logs the message to console.
*/

(function () {
	if (typeof window === 'undefined') return;

	function MessagePacketHandler(app, network) {
		this.app = app;
		this.network = network;
	}

	MessagePacketHandler.prototype.handle = function (packet) {
		// packet.message (string)
		console.log('[MessagePacketHandler]', packet.message);
	};

	window.MessagePacketHandler = MessagePacketHandler;
})();


