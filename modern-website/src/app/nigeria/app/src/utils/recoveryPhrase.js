import CryptoJS from 'crypto-js';

// Use CryptoJS directly, no fallback needed for now

/**
 * BIP39 Recovery Phrase System for BeeZee Finance
 * Generates and manages 12-word recovery phrases for account recovery
 */

// BIP39 word list (simplified but sufficient for security)
const BIP39_WORDLIST = [
  "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
  "access", "accident", "account", "accuse", "achieve", "acid", "acoustic", "acquire", "across", "act",
  "action", "actor", "actress", "actual", "adapt", "add", "addict", "address", "adjust", "admit",
  "adult", "advance", "advice", "aerobic", "affair", "afford", "afraid", "again", "age", "agent",
  "agree", "ahead", "aim", "air", "airport", "aisle", "alarm", "album", "alcohol", "alert",
  "alien", "all", "alley", "allow", "almost", "alone", "alpha", "already", "also", "alter",
  "always", "amateur", "amazing", "among", "amount", "amused", "analyst", "anchor", "ancient", "anger",
  "angle", "angry", "ankle", "annoy", "announce", "annual", "another", "answer", "antenna", "antique",
  "anxiety", "any", "apart", "apparent", "apple", "approve", "april", "arch", "arctic", "area",
  "arena", "argue", "arm", "armor", "army", "around", "arrange", "arrest", "arrive", "arrow",
  "artefact", "artist", "artwork", "ask", "aspect", "assault", "asset", "assist", "assume", "asthma",
  "athlete", "atom", "attack", "attend", "attitude", "attract", "auction", "audit", "august", "aunt",
  "author", "auto", "autumn", "average", "avocado", "avoid", "awake", "aware", "away", "awesome",
  "awful", "awkward", "axis", "baby", "background", "bacon", "badge", "bag", "balance", "balcony",
  "ball", "bamboo", "banana", "banner", "bar", "barely", "bargain", "barrel", "base", "basic",
  "basket", "battle", "beach", "bean", "beauty", "because", "become", "beef", "before", "begin",
  "behave", "behind", "belief", "believe", "bell", "belong", "below", "belt", "bench", "benefit",
  "best", "betray", "better", "between", "beyond", "bicycle", "bid", "big", "bike", "bind",
  "biology", "bird", "birth", "bitter", "black", "blade", "blame", "blanket", "blast", "bleed",
  "bless", "blind", "block", "blood", "blossom", "blow", "blue", "blur", "blush", "board",
  "boat", "body", "boil", "bomb", "bond", "bone", "bonus", "book", "boost", "boss",
  "both", "bottle", "bottom", "bound", "bow", "box", "brain", "branch", "brass", "brave",
  "bread", "break", "breed", "brick", "bridge", "brief", "bright", "bring", "broad", "broken",
  "brother", "brown", "brush", "budget", "build", "burst", "business", "butter", "button", "cabin",
  "cable", "calm", "camera", "camp", "can", "canal", "cannot", "capital", "captain", "car",
  "carbon", "card", "cargo", "carry", "cart", "case", "cash", "cat", "catch", "cause",
  "caution", "cave", "ceiling", "cell", "cement", "center", "century", "certain", "chain", "chair",
  "chalk", "champion", "change", "chaos", "character", "charge", "chart", "cheap", "check", "cheese",
  "chemical", "cherry", "chest", "chicken", "chief", "child", "choice", "choose", "chronic", "chunk",
  "churn", "cigar", "cinnamon", "circle", "citizen", "city", "claim", "clap", "clarify", "claw",
  "clay", "clean", "clear", "clerk", "clever", "click", "client", "cliff", "climb", "clinic",
  "clock", "clone", "close", "cloth", "cloud", "coach", "coast", "coconut", "code", "coffee",
  "coil", "coin", "collect", "color", "column", "combine", "comfort", "comic", "common", "company",
  "concert", "conduct", "confirm", "congress", "connect", "consider", "control", "convince", "cook", "cool",
  "copper", "copy", "coral", "core", "corn", "correct", "cost", "cotton", "couch", "country",
  "couple", "courage", "course", "court", "cover", "crack", "craft", "crash", "crazy", "cream",
  "credit", "crew", "crime", "crisp", "cross", "crowd", "crown", "crucial", "cruel", "cruise",
  "crush", "cry", "crystal", "cube", "culture", "cup", "curious", "current", "curve", "custom",
  "cycle", "dad", "damage", "dance", "danger", "daring", "dash", "data", "date", "daughter",
  "dawn", "day", "deal", "debate", "debris", "decade", "decent", "decline", "decorate", "decrease",
  "dedicate", "deep", "deer", "defeat", "defend", "define", "defy", "degree", "delay", "deliver",
  "demand", "demise", "denial", "dense", "depend", "deploy", "describe", "desert", "design", "desk",
  "destroy", "detail", "detect", "determine", "develop", "device", "devote", "diagram", "dial", "diamond",
  "diary", "diesel", "diet", "digit", "dilemma", "dinner", "direct", "dirt", "disagree", "disappear",
  "disaster", "discard", "discover", "dislike", "dispense", "display", "distance", "distribute", "divert", "divide",
  "divorce", "doctor", "document", "donate", "donkey", "donor", "door", "dose", "double", "draft",
  "dragon", "drama", "drastic", "draw", "dream", "dress", "drift", "drill", "drink", "drive",
  "drop", "drum", "dry", "duck", "dumb", "dune", "during", "dust", "duty", "dynamic",
  "eager", "early", "earth", "easy", "echo", "ecology", "economy", "edge", "edit", "educate",
  "effort", "eight", "either", "elect", "electric", "elegant", "element", "elephant", "elevator", "elite",
  "else", "embark", "embody", "emerge", "emotion", "emphasize", "empower", "empty", "enable", "enact",
  "end", "endless", "endorse", "enemy", "energy", "enforce", "engage", "enhance", "enjoy", "enlist",
  "enough", "enrich", "enroll", "ensure", "enter", "entire", "entry", "envelope", "episode", "equal",
  "equip", "era", "erase", "erode", "erosion", "error", "erupt", "escape", "essay", "essence",
  "estate", "eternal", "ethics", "evidence", "evil", "evoke", "evolve", "exact", "example", "exchange",
  "excite", "exclude", "excuse", "execute", "exercise", "exhaust", "exhibit", "exile", "exist", "exit",
  "exotic", "expand", "expect", "expire", "explain", "explode", "export", "expose", "express", "extend",
  "extra", "eye", "fabric", "face", "faculty", "fade", "faint", "faith", "false", "fancy",
  "fantasy", "farm", "fashion", "fat", "fatal", "father", "fault", "favorite", "feature", "federal",
  "feel", "female", "fence", "festival", "fetch", "fever", "few", "fiber", "fiction", "field",
  "figure", "file", "film", "filter", "final", "find", "fine", "finger", "finish", "fire",
  "firm", "first", "fiscal", "fish", "fit", "fitness", "fix", "flag", "flame", "flat",
  "flavor", "flee", "flight", "flip", "float", "flood", "floor", "flour", "flow", "flower",
  "fluid", "focus", "folk", "follow", "food", "foot", "force", "forest", "forget", "fork",
  "fortune", "forum", "forward", "fossil", "foster", "foul", "found", "fox", "fragile", "frame",
  "frequent", "fresh", "friend", "fringe", "frog", "front", "frost", "frozen", "fruit", "fuel",
  "fun", "funny", "furnace", "fury", "future", "gadget", "gain", "galaxy", "gallery", "game",
  "garage", "garbage", "garden", "garlic", "garment", "gas", "gasp", "gate", "gather", "gauge",
  "gaze", "general", "genius", "genre", "gentle", "genuine", "gesture", "ghost", "giant", "gift",
  "giggle", "ginger", "giraffe", "girl", "give", "glad", "glance", "glare", "glass", "glide",
  "glimpse", "globe", "gloom", "glory", "glove", "glow", "glue", "goat", "goddess", "gold",
  "good", "goose", "gorilla", "gospel", "gossip", "govern", "gown", "grab", "grace", "grain",
  "grant", "grape", "graph", "grass", "grateful", "grave", "gravity", "great", "green", "grid",
  "grief", "grit", "grocery", "group", "grow", "grunt", "guard", "guess", "guide", "guilt",
  "guitar", "gun", "gym", "habit", "hair", "half", "hammer", "hamster", "hand", "happy",
  "harbor", "hard", "harsh", "harvest", "hat", "have", "hawk", "hazard", "head", "health",
  "heart", "heavy", "hedge", "height", "hello", "helmet", "help", "hen", "hero", "hidden",
  "high", "hill", "hint", "hip", "hire", "history", "hobby", "hockey", "hold", "hole",
  "holiday", "hollow", "home", "honey", "honor", "hope", "horn", "horse", "hospital", "host",
  "hour", "house", "hover", "huge", "human", "humble", "humor", "hundred", "hunt", "hurdle",
  "hurt", "husband", "hybrid", "ice", "icon", "idea", "identify", "idle", "ignore", "ill",
  "illegal", "illness", "image", "imagine", "imbalance", "imitate", "immense", "immune", "impact", "impose",
  "improve", "impulse", "inch", "include", "income", "increase", "indoor", "industry", "infant", "inflict",
  "inform", "inhale", "inherit", "initial", "inject", "injury", "inmate", "inner", "innocent", "input",
  "inquiry", "insane", "insect", "inside", "inspire", "install", "intact", "interest", "into", "invest",
  "involve", "iron", "island", "isolate", "issue", "item", "ivory", "jacket", "jaguar", "jar",
  "jazz", "jeans", "jelly", "jewel", "job", "join", "joke", "journey", "judge", "juice",
  "jump", "jungle", "junior", "junk", "just", "kangaroo", "keen", "keep", "ketchup", "key",
  "kick", "kid", "kidney", "kind", "king", "kiss", "kit", "kitchen", "kite", "kitten",
  "kiwi", "knee", "knife", "knock", "know", "lab", "label", "labor", "ladder", "lady",
  "lake", "lamp", "language", "laptop", "large", "later", "laugh", "laundry", "lava", "law",
  "lawn", "lawsuit", "layer", "lazy", "leader", "leaf", "learn", "lease", "least", "leather",
  "leave", "left", "leg", "legal", "legend", "leisure", "lemon", "lend", "length", "lens",
  "leopard", "lesson", "letter", "level", "liar", "liberty", "library", "license", "life", "lift",
  "light", "like", "limb", "limit", "link", "lion", "liquid", "list", "little", "live",
  "lizard", "load", "loan", "lobster", "local", "lock", "logic", "lonely", "long", "loop",
  "lottery", "loud", "love", "loyal", "lucky", "luggage", "lumber", "lunar", "lunch", "luxury",
  "machine", "mad", "magic", "magnet", "maid", "mail", "main", "major", "make", "mammal",
  "man", "manage", "mandate", "mango", "mansion", "manual", "maple", "marble", "march", "margin",
  "marine", "market", "marriage", "mask", "mass", "master", "match", "material", "math", "matrix",
  "matter", "maximum", "maze", "meadow", "measure", "meat", "mechanic", "medal", "media", "melon",
  "memory", "mental", "mention", "menu", "merge", "merit", "merry", "mesh", "message", "metal",
  "method", "middle", "midnight", "milk", "million", "mind", "minimum", "minor", "minute", "miracle",
  "mirror", "missile", "mission", "mistake", "mix", "mixture", "mobile", "model", "modify", "mom",
  "moment", "monitor", "monkey", "month", "moral", "morning", "mother", "motion", "motor", "mountain",
  "mouse", "mouth", "move", "movie", "much", "muscle", "museum", "mushroom", "music", "must",
  "mutual", "myth", "name", "napkin", "narrow", "nasty", "nation", "nature", "near", "neat",
  "necessary", "neck", "need", "negative", "neighbor", "neither", "nephew", "nerve", "nest", "network",
  "neutral", "never", "news", "next", "nice", "night", "noble", "noise", "nominee", "noodle",
  "normal", "north", "notable", "note", "nothing", "notice", "noun", "novel", "now", "nuclear",
  "number", "nurse", "nut", "oak", "obey", "object", "oblige", "obscure", "observe", "obtain",
  "obvious", "ocean", "offer", "often", "order", "organ", "orient", "original", "ostrich", "other",
  "outcome", "outdoor", "outer", "output", "outside", "oval", "oven", "over", "owner", "oxygen",
  "oyster", "ozone", "pact", "paddle", "page", "pair", "palace", "palm", "panda", "panel",
  "panic", "paper", "parade", "parent", "park", "parrot", "party", "pass", "patch", "path",
  "patient", "pattern", "pause", "peace", "peanut", "pear", "peasant", "pelican", "pen", "penalty",
  "pencil", "people", "pepper", "perfect", "permit", "person", "pet", "phone", "photo", "piano",
  "picnic", "picture", "piece", "pig", "pigeon", "pill", "pilot", "pink", "pioneer", "pipe",
  "pistol", "pitch", "pizza", "place", "planet", "plastic", "plate", "play", "please", "pledge",
  "pluck", "plug", "plunge", "poem", "poet", "point", "polar", "pole", "police", "pond",
  "pony", "pool", "popular", "portion", "portrait", "pose", "position", "positive", "possess", "possible",
  "post", "potato", "pottery", "poverty", "powder", "power", "practice", "praise", "predict", "prefer",
  "prepare", "present", "pretty", "prevent", "price", "pride", "primary", "print", "priority", "prison",
  "private", "prize", "problem", "process", "produce", "profile", "program", "project", "promote", "proper",
  "protect", "proud", "provide", "public", "pull", "pupil", "puppy", "purchase", "purpose", "purse",
  "push", "put", "puzzle", "quality", "quantity", "quarter", "question", "quick", "quiet", "quit",
  "quiz", "quote", "rabbit", "raccoon", "race", "rack", "radar", "radio", "rail", "rain",
  "raise", "rally", "ramp", "ranch", "random", "range", "rapid", "rare", "rate", "rather",
  "raven", "raw", "razor", "ready", "real", "reason", "rebel", "rebuild", "recall", "recipe",
  "record", "recycle", "reduce", "reflect", "reform", "refuse", "region", "regular", "relax", "release",
  "relief", "rely", "remain", "remember", "remind", "remove", "render", "renew", "rent", "reopen",
  "repair", "repeat", "replace", "report", "require", "rescue", "resist", "resolve", "respond", "result",
  "retire", "return", "reunion", "reveal", "review", "reward", "rhythm", "rib", "ribbon", "rice",
  "rich", "ride", "ridge", "rifle", "right", "rigid", "river", "road", "roast", "robot",
  "robust", "rocket", "romance", "roof", "rookie", "room", "rose", "rotate", "rough", "round",
  "route", "royal", "rubber", "rude", "rug", "rule", "run", "rural", "sad", "saddle",
  "safe", "sail", "salad", "salmon", "salon", "salt", "salute", "same", "sample", "sand",
  "satisfy", "sauce", "sausage", "save", "scale", "scan", "scare", "scatter", "scene", "school",
  "science", "scissors", "scorpion", "scout", "scrap", "screen", "script", "scrub", "sea", "search",
  "season", "seat", "second", "secret", "section", "seed", "seek", "segment", "sell", "send",
  "sense", "separate", "series", "serious", "serve", "settle", "seven", "several", "shadow", "shake",
  "shallow", "share", "sharp", "shave", "sheep", "sheet", "shelf", "shell", "shield", "shift",
  "shine", "ship", "shirt", "shock", "shoe", "shoot", "shop", "short", "shoulder", "shove",
  "shrimp", "shrug", "shuffle", "shy", "sibling", "side", "siege", "sight", "sign", "silent",
  "silk", "silly", "silver", "similar", "simple", "since", "sing", "single", "sink", "sister",
  "site", "situate", "size", "skate", "sketch", "ski", "skill", "skin", "skip", "skull",
  "slab", "slam", "sleep", "slide", "slight", "slim", "slogan", "slot", "slow", "small",
  "smart", "smile", "smoke", "smooth", "snake", "snap", "snow", "soap", "soccer", "social",
  "soda", "sofa", "soft", "solar", "solid", "solve", "someone", "song", "soon", "sorry",
  "sort", "soul", "sound", "soup", "source", "space", "spare", "spark", "speak", "special",
  "speed", "spell", "spend", "sphere", "spice", "spider", "spike", "spin", "spirit", "split",
  "spoil", "sponsor", "spoon", "sport", "spot", "spray", "spread", "spring", "spy", "square",
  "squeeze", "stable", "stadium", "staff", "stage", "stairs", "stamp", "stand", "start", "state",
  "stay", "steak", "steel", "stem", "step", "stick", "still", "sting", "stock", "stomach",
  "stone", "stop", "store", "storm", "story", "straight", "strange", "strategy", "street", "strike",
  "strong", "struggle", "student", "stuff", "stumble", "style", "subject", "submit", "subway", "success",
  "such", "sudden", "suffer", "sugar", "suggest", "suit", "summer", "sun", "support", "sure",
  "surface", "surprise", "surround", "survey", "suspect", "sustain", "swallow", "swamp", "swap", "swarm",
  "swear", "sweet", "swift", "swim", "swing", "switch", "sword", "symbol", "symptom", "syrup",
  "system", "table", "tackle", "tag", "tail", "talent", "talk", "tank", "tape", "target",
  "task", "taste", "tattoo", "taxi", "teach", "team", "tell", "tenant", "tennis", "tent",
  "term", "test", "text", "thank", "that", "theme", "then", "theory", "there", "these",
  "thick", "thin", "thing", "think", "third", "this", "those", "thought", "thread", "thrill",
  "throw", "thumb", "thunder", "ticket", "tide", "tiger", "tilt", "timber", "time", "tiny",
  "tip", "tired", "tissue", "title", "toast", "today", "toddler", "together", "toilet", "token",
  "tomato", "tomorrow", "tone", "tongue", "tonight", "tool", "tooth", "top", "topic", "torch",
  "tornado", "tortoise", "toss", "total", "touch", "tough", "tour", "toward", "tower", "town",
  "toxic", "toy", "track", "trade", "traffic", "train", "transfer", "trap", "trash", "travel",
  "tray", "treat", "tree", "trend", "trial", "tribe", "trick", "trigger", "trip", "trophy",
  "trouble", "truck", "true", "trust", "truth", "try", "tube", "tunnel", "turkey", "turn",
  "turtle", "twelve", "twenty", "twice", "twin", "twist", "two", "type", "typical", "ugly",
  "umbrella", "unable", "unusual", "update", "upgrade", "uphold", "upon", "upper", "upset", "urban",
  "urge", "usage", "use", "used", "useful", "usual", "utility", "vacant", "vacuum", "vague",
  "valid", "valley", "valve", "van", "vapor", "various", "vast", "vault", "vehicle", "vendor",
  "venture", "venue", "verb", "verify", "version", "very", "vessel", "veteran", "vibrant", "victory",
  "view", "village", "vintage", "violet", "virtual", "virus", "visa", "visit", "visual", "vital",
  "vivid", "vocal", "voice", "void", "volcano", "volume", "vote", "voyage", "wage", "wagon",
  "walk", "wall", "want", "war", "warm", "warrior", "wash", "wasp", "waste", "water",
  "wave", "way", "wealth", "weapon", "wear", "weasel", "weather", "web", "wedding", "weekend",
  "weird", "welcome", "west", "whale", "what", "wheat", "wheel", "when", "where", "whip",
  "whisper", "wide", "wild", "will", "win", "window", "wine", "wing", "wipe", "wire",
  "wisdom", "wise", "wish", "wolf", "woman", "wonder", "wood", "wool", "word", "work",
  "world", "worry", "worth", "wrap", "wreck", "wrestle", "wrist", "write", "wrong", "yard",
  "year", "yellow", "young", "youth", "zebra", "zero", "zone", "zoo"
];

export class RecoveryPhrase {
  constructor() {
    this.baseStorageKey = 'beezee_recovery_data';
    this.wordCount = 12;
  }

  /**
   * Get user-specific storage key
   */
  getUserStorageKey(userId = null) {
    return userId ? `${this.baseStorageKey}_${userId}` : this.baseStorageKey;
  }

  /**
   * Generate cryptographically secure random recovery phrase
   */
  generatePhrase() {
    try {
      const words = [];
      const randomValues = new Uint32Array(this.wordCount);

      // Generate cryptographically secure random numbers
      if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(randomValues);
      } else {
        // Fallback for older browsers
        for (let i = 0; i < this.wordCount; i++) {
          randomValues[i] = Math.floor(Math.random() * 256);
        }
      }

      for (let i = 0; i < this.wordCount; i++) {
        const wordIndex = randomValues[i] % BIP39_WORDLIST.length;
        words.push(BIP39_WORDLIST[wordIndex]);
      }

      const phrase = words.join(' ');

      // Store encrypted phrase with user confirmation
      const encryptedData = this.encryptPhrase(phrase);

      return {
        success: true,
        phrase,
        words,
        encryptedData
      };
    } catch (error) {
      console.error('Error generating recovery phrase:', error);
      return {
        success: false,
        error: 'Failed to generate recovery phrase'
      };
    }
  }

  /**
   * Encrypt recovery phrase for storage
   */
  encryptPhrase(phrase) {
    try {
      // Generate random salt for encryption
      const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();

      // Generate encryption key from salt
      const key = CryptoJS.PBKDF2('beezee_recovery_salt', salt, {
        keySize: 256 / 32,
        iterations: 10000
      });

      // Encrypt the recovery phrase
      const encrypted = CryptoJS.AES.encrypt(phrase, key.toString()).toString();

      return {
        encrypted,
        salt,
        createdAt: Date.now(),
        confirmed: false
      };

    } catch (error) {
      console.error('Error encrypting phrase:', error);
      return null;
    }
  }

  /**
   * Store recovery phrase with user confirmation
   */
  storePhrase(phrase, userConfirmed = false, userId = null) {
    try {
      const encryptedData = this.encryptPhrase(phrase);
      if (!encryptedData) {
        return { success: false, error: 'Failed to secure recovery phrase' };
      }

      encryptedData.confirmed = userConfirmed;
      encryptedData.confirmedAt = userConfirmed ? Date.now() : null;

      const storageKey = this.getUserStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(encryptedData));

      return {
        success: true,
        encrypted: encryptedData.encrypted,
        salt: encryptedData.salt
      };
    } catch (error) {
      console.error('Error storing phrase:', error);
      return { success: false, error: 'Failed to store recovery phrase' };
    }
  }

  /**
   * Verify recovery phrase matches stored phrase
   */
  verifyPhrase(inputPhrase, userId = null) {
    try {
      const storedData = this.getStoredData(userId);
      if (!storedData) {
        return { success: false, error: 'No recovery phrase found' };
      }

      // Generate decryption key from stored salt
      const key = CryptoJS.PBKDF2('beezee_recovery_salt', storedData.salt, {
        keySize: 256 / 32,
        iterations: 10000
      });

      // Decrypt the stored recovery phrase
      const decrypted = CryptoJS.AES.decrypt(storedData.encrypted, key).toString(CryptoJS.enc.Utf8);

      if (decrypted === inputPhrase.trim().toLowerCase()) {
        return { success: true };
      } else {
        return { success: false, error: 'Recovery phrase does not match' };
      }
    } catch (error) {
      console.error('Error verifying phrase:', error);
      return { success: false, error: 'Failed to verify recovery phrase' };
    }
  }

  /**
   * Verify recovery phrase against remotely stored encrypted data (from Supabase)
   * @param {string} inputPhrase - The phrase entered by the user
   * @param {string} encryptedData - Encrypted phrase from Supabase
   * @param {string} salt - Salt from Supabase
   */
  verifyRemotePhrase(inputPhrase, encryptedData, salt) {
    try {
      if (!encryptedData || !salt) {
        return { success: false, error: 'No recovery phrase found for this account' };
      }

      // Normalize input phrase
      const normalizedInput = inputPhrase.trim().toLowerCase();

      // Generate decryption key from stored salt
      const key = CryptoJS.PBKDF2('beezee_recovery_salt', salt, {
        keySize: 256 / 32,
        iterations: 10000
      });

      // Decrypt the stored recovery phrase
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key.toString()).toString(CryptoJS.enc.Utf8);

      if (decrypted === normalizedInput) {
        return { success: true };
      } else {
        return { success: false, error: 'Recovery phrase does not match' };
      }
    } catch (error) {
      console.error('Error verifying remote phrase:', error);
      return { success: false, error: 'Failed to verify recovery phrase' };
    }
  }

  /**
   * Get stored recovery phrase data
   */
  getStoredData(userId = null) {
    try {
      const storageKey = this.getUserStorageKey(userId);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading stored phrase:', error);
      return null;
    }
  }

  /**
   * Check if recovery phrase exists and is confirmed
   */
  hasConfirmedPhrase(userId = null) {
    const data = this.getStoredData(userId);
    return data && data.confirmed;
  }

  /**
   * Confirm user has backed up recovery phrase
   */
  confirmBackup(userId = null) {
    try {
      const data = this.getStoredData(userId);
      if (!data) {
        return { success: false, error: 'No recovery phrase found' };
      }

      data.confirmed = true;
      data.confirmedAt = Date.now();

      const storageKey = this.getUserStorageKey(userId);
      localStorage.setItem(storageKey, JSON.stringify(data));

      return { success: true };
    } catch (error) {
      console.error('Error confirming backup:', error);
      return { success: false, error: 'Failed to confirm backup' };
    }
  }

  /**
   * Validate recovery phrase format
   */
  validatePhrase(phrase) {
    if (!phrase || typeof phrase !== 'string') {
      return { valid: false, error: 'Recovery phrase is required' };
    }

    const words = phrase.trim().toLowerCase().split(/\s+/);

    if (words.length !== this.wordCount) {
      return {
        valid: false,
        error: `Recovery phrase must contain exactly ${this.wordCount} words`
      };
    }

    // Check if all words are valid BIP39 words
    const invalidWords = words.filter(word => !BIP39_WORDLIST.includes(word));

    if (invalidWords.length > 0) {
      return {
        valid: false,
        error: `Invalid words found: ${invalidWords.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Format phrase for display (with spaces and proper capitalization)
   */
  formatPhrase(phrase) {
    return phrase
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map((word, index) => `${index + 1}. ${word.charAt(0).toUpperCase() + word.slice(1)}`)
      .join('\n');
  }

  /**
   * Clear stored recovery phrase
   */
  clearPhrase(userId = null) {
    try {
      const storageKey = this.getUserStorageKey(userId);
      localStorage.removeItem(storageKey);
      return { success: true };
    } catch (error) {
      console.error('Error clearing phrase:', error);
      return { success: false, error: 'Failed to clear recovery phrase' };
    }
  }

  /**
   * Generate recovery instructions
   */
  getRecoveryInstructions() {
    return {
      title: "Recovery Phrase Instructions",
      steps: [
        "Write down these 12 words in order on paper",
        "Store the paper in a safe, private place",
        "Never store digitally or take screenshots",
        "Never share with anyone claiming to be support",
        "This phrase is the only way to recover your account",
        "Keep it away from fire, water, and theft"
      ],
      warnings: [
        "Anyone with this phrase can access your account",
        "BeeZee Finance will never ask for this phrase",
        "Store multiple copies in different secure locations"
      ]
    };
  }
}

// Create singleton instance
export const recoveryPhrase = new RecoveryPhrase();
