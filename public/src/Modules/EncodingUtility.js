function encodeUTF8(str) {
    if (typeof TextEncoder !== "undefined") {
        return new TextEncoder().encode(str);
    }

    // Fallback: UTF-8 수동 인코딩 (서로게이트 처리 포함)
    const out = [];
    for (let i = 0; i < str.length; i++) {
        let cp = str.charCodeAt(i);

        // 서로게이트 페어 → 코드포인트로 결합 (U+10000 이상)
        if (cp >= 0xD800 && cp <= 0xDBFF && i + 1 < str.length) {
            const low = str.charCodeAt(i + 1);
            if (low >= 0xDC00 && low <= 0xDFFF) {
                cp = 0x10000 + ((cp - 0xD800) << 10) + (low - 0xDC00);
                i++;
            }
        }

        // UTF-8 바이트 분해
        if (cp <= 0x7F) {
            out.push(cp);
        } else if (cp <= 0x7FF) {
            out.push(0xC0 | (cp >> 6), 0x80 | (cp & 0x3F));
        } else if (cp <= 0xFFFF) {
            out.push(
                0xE0 | (cp >> 12),
                0x80 | ((cp >> 6) & 0x3F),
                0x80 | (cp & 0x3F)
            );
        } else {
            out.push(
                0xF0 | (cp >> 18),
                0x80 | ((cp >> 12) & 0x3F),
                0x80 | ((cp >> 6) & 0x3F),
                0x80 | (cp & 0x3F)
            );
        }
    }
    return Uint8Array.from(out);
}

function decodeUTF8(bytes) {
    if (typeof TextDecoder !== "undefined") {
        return new TextDecoder("utf-8").decode(bytes);
    }

    // Fallback: UTF-8 수동 디코딩 (간단 검증, 에러 체크 최소)
    let out = "";
    for (let i = 0; i < bytes.length;) {
        const b0 = bytes[i++];

        if (b0 < 0x80) {
            // 1바이트
            out += String.fromCharCode(b0);
            continue;
        }

        if ((b0 & 0xE0) === 0xC0) {
            // 2바이트
            const b1 = (bytes[i++] ?? 0) & 0x3F;
            const cp = ((b0 & 0x1F) << 6) | b1;
            out += String.fromCharCode(cp);
            continue;
        }

        if ((b0 & 0xF0) === 0xE0) {
            // 3바이트
            const b1 = (bytes[i++] ?? 0) & 0x3F;
            const b2 = (bytes[i++] ?? 0) & 0x3F;
            const cp = ((b0 & 0x0F) << 12) | (b1 << 6) | b2;
            out += String.fromCharCode(cp);
            continue;
        }

        // 4바이트 (U+10000 이상 → 서로게이트 페어로 변환)
        const b1 = (bytes[i++] ?? 0) & 0x3F;
        const b2 = (bytes[i++] ?? 0) & 0x3F;
        const b3 = (bytes[i++] ?? 0) & 0x3F;

        const cp = ((b0 & 0x07) << 18) | (b1 << 12) | (b2 << 6) | b3;
        const high = 0xD800 + ((cp - 0x10000) >> 10);
        const low = 0xDC00 + ((cp - 0x10000) & 0x3FF);
        out += String.fromCharCode(high, low);
    }
    return out;
}


function encodeUTF16LE(str, withBOM = false) {
    // JS 문자열은 이미 UTF-16 코드 유닛들의 시퀀스
    // → 그대로 리틀엔디안 바이트로 펼치면 됨. (서로게이트는 16비트 2개로 자연히 기록)
    const units = [];
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        // 유효한 서로게이트 페어면 둘 다 넣고 건너뛰기
        if (c >= 0xD800 && c <= 0xDBFF && i + 1 < str.length) {
            const d = str.charCodeAt(i + 1);
            if (d >= 0xDC00 && d <= 0xDFFF) {
                units.push(c, d);
                i++;
                continue;
            }
        }
        units.push(c);
    }

    const extra = withBOM ? 2 : 0;
    const out = new Uint8Array(units.length * 2 + extra);
    let o = 0;

    // BOM: 0xFF 0xFE (LE용)
    if (withBOM) {
        out[o++] = 0xFF;
        out[o++] = 0xFE;
    }

    // 리틀엔디안으로 기록 (low byte → high byte)
    for (let i = 0; i < units.length; i++) {
        const u = units[i];
        out[o++] = u & 0xFF;
        out[o++] = u >> 8;
    }

    return out;
}

function decodeUTF16LE(bytes) {
    let o = 0;
    if (bytes.length >= 2 && bytes[0] === 0xFF && bytes[1] === 0xFE) 
        o = 2; // skip BOM

    const CHUNK = 0x8000;
    const len = (bytes.length - o) >>> 1;
    let out = "";
    for (let i = 0; i < len; i += CHUNK) {
        const n = Math.min(CHUNK, len - i);
        const arr = new Array(n);
        for (let j = 0; j < n; j++)  { 
            arr[j] = bytes[o + ((i + j) << 1)] | (bytes[o + ((i + j) << 1) + 1] << 8); 
        }

        out += String.fromCharCode(...arr);
    }

    return out;
}

export { encodeUTF8, decodeUTF8, encodeUTF16LE, decodeUTF16LE };