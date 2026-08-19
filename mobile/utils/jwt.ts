
export function decodeJwt(token: string): unknown {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode JWT", e);
        return null;
    }
}

// Polyfill for atob if not available (React Native might need it)
if (typeof atob === 'undefined') {
    global.atob = function (b64Encoded: string) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        const str = String(b64Encoded).replace(/=+$/, '');
        let output = '';

        if (str.length % 4 == 1) {
            throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
        }

        for (
            let bc = 0, bs = 0, buffer, i = 0;
            (buffer = str.charAt(i++));
            ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, bc++ % 4)
                ? (output += String.fromCharCode(255 & (bs >> (-2 * bc & 6))))
                : 0
        ) {
            buffer = chars.indexOf(buffer);
        }

        return output;
    };
}
