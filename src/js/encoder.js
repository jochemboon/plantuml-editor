function encode64_(e) {
    let r, i;
    for (r = "", i = 0; i < e.length; i += 3)
        i + 2 == e.length ? r += append3bytes(e[i], e[i + 1], 0) : i + 1 == e.length ? r += append3bytes(e[i], 0, 0) : r += append3bytes(e[i], e[i + 1], e[i + 2]);
    return r
}

function append3bytes(e, n, t) {
    let c1, c2, c3, c4, r;
    return c1 = e >> 2,
        c2 = (3 & e) << 4 | n >> 4,
        c3 = (15 & n) << 2 | t >> 6,
        c4 = 63 & t,
        r = "",
        r += encode6bit(63 & c1),
        r += encode6bit(63 & c2),
        r += encode6bit(63 & c3),
        r += encode6bit(63 & c4),
        r
}

function encode6bit(e) {
    return e < 10 ? String.fromCharCode(48 + e) : (e -= 10) < 26 ? String.fromCharCode(65 + e) : (e -= 26) < 26 ? String.fromCharCode(97 + e) : 0 == (e -= 26) ? "-" : 1 == e ? "_" : "?"
}

module.exports = {
    encode64_, append3bytes, encode6bit
}