class Diagnostics {
    constructor() {
        throw new Error('Diagnostics is a static class and cannot be instantiated');
    }

    static logMemoryUsage() {
        const memoryUsage = process.memoryUsage();
        const memoryUsageInMB = {
            rss: (memoryUsage.rss / 1024 / 1024).toFixed(3),
            heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(3),
            heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(3),
            external: (memoryUsage.external / 1024 / 1024).toFixed(3),
            arrayBuffers: (memoryUsage.arrayBuffers / 1024 / 1024).toFixed(3),
        };

        globalThis.logger.info('Diagnostics::MemoryUsage', `Total: ${memoryUsageInMB.rss}MB, Heap Total: ${memoryUsageInMB.heapTotal}MB, Heap Used: ${memoryUsageInMB.heapUsed}MB, External: ${memoryUsageInMB.external}MB, Array Buffers: ${memoryUsageInMB.arrayBuffers}MB`);
    }

    static _clientNetworkUsageMap = new Map();
    static _packetNetworkUsageMap = new Map();
    static _lastLogTime = Date.now();
    static recordNetworkSendTraffic(clientHandle, packet, sizeKB) {
        const currentUsage = Diagnostics._clientNetworkUsageMap.get(clientHandle.clientID) ?? 0;
        Diagnostics._clientNetworkUsageMap.set(clientHandle.clientID, currentUsage + sizeKB);
        
        const currentPacketUsage = Diagnostics._packetNetworkUsageMap.get(packet.constructor.name) ?? 0;
        Diagnostics._packetNetworkUsageMap.set(packet.constructor.name, currentPacketUsage + sizeKB);
    }

    static logNetworkSendTraffic() {
        let totalUsage = 0;
        Diagnostics._clientNetworkUsageMap.forEach((usage, clientID) => {
            totalUsage += usage;
        });

        const elapsedTimeMS = Date.now() - Diagnostics._lastLogTime;
        Diagnostics._lastLogTime = Date.now();

        const totalUsageMB = (totalUsage / 1024).toFixed(3);
        const averagePerClient = Diagnostics._clientNetworkUsageMap.size > 0 ? totalUsage / Diagnostics._clientNetworkUsageMap.size : 0;
        const averagePerClientMB = (averagePerClient / 1024).toFixed(3);
        const averagePerSecond = totalUsage / (elapsedTimeMS / 1000);
        const averagePerSecondMB = (averagePerSecond / 1024).toFixed(3);
        globalThis.logger.info('Diagnostics::NetworkSendTraffic', `Elapsed Time: ${(elapsedTimeMS / 1000).toFixed(3)}s, Total: ${totalUsage.toFixed(3)}KB(${totalUsageMB}MB), Average per client: ${averagePerClient.toFixed(3)}KB(${averagePerClientMB}MB), Average per second: ${averagePerSecond.toFixed(3)}KB(${averagePerSecondMB}MB)`);

        const topPacketCount = 3;
        let top = [];
        for (const [name, usage] of Diagnostics._packetNetworkUsageMap) {
            top.push([name, usage]);
            top.sort((a, b) => b[1] - a[1]);
            if (top.length > topPacketCount) 
                top.length = topPacketCount;
        }

        let counter = 0;
        const sortedPacketUsageLogs = top.map(([name, usage]) =>
            `${++counter}. ${name}: ${usage.toFixed(3)}KB`
        );

        if (sortedPacketUsageLogs.length > 0)
            globalThis.logger.info('Diagnostics::NetworkSendTraffic', `Top ${topPacketCount} packets: ${sortedPacketUsageLogs.join(' / ')}`);
        else
            globalThis.logger.info('Diagnostics::NetworkSendTraffic', 'No packets sent');
    }

    static resetNetworkSendTraffic() {
        Diagnostics._clientNetworkUsageMap.clear();
        Diagnostics._packetNetworkUsageMap.clear();
    }

    static logConnectionCount(gameServer) {
        globalThis.logger.info('Diagnostics::ConnectionCount', `Connections: ${gameServer.connectedClients.size}`);
    }
}

export { Diagnostics };