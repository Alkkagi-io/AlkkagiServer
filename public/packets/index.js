// Modules
export { EPacketID } from './base/epacketid.js';
export { Packet } from './base/packet.js';
export { BufferReadHandle, BufferWriteHandle, getFlexiableUTF8Size, getFlexiableUTF16LESize } from './base/bufferhandle.js';

// Packets
export { MessagePacket } from './messagepacket.js';

// Managers
import ResourceManager from '../../AlkkagiShared/Data/Resource/ResourceManager.js';

// Init
ResourceManager.load(true);