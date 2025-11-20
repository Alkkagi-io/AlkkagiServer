import { ServerPacketHandler } from './Base/ServerPacketHandler.js';
import { S2C_InteractAbilityContainerResponsePacket, S2C_InformCharacterAbilityChangedPacket } from '../../AlkkagiShared/Packets/index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';

class C2S_InteractAbilityContainerRequestPacketHandler extends ServerPacketHandler {
    handle(packet) {
        const playerHandle = this.clientHandle.playerHandle;
        if(playerHandle == undefined)
            return;

        if(playerHandle.playerEntity == null) {
            return;
        }

        const abilityContainer = this.world.getEntity(packet.abilityContainerEntityID);
        if(abilityContainer == null) {
            return;
        }

        const distanceVector = Vector.subtract(playerHandle.playerEntity.position, abilityContainer.position);
        const sqrDistance = distanceVector.getSqrMagnitude();
        if(sqrDistance > globalThis.gameConfig.abilityContainerInteractionRadius * globalThis.gameConfig.abilityContainerInteractionRadius) {
            return;
        }
        
        const walletComponent = playerHandle.playerEntity.walletComponent;
        if(walletComponent == null) {
            return;
        }

        if(walletComponent.gold < globalThis.gameConfig.abilityContainerInteractionGoldCost) {
            return;
        }

        const ability = abilityContainer.getRandomAbility(playerHandle.playerEntity);
        if(ability == null) {
            return;
        }

        const abilityComponent = playerHandle.playerEntity.abilityComponent;
        if(abilityComponent == null) {
            return;
        }

        abilityComponent.setAbility(ability);
        walletComponent.useGold(globalThis.gameConfig.abilityContainerInteractionGoldCost);

        const resPacket = new S2C_InteractAbilityContainerResponsePacket(walletComponent.gold);
        this.clientHandle.send(resPacket);

        const informPacket = new S2C_InformCharacterAbilityChangedPacket(playerHandle.playerEntity.entityID, ability.abilityID);
        const informPacketBuffer = informPacket.serialize();
        
        const entityViewAABB = getEntityViewAABB(playerHandle.getEntityPosition(), playerHandle.isAdmin);
        this.world.entityTree.query(entityViewAABB, leaf => {
            const entity = leaf.data;
    
            if(entity.getEntityType() != EEntityType.Player) {
                return;
            }

            const informTargetClientHandle = entity.clientHandle;
            if(informTargetClientHandle == null) {
                return;
            }

            informTargetClientHandle.send(informPacketBuffer, informPacket.constructor.name);
        });
    }
}

export { C2S_InteractAbilityContainerRequestPacketHandler };
