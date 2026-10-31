/* ============================================================
   PUBLIC config only. Everything personal (letter, reasons, gifts, cover lines, trips…)
   is ENCRYPTED in content.enc.json and only opens with her password.

   To edit the personal text:
     1. edit  ~/birthday-wish-private/content.json   (NOT inside the site folder)
     2. run   node ~/birthday-wish-private/encrypt.mjs billu
   Test: python3 -m http.server 8765 -> http://localhost:8765/?t=2026-11-01T00:00:00
   ============================================================ */
export default {
  "name": "Billuu",
  "sender": "Batman",
  "age": 19,
  "birthday": "2026-11-01T00:00:00",
  "candles": 5,
  "copy": {
    "nav": {
      "press": "tap “open your copy”, then say the magic word 🔒",
      "cover": "tap anywhere on the cover to make art ✨",
      "release": "sign the form… or think about it first 🖋",
      "cake": "allow the mic & blow on your screen 🌬️ (or press & hold)",
      "edit": "tap each passport stamp ✈️",
      "gifts": "tap each gift to unwrap it 🎁",
      "specimens": "tap anywhere to add a flower 💐 (19 of them!)",
      "letter": "tap the envelope, then scroll slowly 💌",
      "back": "the end… or is it? tap the cover 🐾",
      "done": "yay! tap next for the next surprise →"
    },
    "hush": {
      "cake": "(shh. make a wish, little cat.)",
      "letter": "(okay. now the soft part.)"
    },
    "lock": {
      "title": "Say the magic word ✨",
      "sub": "This issue is top secret. Only one person in the whole world knows the password.",
      "count": "PASSWORD: {n} LETTERS",
      "button": "UNLOCK",
      "hintButton": "need a hint? 🐾",
      "hint": "it’s you, silly :) the name only your favourite people call you. ({n} letters)",
      "wrong": [
        "nope! try again, genius 🐾",
        "so close… or not. try again!",
        "hmm. think cuter.",
        "the answer is literally you."
      ],
      "right": "welcome in, Billuu ✨",
      "length": 5
    },
    "press": {
      "label": "BILLUU’S BIRTHDAY ISSUE PRINTS AT 00:00",
      "waiting": [
        "almost there… curl up, it’s nearly time.",
        "(i can hear you purring with excitement.)",
        "a few more minutes. something special is coming."
      ],
      "headline": [
        "STOP THE",
        "PRESSES."
      ],
      "deck": "A whole issue about {{name}} has just been printed. Only one copy exists. It’s yours.",
      "late": "Printed at 00:00 sharp, waiting just for you. Welcome, birthday girl.",
      "button": "OPEN YOUR COPY"
    }
  },
  "sound": {
    "ambient": "assets/audio/ambient.mp3",
    "volume": 0.35
  },
  "features": {
    "micBlow": true
  }
};
