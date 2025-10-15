/*
	Registers packet factories and handlers into the shared PacketManager.
	Expose a safe idempotent function on window to avoid duplicate registration.
*/

(function () {
	if (typeof window === 'undefined') return;
	if (!window.AlkkagiSharedBundle) return;

	const B = window.AlkkagiSharedBundle;

	window.AlkkagiEnsurePacketRegistry = function AlkkagiEnsurePacketRegistry(app) {
		if (window.__alkkagiPacketRegistryDone) return;

		// Handlers must be globally available (loaded as PlayCanvas script assets)
		const MessagePacketHandler = window.MessagePacketHandler;
		const S2C_EnterWorldPacketHandler = window.S2C_EnterWorldPacketHandler;
		const S2C_UpdateWorldPacketHandler = window.S2C_UpdateWorldPacketHandler;

		if (!MessagePacketHandler || !S2C_EnterWorldPacketHandler || !S2C_UpdateWorldPacketHandler) {
			console.warn('[PacketRegistry] Handlers not loaded yet. Registration deferred.');
			return;
		}

		// Inject handler args if you have shared constructor deps; we pass via createHandler call instead
		// B.PacketManager.injectHandlerArgs();

		B.PacketManager.on(B.EPacketID.Message, B.MessagePacket, MessagePacketHandler);
		B.PacketManager.on(B.EPacketID.S2C_EnterWorld, B.S2C_EnterWorldPacket, S2C_EnterWorldPacketHandler);
		B.PacketManager.on(B.EPacketID.S2C_UpdateWorld, B.S2C_UpdateWorldPacket, S2C_UpdateWorldPacketHandler);

		window.__alkkagiPacketRegistryDone = true;
		console.log('[PacketRegistry] Registered packet handlers');
	};
})();


