/*
	PlayCanvas script: Opens WebSocket to same host :3000 and dispatches packets via shared PacketManager.
*/

/* global pc */

(function () {
	if (typeof window === 'undefined') return;

	var NetworkClient = pc.createScript('networkClient');

	NetworkClient.attributes.add('nickname', { type: 'string', default: 'Guest', title: 'Nickname' });

	NetworkClient.prototype.initialize = function () {
		// Ensure SharedBundle is available
		if (!window.AlkkagiSharedBundle) {
			console.error('[NetworkClient] AlkkagiSharedBundle is not loaded. Check script order.');
			return;
		}

		// Ensure packet registry is registered
		if (typeof window.AlkkagiEnsurePacketRegistry === 'function') {
			window.AlkkagiEnsurePacketRegistry(this.app);
		}

		var proto = (location.protocol === 'https:') ? 'wss' : 'ws';
		var host = location.hostname;
		var url = proto + '://' + host + ':3000';

		this.ws = new WebSocket(url);
		this.ws.binaryType = 'arraybuffer';

		var self = this;
		this.ws.onopen = function () {
			var C2S_EnterWorldPacket = window.AlkkagiSharedBundle.C2S_EnterWorldPacket;
			self.send(new C2S_EnterWorldPacket(self.nickname || 'Guest'));
			console.log('[NetworkClient] Connected to', url);
		};

		this.ws.onclose = function () {
			console.warn('[NetworkClient] Disconnected');
		};

		this.ws.onerror = function (e) {
			console.error('[NetworkClient] Error', e);
		};

		this.ws.onmessage = function (ev) {
			self._onMessage(ev.data);
		};
	};

	NetworkClient.prototype.send = function (packetOrBuffer) {
		if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
		var B = window.AlkkagiSharedBundle;
		var buffer = null;
		if (packetOrBuffer && typeof packetOrBuffer.serialize === 'function') {
			buffer = packetOrBuffer.serialize();
		} else if (packetOrBuffer instanceof ArrayBuffer) {
			buffer = packetOrBuffer;
		}
		if (buffer) this.ws.send(buffer);
	};

	NetworkClient.prototype._onMessage = function (arrayBuffer) {
		var B = window.AlkkagiSharedBundle;
		try {
			var read = new B.BufferReadHandle(arrayBuffer);
			var packetId = read.readUint8();
			var packet = B.PacketManager.createPacket(packetId, arrayBuffer);
			var handler = B.PacketManager.createHandler(packetId, this.app, this);
			handler.handle(packet);
		} catch (e) {
			console.error('[NetworkClient] Failed to handle packet:', e);
		}
	};

})();


