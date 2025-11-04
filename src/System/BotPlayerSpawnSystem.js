import { System } from './System.js';
import { BotPlayer } from '../Entity/index.js';
import { Vector } from '../../AlkkagiShared/Modules/Vector.js';
import { Random } from '../../AlkkagiShared/Modules/Random.js';
import { S2C_AddPlayerPacket, S2C_RemovePlayerPacket } from '../../AlkkagiShared/Packets/index.js';

const SPAWN_DELAY_MIN = 500;
const SPAWN_DELAY_MAX = 3000;

const BOT_NAMES = [ '새벽도적', 
'달빛캐스터', 
'버섯궁수', 
'얼음수정', 
'고양이장군', 
'별가루소환사', 
'비밀농장주', 
'소나기스프린터', 
'안개기사', 
'은빛너구리', 
'폭신마법사', 
'돌돌감자', 
'빛의나그네', 
'칼날두부', 
'몽환나비', 
'불씨연금술사', 
'초코폭격기', 
'낮잠단장', 
'귤껍질전사', 
'바람파편', 
'잔상도깨비', 
'후다닥토끼', 
'멜론유성', 
'사막수달', 
'별난수호자', 
'차분한망치', 
'포근설표', 
'스팀펭귄', 
'보라별감시자', 
'구름바리스타', 
'반짝이기병', 
'검은콩닌자', 
'얼렁뚱땅킹', 
'단델리온송곳', 
'파도쏘개', 
'새콤슬라임', 
'먼지기사단', 
'휘파람악단', 
'우산도시락', 
'그림자쥐돌이', 
'수염선인장', 
'파프리카폭스', 
'체리활쟁이', 
'반달곰바드', 
'번개모래시계', 
'유령해적맛', 
'무지개주머니', 
'두근두근버팔로', 
'미끄럼참새', 
'애매한용사', 
'토스트야옹', 
'천둥젤리', 
'스노우댕댕', 
'호기심여우', 
'고요한파랑', 
'허니트릭스터', 
'포자학자', 
'깃털대장', 
'보송사서', 
'사뿐버거', 
'뽀얀방패', 
'안드로메다막내', 
'사르르기사', 
'숲속해커', 
'구멍난망토', 
'노을펜서', 
'돌고래분대', 
'민트지휘관', 
'레몬도적단', 
'새털마도사', 
'부엉이도감', 
'코코넛투사', 
'사일런트호랑이', 
'배고픈용의자', 
'이슬창술사', 
'쿠키궁극체', 
'여름소나타', 
'은신두루미', 
'수풀미스터리', 
'반짝눈표범', 
'쇠똥구리영주', 
'하품창기사', 
'낙엽헌터', 
'고장난천사', 
'딸기모험가', 
'스컬라떼', 
'겨울공방장', 
'몽글흑표', 
'노래하는골렘', 
'열대어마스터', 
'북극토르네이도', 
'흩날리는파편', 
'꿀단지루키', 
'겹겹이방랑자', 
'파란수신호', 
'야옹방패병', 
'릴렉스도마뱀', 
'틈새아르카나', 
'별빛쿠로', 
'시럽트러블메이커',  ];

class BotPlayerSpawnSystem extends System {
    constructor(world, gameServer) {
        super(world);

        this.gameServer = gameServer;
        this.gameConfig = globalThis.gameConfig;
    }

    getSystemID() {
        return 'BotPlayerSpawnSystem';
    }

    onStart() {
        super.onStart();

        for(let i = 0; i < this.gameConfig.botPlayerCount; i++) {
            this.spawnBotPlayer();
        }
    }

    spawnBotPlayer() {
        const delayMilliseconds = Random.range(SPAWN_DELAY_MIN, SPAWN_DELAY_MAX);
        setTimeout(() => {
            const nickname = BOT_NAMES[Random.rangeInt(0, BOT_NAMES.length)];
            const botPlayer = new BotPlayer(this.world, nickname, this.onBotPlayerDead.bind(this));
            botPlayer.position = this.getRandomPosition();
            this.world.addEntity(botPlayer);

            const addPlayerPacket = new S2C_AddPlayerPacket(botPlayer);
            const addPlayerPacketBuffer = addPlayerPacket.serialize();
            for (const client of this.gameServer.connectedClients) {
                if (!client.playerHandle)
                    continue;
            
                client.send(addPlayerPacketBuffer, addPlayerPacket.constructor.name);
            }
        }, delayMilliseconds);
    }

    onBotPlayerDead(entity) {
        const removePlayerPacket = new S2C_RemovePlayerPacket(entity.entityID);
        const removePlayerPacketBuffer = removePlayerPacket.serialize();
        for (const client of this.gameServer.connectedClients) {
            if (!client.playerHandle)
                continue;
            
            client.send(removePlayerPacketBuffer, removePlayerPacket.constructor.name);
        }
        this.spawnBotPlayer();
    }

    getRandomPosition() {
        const halfWidth = this.gameConfig.worldWidth * 0.5;
        const halfHeight = this.gameConfig.worldHeight * 0.5;
        return new Vector(Random.range(-halfWidth, halfWidth), Random.range(-halfHeight, halfHeight));
    }
}

export { BotPlayerSpawnSystem };