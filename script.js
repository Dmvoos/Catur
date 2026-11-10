/**
 * GrandChess AI — Complete Chess Engine, AI (Minimax + Alpha-Beta + PST), & Interactive UI
 */

// ==================== CRISP STAUNTON SVG PIECES ====================
const PIECE_SVGS = {
  wP: `<svg viewBox="0 0 45 45"><path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17,21 15,24.5 15,29 L 30,29 C 30,24.5 28,21 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z M 11.5,37 L 33.5,37 C 33.5,33.5 30.5,31 27,31 L 18,31 C 14.5,31 11.5,33.5 11.5,37 z" fill="#ffffff" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/></svg>`,
  wR: `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/><path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"/><path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"/><path d="M 34,14 L 31,17 L 14,17 L 11,14"/><path d="M 31,17 L 31,29.5 L 14,29.5 L 14,17"/><path d="M 14,29.5 L 12,32 L 33,32 L 31,29.5"/></g></svg>`,
  wN: `<svg viewBox="0 0 45 45"><g fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#ffffff"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="#ffffff"/><circle cx="15.5" cy="14.5" r="1.2" fill="#1e293b"/></g></svg>`,
  wB: `<svg viewBox="0 0 45 45"><g fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="#ffffff"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/><circle cx="22.5" cy="8" r="2.2"/></g><path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"/></g></svg>`,
  wQ: `<svg viewBox="0 0 45 45"><g fill="#ffffff" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"/><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"/><circle cx="6" cy="12" r="1.8"/><circle cx="14" cy="9" r="1.8"/><circle cx="22.5" cy="8" r="1.8"/><circle cx="31" cy="9" r="1.8"/><circle cx="39" cy="12" r="1.8"/></g></svg>`,
  wK: `<svg viewBox="0 0 45 45"><g fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6"/><path d="M 20,8 L 25,8"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" fill="#ffffff"/><path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z" fill="#ffffff"/><path d="M 11.5,30 C 17,27 27,27 32.5,30"/><path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5"/></g></svg>`,

  bP: `<svg viewBox="0 0 45 45"><path d="M 22.5,9 C 19.5,9 17,11.5 17,14.5 C 17,16.8 18.4,18.7 20.4,19.5 C 17,21 15,24.5 15,29 L 30,29 C 30,24.5 28,21 24.6,19.5 C 26.6,18.7 28,16.8 28,14.5 C 28,11.5 25.5,9 22.5,9 z M 11.5,37 L 33.5,37 C 33.5,33.5 30.5,31 27,31 L 18,31 C 14.5,31 11.5,33.5 11.5,37 z" fill="#1e293b" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  bR: `<svg viewBox="0 0 45 45"><g fill="#1e293b" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,39 L 36,39 L 36,36 L 9,36 L 9,39 z"/><path d="M 12,36 L 12,32 L 33,32 L 33,36 L 12,36 z"/><path d="M 11,14 L 11,9 L 15,9 L 15,11 L 20,11 L 20,9 L 25,9 L 25,11 L 30,11 L 30,9 L 34,9 L 34,14"/><path d="M 34,14 L 31,17 L 14,17 L 11,14"/><path d="M 31,17 L 31,29.5 L 14,29.5 L 14,17"/><path d="M 14,29.5 L 12,32 L 33,32 L 31,29.5"/></g></svg>`,
  bN: `<svg viewBox="0 0 45 45"><g fill="none" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" fill="#1e293b"/><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" fill="#1e293b"/><circle cx="15.5" cy="14.5" r="1.2" fill="#f8fafc"/></g></svg>`,
  bB: `<svg viewBox="0 0 45 45"><g fill="none" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><g fill="#1e293b"><path d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z"/><path d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z"/><circle cx="22.5" cy="8" r="2.2"/></g><path d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"/></g></svg>`,
  bQ: `<svg viewBox="0 0 45 45"><g fill="#1e293b" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 9,26 C 17.5,24.5 30,24.5 36,26 L 38.5,13.5 L 31,25 L 30.7,10.9 L 25.5,24.5 L 22.5,10 L 19.5,24.5 L 14.3,10.9 L 14,25 L 6.5,13.5 L 9,26 z"/><path d="M 9,26 C 9,28 10.5,28 11.5,30 C 12.5,31.5 12.5,31 12,33.5 C 10.5,34.5 11,36 11,36 C 9.5,37.5 11,38.5 11,38.5 C 17.5,39.5 27.5,39.5 34,38.5 C 34,38.5 35.5,37.5 34,36 C 34,36 34.5,34.5 33,33.5 C 32.5,31 32.5,31.5 33.5,30 C 34.5,28 36,28 36,26 C 27.5,24.5 17.5,24.5 9,26 z"/><circle cx="6" cy="12" r="1.8"/><circle cx="14" cy="9" r="1.8"/><circle cx="22.5" cy="8" r="1.8"/><circle cx="31" cy="9" r="1.8"/><circle cx="39" cy="12" r="1.8"/></g></svg>`,
  bK: `<svg viewBox="0 0 45 45"><g fill="none" stroke="#f8fafc" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M 22.5,11.63 L 22.5,6"/><path d="M 20,8 L 25,8"/><path d="M 22.5,25 C 22.5,25 27,17.5 25.5,14.5 C 25.5,14.5 24.5,12 22.5,12 C 20.5,12 19.5,14.5 19.5,14.5 C 18,17.5 22.5,25 22.5,25" fill="#1e293b"/><path d="M 11.5,37 C 17,40.5 27,40.5 32.5,37 L 32.5,30 C 32.5,30 41.5,25.5 38.5,19.5 C 34.5,13 25,16 22.5,23.5 L 22.5,27 L 22.5,23.5 C 19,16 9.5,13 6.5,19.5 C 3.5,25.5 11.5,29.5 11.5,29.5 L 11.5,37 z" fill="#1e293b"/><path d="M 11.5,30 C 17,27 27,27 32.5,30"/><path d="M 11.5,33.5 C 17,30.5 27,30.5 32.5,33.5"/></g></svg>`
};

const UNICODE_PIECES = {
  wP: '♙', wN: '♘', wB: '♗', wR: '♖', wQ: '♕', wK: '♔',
  bP: '♟', bN: '♞', bB: '♝', bR: '♜', bQ: '♛', bK: '♚'
};

const PIECE_VALUES = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };
const MATERIAL_POINTS = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };

// ==================== PIECE-SQUARE TABLES (FROM WHITE PERSPECTIVE) ====================
const PST = {
  P: [
    [  0,  0,  0,  0,  0,  0,  0,  0],
    [ 50, 50, 50, 50, 50, 50, 50, 50],
    [ 10, 10, 20, 30, 30, 20, 10, 10],
    [  5,  5, 10, 25, 25, 10,  5,  5],
    [  0,  0,  0, 20, 20,  0,  0,  0],
    [  5, -5,-10,  0,  0,-10, -5,  5],
    [  5, 10, 10,-20,-20, 10, 10,  5],
    [  0,  0,  0,  0,  0,  0,  0,  0]
  ],
  N: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  B: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  R: [
    [  0,  0,  0,  0,  0,  0,  0,  0],
    [  5, 10, 10, 10, 10, 10, 10,  5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [ -5,  0,  0,  0,  0,  0,  0, -5],
    [  0,  0,  0,  5,  5,  0,  0,  0]
  ],
  Q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
  ],
  K: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20]
  ]
};

// ==================== WEB AUDIO SOUND SYNTHESIZER ====================
class SoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(type) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (type === 'move') {
        this.tone(220, 140, 0.07, 'sine', now, 0.14);
      } else if (type === 'capture') {
        this.tone(180, 90, 0.1, 'triangle', now, 0.22);
        this.tone(320, 160, 0.08, 'sine', now + 0.02, 0.14);
      } else if (type === 'check') {
        this.tone(587, 587, 0.12, 'sine', now, 0.18);
        this.tone(880, 880, 0.22, 'sine', now + 0.09, 0.2);
      } else if (type === 'castle') {
        this.tone(200, 150, 0.07, 'sine', now, 0.15);
        this.tone(260, 190, 0.07, 'sine', now + 0.09, 0.15);
      } else if (type === 'promote') {
        this.tone(440, 660, 0.15, 'triangle', now, 0.18);
        this.tone(660, 880, 0.2, 'triangle', now + 0.12, 0.18);
      } else if (type === 'gameover') {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          this.tone(freq, freq, 0.22, 'triangle', now + idx * 0.1, 0.16);
        });
      }
    } catch (_) {
      // Ignore audio errors on restricted autoplay
    }
  }

  tone(startFreq, endFreq, duration, wave, startTime, gainVal) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(startFreq, startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), startTime + duration);

    gain.gain.setValueAtTime(gainVal, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }
}

const sfx = new SoundFX();

// ==================== MAIN CHESS GAME STATE & ENGINE ====================
class ChessGame {
  constructor() {
    this.difficulty = 'medium'; // 'easy', 'medium', 'hard', 'master', 'pvp'
    this.humanColor = 'w';      // 'w' or 'b'
    this.flipped = false;
    this.timeLimit = 600;       // seconds (0 = unlimited)
    this.timers = { w: 600, b: 600 };
    this.timerInterval = null;

    this.resetState();
  }

  resetState() {
    this.board = [
      ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
      ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
      ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
    ];
    this.turn = 'w';
    this.castling = { wK: true, wQ: true, bK: true, bQ: true };
    this.enPassant = null; // { r, c } square where en-passant capture lands
    this.halfMoveClock = 0;
    this.fullMoveNumber = 1;
    this.history = [];     // snapshots for undo &SAN
    this.positionCounts = {};
    this.captured = { w: [], b: [] }; // w: pieces captured BY white (black pieces), b: pieces captured BY black
    this.gameOver = false;
    this.winner = null;
    this.gameOverReason = '';

    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.lastMove = null;
    this.hintMove = null;
    this.aiThinking = false;

    this.recordPositionHash();
  }

  getPositionHash(board = this.board, turn = this.turn, castling = this.castling, ep = this.enPassant) {
    const rows = board.map(r => r.map(p => p || '.').join('')).join('/');
    const cStr = `${castling.wK ? 'K' : ''}${castling.wQ ? 'Q' : ''}${castling.bK ? 'k' : ''}${castling.bQ ? 'q' : ''}`;
    const epStr = ep ? `${ep.r},${ep.c}` : '-';
    return `${rows} ${turn} ${cStr} ${epStr}`;
  }

  recordPositionHash() {
    const hash = this.getPositionHash();
    this.positionCounts[hash] = (this.positionCounts[hash] || 0) + 1;
  }

  cloneBoard(board = this.board) {
    return board.map(row => row.slice());
  }

  inBounds(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  findKing(color, board = this.board) {
    const target = `${color}K`;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (board[r][c] === target) return { r, c };
      }
    }
    return null;
  }

  isSquareAttacked(r, c, byColor, board = this.board) {
    // 1. Pawn attacks
    const pawnDir = byColor === 'w' ? 1 : -1; // row where attacking pawn stands relative to target
    for (const dc of [-1, 1]) {
      const pr = r + pawnDir;
      const pc = c + dc;
      if (this.inBounds(pr, pc) && board[pr][pc] === `${byColor}P`) return true;
    }

    // 2. Knight attacks
    const knightOffsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];
    for (const [dr, dc] of knightOffsets) {
      const nr = r + dr, nc = c + dc;
      if (this.inBounds(nr, nc) && board[nr][nc] === `${byColor}N`) return true;
    }

    // 3. King attacks
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const kr = r + dr, kc = c + dc;
        if (this.inBounds(kr, kc) && board[kr][kc] === `${byColor}K`) return true;
      }
    }

    // 4. Orthogonal sliders (Rook & Queen)
    const orthoDirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of orthoDirs) {
      let nr = r + dr, nc = c + dc;
      while (this.inBounds(nr, nc)) {
        const p = board[nr][nc];
        if (p) {
          if (p === `${byColor}R` || p === `${byColor}Q`) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    // 5. Diagonal sliders (Bishop & Queen)
    const diagDirs = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of diagDirs) {
      let nr = r + dr, nc = c + dc;
      while (this.inBounds(nr, nc)) {
        const p = board[nr][nc];
        if (p) {
          if (p === `${byColor}B` || p === `${byColor}Q`) return true;
          break;
        }
        nr += dr;
        nc += dc;
      }
    }

    return false;
  }

  isInCheck(color, board = this.board) {
    const kingPos = this.findKing(color, board);
    if (!kingPos) return false;
    const enemy = color === 'w' ? 'b' : 'w';
    return this.isSquareAttacked(kingPos.r, kingPos.c, enemy, board);
  }

  generatePseudoMoves(r, c, board = this.board, castling = this.castling, enPassant = this.enPassant) {
    const piece = board[r][c];
    if (!piece) return [];
    const color = piece[0];
    const type = piece[1];
    const enemy = color === 'w' ? 'b' : 'w';
    const moves = [];

    if (type === 'P') {
      const dir = color === 'w' ? -1 : 1;
      const startRow = color === 'w' ? 6 : 1;
      const promoRow = color === 'w' ? 0 : 7;

      // 1 step forward
      const r1 = r + dir;
      if (this.inBounds(r1, c) && !board[r1][c]) {
        if (r1 === promoRow) {
          ['Q', 'R', 'B', 'N'].forEach(promo => {
            moves.push({ fromR: r, fromC: c, toR: r1, toC: c, promotion: promo });
          });
        } else {
          moves.push({ fromR: r, fromC: c, toR: r1, toC: c });
        }

        // 2 steps forward from start
        const r2 = r + dir * 2;
        if (r === startRow && !board[r2][c]) {
          moves.push({ fromR: r, fromC: c, toR: r2, toC: c, doublePawn: true });
        }
      }

      // Captures
      for (const dc of [-1, 1]) {
        const nc = c + dc;
        if (!this.inBounds(r1, nc)) continue;
        const target = board[r1][nc];
        if (target && target[0] === enemy) {
          if (r1 === promoRow) {
            ['Q', 'R', 'B', 'N'].forEach(promo => {
              moves.push({ fromR: r, fromC: c, toR: r1, toC: nc, capture: target, promotion: promo });
            });
          } else {
            moves.push({ fromR: r, fromC: c, toR: r1, toC: nc, capture: target });
          }
        } else if (enPassant && enPassant.r === r1 && enPassant.c === nc) {
          moves.push({
            fromR: r,
            fromC: c,
            toR: r1,
            toC: nc,
            enPassant: true,
            capture: `${enemy}P`
          });
        }
      }
    } else if (type === 'N') {
      const offsets = [
        [-2, -1], [-2, 1], [-1, -2], [-1, 2],
        [1, -2], [1, 2], [2, -1], [2, 1]
      ];
      for (const [dr, dc] of offsets) {
        const nr = r + dr, nc = c + dc;
        if (!this.inBounds(nr, nc)) continue;
        const target = board[nr][nc];
        if (!target) {
          moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
        } else if (target[0] === enemy) {
          moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, capture: target });
        }
      }
    } else if (type === 'B' || type === 'R' || type === 'Q') {
      const dirs = [];
      if (type === 'B' || type === 'Q') dirs.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
      if (type === 'R' || type === 'Q') dirs.push([-1, 0], [1, 0], [0, -1], [0, 1]);

      for (const [dr, dc] of dirs) {
        let nr = r + dr, nc = c + dc;
        while (this.inBounds(nr, nc)) {
          const target = board[nr][nc];
          if (!target) {
            moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
          } else {
            if (target[0] === enemy) {
              moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, capture: target });
            }
            break;
          }
          nr += dr;
          nc += dc;
        }
      }
    } else if (type === 'K') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (!this.inBounds(nr, nc)) continue;
          const target = board[nr][nc];
          if (!target) {
            moves.push({ fromR: r, fromC: c, toR: nr, toC: nc });
          } else if (target[0] === enemy) {
            moves.push({ fromR: r, fromC: c, toR: nr, toC: nc, capture: target });
          }
        }
      }

      // Castling
      const homeRow = color === 'w' ? 7 : 0;
      if (r === homeRow && c === 4 && !this.isSquareAttacked(homeRow, 4, enemy, board)) {
        // Kingside (O-O)
        const canKS = color === 'w' ? castling.wK : castling.bK;
        if (
          canKS &&
          board[homeRow][7] === `${color}R` &&
          !board[homeRow][5] &&
          !board[homeRow][6] &&
          !this.isSquareAttacked(homeRow, 5, enemy, board) &&
          !this.isSquareAttacked(homeRow, 6, enemy, board)
        ) {
          moves.push({ fromR: homeRow, fromC: 4, toR: homeRow, toC: 6, castle: 'K' });
        }

        // Queenside (O-O-O)
        const canQS = color === 'w' ? castling.wQ : castling.bQ;
        if (
          canQS &&
          board[homeRow][0] === `${color}R` &&
          !board[homeRow][1] &&
          !board[homeRow][2] &&
          !board[homeRow][3] &&
          !this.isSquareAttacked(homeRow, 3, enemy, board) &&
          !this.isSquareAttacked(homeRow, 2, enemy, board)
        ) {
          moves.push({ fromR: homeRow, fromC: 4, toR: homeRow, toC: 2, castle: 'Q' });
        }
      }
    }

    return moves;
  }

  applyMoveToBoard(move, board, castling) {
    const nextBoard = this.cloneBoard(board);
    const nextCastling = { ...castling };
    const piece = nextBoard[move.fromR][move.fromC];
    const color = piece[0];
    const type = piece[1];

    nextBoard[move.fromR][move.fromC] = null;

    if (move.enPassant) {
      const capRow = color === 'w' ? move.toR + 1 : move.toR - 1;
      nextBoard[capRow][move.toC] = null;
    }

    if (move.castle === 'K') {
      nextBoard[move.toR][5] = nextBoard[move.toR][7];
      nextBoard[move.toR][7] = null;
    } else if (move.castle === 'Q') {
      nextBoard[move.toR][3] = nextBoard[move.toR][0];
      nextBoard[move.toR][0] = null;
    }

    nextBoard[move.toR][move.toC] = move.promotion ? `${color}${move.promotion}` : piece;

    // Update castling rights
    if (type === 'K') {
      if (color === 'w') { nextCastling.wK = false; nextCastling.wQ = false; }
      else { nextCastling.bK = false; nextCastling.bQ = false; }
    }
    if (move.fromR === 7 && move.fromC === 0) nextCastling.wQ = false;
    if (move.fromR === 7 && move.fromC === 7) nextCastling.wK = false;
    if (move.fromR === 0 && move.fromC === 0) nextCastling.bQ = false;
    if (move.fromR === 0 && move.fromC === 7) nextCastling.bK = false;

    if (move.toR === 7 && move.toC === 0) nextCastling.wQ = false;
    if (move.toR === 7 && move.toC === 7) nextCastling.wK = false;
    if (move.toR === 0 && move.toC === 0) nextCastling.bQ = false;
    if (move.toR === 0 && move.toC === 7) nextCastling.bK = false;

    const nextEnPassant = move.doublePawn
      ? { r: (move.fromR + move.toR) / 2, c: move.fromC }
      : null;

    return { nextBoard, nextCastling, nextEnPassant };
  }

  getLegalMovesForSquare(r, c, board = this.board, castling = this.castling, enPassant = this.enPassant) {
    const piece = board[r][c];
    if (!piece) return [];
    const color = piece[0];
    const pseudo = this.generatePseudoMoves(r, c, board, castling, enPassant);
    const legal = [];

    for (const move of pseudo) {
      const { nextBoard } = this.applyMoveToBoard(move, board, castling);
      if (!this.isInCheck(color, nextBoard)) {
        legal.push(move);
      }
    }
    return legal;
  }

  getAllLegalMoves(color = this.turn, board = this.board, castling = this.castling, enPassant = this.enPassant) {
    const all = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p[0] === color) {
          const moves = this.getLegalMovesForSquare(r, c, board, castling, enPassant);
          all.push(...moves);
        }
      }
    }
    return all;
  }

  // Format move into Standard Algebraic Notation (SAN)
  toSAN(move, allLegalBeforeMove) {
    if (move.castle === 'K') return 'O-O';
    if (move.castle === 'Q') return 'O-O-O';

    const files = 'abcdefgh';
    const piece = this.board[move.fromR][move.fromC];
    const type = piece[1];
    const dest = `${files[move.toC]}${8 - move.toR}`;
    let san = '';

    if (type === 'P') {
      if (move.capture) san += `${files[move.fromC]}x${dest}`;
      else san += dest;
      if (move.promotion) san += `=${move.promotion}`;
    } else {
      san += type;
      // Disambiguation if another piece of same type can move to same square
      const ambiguous = allLegalBeforeMove.filter(
        m =>
          (m.fromR !== move.fromR || m.fromC !== move.fromC) &&
          m.toR === move.toR &&
          m.toC === move.toC &&
          this.board[m.fromR][m.fromC] === piece
      );
      if (ambiguous.length > 0) {
        const sameFile = ambiguous.some(m => m.fromC === move.fromC);
        const sameRank = ambiguous.some(m => m.fromR === move.fromR);
        if (!sameFile) san += files[move.fromC];
        else if (!sameRank) san += `${8 - move.fromR}`;
        else san += `${files[move.fromC]}${8 - move.fromR}`;
      }
      if (move.capture) san += 'x';
      san += dest;
    }

    return san;
  }

  makeMove(move) {
    const allLegalBefore = this.getAllLegalMoves(this.turn);
    let san = this.toSAN(move, allLegalBefore);
    const movingPiece = this.board[move.fromR][move.fromC];
    const movingColor = movingPiece[0];
    const enemyColor = movingColor === 'w' ? 'b' : 'w';

    // Save state for Undo
    this.history.push({
      board: this.cloneBoard(this.board),
      turn: this.turn,
      castling: { ...this.castling },
      enPassant: this.enPassant ? { ...this.enPassant } : null,
      halfMoveClock: this.halfMoveClock,
      fullMoveNumber: this.fullMoveNumber,
      captured: { w: [...this.captured.w], b: [...this.captured.b] },
      lastMove: this.lastMove,
      positionCounts: { ...this.positionCounts },
      san: ''
    });

    const { nextBoard, nextCastling, nextEnPassant } = this.applyMoveToBoard(
      move,
      this.board,
      this.castling
    );

    if (move.capture) {
      this.captured[movingColor].push(move.capture);
    }

    if (movingPiece[1] === 'P' || move.capture) {
      this.halfMoveClock = 0;
    } else {
      this.halfMoveClock++;
    }

    if (movingColor === 'b') {
      this.fullMoveNumber++;
    }

    this.board = nextBoard;
    this.castling = nextCastling;
    this.enPassant = nextEnPassant;
    this.turn = enemyColor;
    this.lastMove = move;
    this.hintMove = null;
    this.selectedSquare = null;
    this.legalMovesForSelected = [];

    this.recordPositionHash();

    // Check status after move
    const inCheck = this.isInCheck(this.turn);
    const nextLegalMoves = this.getAllLegalMoves(this.turn);

    if (nextLegalMoves.length === 0) {
      if (inCheck) {
        san += '#';
        this.gameOver = true;
        this.winner = movingColor;
        this.gameOverReason = `Skakmat! ${movingColor === 'w' ? 'Putih' : 'Hitam'} memenangkan pertandingan.`;
      } else {
        this.gameOver = true;
        this.winner = 'draw';
        this.gameOverReason = 'Remis (Stalemate / Pat) — Tidak ada langkah legal tersisa.';
      }
    } else {
      if (inCheck) san += '+';
      if (this.isInsufficientMaterial()) {
        this.gameOver = true;
        this.winner = 'draw';
        this.gameOverReason = 'Remis — Material bidak tidak cukup untuk skakmat.';
      } else if (this.halfMoveClock >= 100) {
        this.gameOver = true;
        this.winner = 'draw';
        this.gameOverReason = 'Remis — Aturan 50 langkah tanpa pemukulan atau gerak pion.';
      } else if (this.positionCounts[this.getPositionHash()] >= 3) {
        this.gameOver = true;
        this.winner = 'draw';
        this.gameOverReason = 'Remis — Pengulangan posisi 3 kali (Threefold Repetition).';
      }
    }

    this.history[this.history.length - 1].san = san;

    // Play appropriate sound
    if (this.gameOver) sfx.play('gameover');
    else if (inCheck) sfx.play('check');
    else if (move.promotion) sfx.play('promote');
    else if (move.castle) sfx.play('castle');
    else if (move.capture) sfx.play('capture');
    else sfx.play('move');

    return san;
  }

  isInsufficientMaterial(board = this.board) {
    const pieces = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p[1] !== 'K') pieces.push(p);
      }
    }
    if (pieces.length === 0) return true; // K vs K
    if (pieces.length === 1 && (pieces[0][1] === 'N' || pieces[0][1] === 'B')) return true; // K+B/N vs K
    return false;
  }

  undoSingle() {
    if (this.history.length === 0) return false;
    const prev = this.history.pop();
    this.board = prev.board;
    this.turn = prev.turn;
    this.castling = prev.castling;
    this.enPassant = prev.enPassant;
    this.halfMoveClock = prev.halfMoveClock;
    this.fullMoveNumber = prev.fullMoveNumber;
    this.captured = prev.captured;
    this.lastMove = prev.lastMove;
    this.positionCounts = prev.positionCounts;
    this.gameOver = false;
    this.winner = null;
    this.gameOverReason = '';
    this.selectedSquare = null;
    this.legalMovesForSelected = [];
    this.hintMove = null;
    return true;
  }

  // ==================== AI ENGINE (EVALUATION & MINIMAX ALPHA-BETA) ====================
  evaluateBoard(board = this.board) {
    let score = 0; // positive = White advantage, negative = Black advantage

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (!p) continue;
        const color = p[0];
        const type = p[1];
        const baseVal = PIECE_VALUES[type] || 0;
        const pstRow = color === 'w' ? r : 7 - r;
        const pstBonus = PST[type] ? PST[type][pstRow][c] : 0;
        const total = baseVal + pstBonus;

        if (color === 'w') score += total;
        else score -= total;
      }
    }
    return score;
  }

  orderMoves(moves, board) {
    return moves.sort((a, b) => {
      let scoreA = 0, scoreB = 0;
      if (a.capture) {
        const attackerA = board[a.fromR][a.fromC];
        scoreA += 10 * PIECE_VALUES[a.capture[1]] - PIECE_VALUES[attackerA[1]] / 10;
      }
      if (a.promotion) scoreA += PIECE_VALUES[a.promotion];

      if (b.capture) {
        const attackerB = board[b.fromR][b.fromC];
        scoreB += 10 * PIECE_VALUES[b.capture[1]] - PIECE_VALUES[attackerB[1]] / 10;
      }
      if (b.promotion) scoreB += PIECE_VALUES[b.promotion];

      return scoreB - scoreA;
    });
  }

  findBestMove(color = this.turn, customDepth = null) {
    const legalMoves = this.getAllLegalMoves(color);
    if (legalMoves.length === 0) return null;
    if (legalMoves.length === 1) return legalMoves[0];

    // Easy Mode: Mix of 1-ply evaluation + random mistakes
    if (!customDepth && this.difficulty === 'easy') {
      if (Math.random() < 0.42) {
        return legalMoves[Math.floor(Math.random() * legalMoves.length)];
      }
      return this.searchRoot(color, 1, 90);
    }

    let depth = 3;
    let noise = 15;
    if (customDepth) {
      depth = customDepth;
      noise = 0;
    } else if (this.difficulty === 'medium') {
      depth = 2;
      noise = 22;
    } else if (this.difficulty === 'hard') {
      depth = 3;
      noise = 8;
    } else if (this.difficulty === 'master') {
      depth = 4;
      noise = 0;
    }

    return this.searchRoot(color, depth, noise);
  }

  searchRoot(color, depth, noise) {
    const maximizing = color === 'w';
    const moves = this.orderMoves(
      this.getAllLegalMoves(color, this.board, this.castling, this.enPassant),
      this.board
    );

    let bestMove = moves[0];
    let bestScore = maximizing ? -Infinity : Infinity;
    let alpha = -Infinity;
    let beta = Infinity;

    for (const move of moves) {
      const { nextBoard, nextCastling, nextEnPassant } = this.applyMoveToBoard(
        move,
        this.board,
        this.castling
      );
      const nextColor = color === 'w' ? 'b' : 'w';
      let evalScore = this.minimax(
        nextBoard,
        nextCastling,
        nextEnPassant,
        depth - 1,
        alpha,
        beta,
        nextColor === 'w'
      );

      if (noise > 0) {
        evalScore += (Math.random() * 2 - 1) * noise;
      }

      if (maximizing) {
        if (evalScore > bestScore) {
          bestScore = evalScore;
          bestMove = move;
        }
        alpha = Math.max(alpha, evalScore);
      } else {
        if (evalScore < bestScore) {
          bestScore = evalScore;
          bestMove = move;
        }
        beta = Math.min(beta, evalScore);
      }
    }

    return bestMove;
  }

  minimax(board, castling, enPassant, depth, alpha, beta, maximizingPlayer) {
    const currentColor = maximizingPlayer ? 'w' : 'b';
    const legalMoves = this.getAllLegalMoves(currentColor, board, castling, enPassant);

    if (legalMoves.length === 0) {
      if (this.isInCheck(currentColor, board)) {
        // Prefer faster checkmates
        return maximizingPlayer ? -99999 - depth * 100 : 99999 + depth * 100;
      }
      return 0; // Stalemate
    }

    if (depth === 0) {
      return this.evaluateBoard(board);
    }

    const ordered = this.orderMoves(legalMoves, board);

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      for (const move of ordered) {
        const { nextBoard, nextCastling, nextEnPassant } = this.applyMoveToBoard(
          move,
          board,
          castling
        );
        const evaluation = this.minimax(
          nextBoard,
          nextCastling,
          nextEnPassant,
          depth - 1,
          alpha,
          beta,
          false
        );
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of ordered) {
        const { nextBoard, nextCastling, nextEnPassant } = this.applyMoveToBoard(
          move,
          board,
          castling
        );
        const evaluation = this.minimax(
          nextBoard,
          nextCastling,
          nextEnPassant,
          depth - 1,
          alpha,
          beta,
          true
        );
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
      return minEval;
    }
  }
}

// ==================== UI CONTROLLER ====================
const game = new ChessGame();

const boardEl = document.getElementById('chessboard');
const statusTitleEl = document.getElementById('status-title');
const statusSubtitleEl = document.getElementById('status-subtitle');
const turnDotEl = document.getElementById('turn-dot');
const moveListEl = document.getElementById('move-list');
const moveCounterEl = document.getElementById('move-counter');
const evalFillEl = document.getElementById('eval-bar-fill');
const evalScoreEl = document.getElementById('eval-score');
const aiThinkingEl = document.getElementById('ai-thinking');

const selectDifficulty = document.getElementById('select-difficulty');
const selectTheme = document.getElementById('select-theme');
const btnUndo = document.getElementById('btn-undo');
const btnHint = document.getElementById('btn-hint');
const btnFlip = document.getElementById('btn-flip');
const btnResign = document.getElementById('btn-resign');

let pendingPromotionMoves = null;
let draggedFrom = null;

function formatClock(seconds) {
  if (game.timeLimit === 0) return '∞';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function startChessClock() {
  clearInterval(game.timerInterval);
  if (game.timeLimit === 0) {
    updateClocksUI();
    return;
  }
  game.timerInterval = setInterval(() => {
    if (game.gameOver) {
      clearInterval(game.timerInterval);
      return;
    }
    const active = game.turn;
    if (game.timers[active] > 0) {
      game.timers[active]--;
      updateClocksUI();
      if (game.timers[active] === 0) {
        game.gameOver = true;
        game.winner = active === 'w' ? 'b' : 'w';
        game.gameOverReason = `Waktu habis! ${game.winner === 'w' ? 'Putih' : 'Hitam'} menang waktu.`;
        sfx.play('gameover');
        renderAll();
        showGameOverModal();
      }
    }
  }, 1000);
}

function updateClocksUI() {
  const topColor = game.flipped ? 'w' : 'b';
  const bottomColor = game.flipped ? 'b' : 'w';

  const timerTop = document.getElementById('timer-top');
  const timerBottom = document.getElementById('timer-bottom');

  timerTop.textContent = formatClock(game.timers[topColor]);
  timerBottom.textContent = formatClock(game.timers[bottomColor]);

  timerTop.classList.toggle('low-time', game.timeLimit > 0 && game.timers[topColor] <= 30);
  timerBottom.classList.toggle('low-time', game.timeLimit > 0 && game.timers[bottomColor] <= 30);
}

function updatePlayerCards() {
  const topColor = game.flipped ? 'w' : 'b';
  const bottomColor = game.flipped ? 'b' : 'w';

  const diffLabels = {
    easy: 'Mudah (~600)',
    medium: 'Menengah (~1200)',
    hard: 'Sulit (~1600)',
    master: 'Grandmaster (~2000)',
    pvp: 'Pemain Lokal'
  };

  const describeSide = (color) => {
    const colorName = color === 'w' ? 'Putih' : 'Hitam';
    if (game.difficulty === 'pvp') {
      return {
        avatar: color === 'w' ? '♔' : '♚',
        name: `Pemain (${colorName})`,
        badge: '2 Pemain',
        isHuman: true
      };
    }
    if (color === game.humanColor) {
      return {
        avatar: '👤',
        name: `Anda (${colorName})`,
        badge: 'Pemain',
        isHuman: true
      };
    }
    return {
      avatar: '🤖',
      name: `Komputer AI (${colorName})`,
      badge: diffLabels[game.difficulty],
      isHuman: false
    };
  };

  const topMeta = describeSide(topColor);
  const bottomMeta = describeSide(bottomColor);

  document.getElementById('avatar-top').textContent = topMeta.avatar;
  document.getElementById('name-top').textContent = topMeta.name;
  document.getElementById('badge-top').textContent = topMeta.badge;

  document.getElementById('avatar-bottom').textContent = bottomMeta.avatar;
  document.getElementById('name-bottom').textContent = bottomMeta.name;
  document.getElementById('badge-bottom').textContent = bottomMeta.badge;

  document.getElementById('player-top').classList.toggle('active-turn', !game.gameOver && game.turn === topColor);
  document.getElementById('player-bottom').classList.toggle('active-turn', !game.gameOver && game.turn === bottomColor);

  // Captured pieces & Material difference
  const order = { Q: 1, R: 2, B: 3, N: 4, P: 5 };
  const formatCaptured = (arr) =>
    arr
      .slice()
      .sort((a, b) => order[a[1]] - order[b[1]])
      .map(p => UNICODE_PIECES[p])
      .join('');

  document.getElementById('captured-top').textContent = formatCaptured(game.captured[topColor]);
  document.getElementById('captured-bottom').textContent = formatCaptured(game.captured[bottomColor]);

  // Calculate material score on board
  let whiteMat = 0, blackMat = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = game.board[r][c];
      if (!p) continue;
      if (p[0] === 'w') whiteMat += MATERIAL_POINTS[p[1]];
      else blackMat += MATERIAL_POINTS[p[1]];
    }
  }

  const diff = whiteMat - blackMat;
  const advTop = document.getElementById('advantage-top');
  const advBottom = document.getElementById('advantage-bottom');

  const topAdv = topColor === 'w' ? diff : -diff;
  const bottomAdv = bottomColor === 'w' ? diff : -diff;

  if (topAdv > 0) {
    advTop.textContent = `+${topAdv}`;
    advTop.classList.remove('hidden');
  } else {
    advTop.classList.add('hidden');
  }

  if (bottomAdv > 0) {
    advBottom.textContent = `+${bottomAdv}`;
    advBottom.classList.remove('hidden');
  } else {
    advBottom.classList.add('hidden');
  }
}

function updateEvalBar() {
  const rawScore = game.evaluateBoard() / 100; // in pawns
  const clamped = Math.max(-10, Math.min(10, rawScore));
  const whitePercentage = 50 + (clamped / 10) * 45;
  evalFillEl.style.height = `${whitePercentage}%`;
  const sign = rawScore > 0 ? '+' : '';
  evalScoreEl.textContent = `${sign}${rawScore.toFixed(1)}`;
}

function renderBoard() {
  boardEl.innerHTML = '';
  const files = 'abcdefgh';
  const checkKingPos = game.isInCheck(game.turn) ? game.findKing(game.turn) : null;

  for (let viewR = 0; viewR < 8; viewR++) {
    for (let viewC = 0; viewC < 8; viewC++) {
      const r = game.flipped ? 7 - viewR : viewR;
      const c = game.flipped ? 7 - viewC : viewC;

      const sq = document.createElement('div');
      const isLight = (r + c) % 2 === 0;
      sq.className = `square ${isLight ? 'light' : 'dark'}`;
      sq.dataset.r = r;
      sq.dataset.c = c;

      // Coordinates on outer edges
      if (viewC === 0) {
        const rankSpan = document.createElement('span');
        rankSpan.className = 'coord-rank';
        rankSpan.textContent = 8 - r;
        sq.appendChild(rankSpan);
      }
      if (viewR === 7) {
        const fileSpan = document.createElement('span');
        fileSpan.className = 'coord-file';
        fileSpan.textContent = files[c];
        sq.appendChild(fileSpan);
      }

      // Highlight selected square
      if (game.selectedSquare && game.selectedSquare.r === r && game.selectedSquare.c === c) {
        sq.classList.add('selected');
      }

      // Highlight last move
      if (
        game.lastMove &&
        ((game.lastMove.fromR === r && game.lastMove.fromC === c) ||
          (game.lastMove.toR === r && game.lastMove.toC === c))
      ) {
        sq.classList.add('last-move');
      }

      // Highlight AI Hint
      if (
        game.hintMove &&
        ((game.hintMove.fromR === r && game.hintMove.fromC === c) ||
          (game.hintMove.toR === r && game.hintMove.toC === c))
      ) {
        sq.classList.add('hint-square');
      }

      // Highlight King in Check
      if (checkKingPos && checkKingPos.r === r && checkKingPos.c === c) {
        sq.classList.add('in-check');
      }

      // Render Piece SVG
      const piece = game.board[r][c];
      if (piece) {
        const pieceDiv = document.createElement('div');
        pieceDiv.className = 'piece';
        pieceDiv.innerHTML = PIECE_SVGS[piece];
        sq.appendChild(pieceDiv);
        sq.draggable = !game.gameOver && !game.aiThinking && piece[0] === game.turn;
      }

      // Legal move indicator dots / capture rings
      const legalMoveHere = game.legalMovesForSelected.find(m => m.toR === r && m.toC === c);
      if (legalMoveHere) {
        const indicator = document.createElement('div');
        indicator.className = legalMoveHere.capture || piece ? 'capture-ring' : 'move-dot';
        sq.appendChild(indicator);
      }

      // Click & Drag handlers
      sq.addEventListener('click', () => onSquareClick(r, c));
      sq.addEventListener('dragstart', (e) => onDragStart(e, r, c));
      sq.addEventListener('dragover', (e) => e.preventDefault());
      sq.addEventListener('drop', (e) => onDrop(e, r, c));

      boardEl.appendChild(sq);
    }
  }
}

function renderStatusAndHistory() {
  const inCheck = game.isInCheck(game.turn);
  turnDotEl.className = 'status-indicator';

  if (game.gameOver) {
    statusTitleEl.textContent = game.winner === 'draw' ? 'Pertandingan Remis' : 'Pertandingan Selesai!';
    statusSubtitleEl.textContent = game.gameOverReason;
    turnDotEl.classList.add('check-alert');
  } else {
    const turnName = game.turn === 'w' ? 'Putih' : 'Hitam';
    if (game.turn === 'b') turnDotEl.classList.add('black-turn');
    if (inCheck) turnDotEl.classList.add('check-alert');

    if (game.aiThinking) {
      statusTitleEl.textContent = 'Komputer AI Sedang Berpikir...';
      statusSubtitleEl.textContent = 'Mengkalkulasi langkah terbaik...';
    } else if (inCheck) {
      statusTitleEl.textContent = `SKAK! Giliran ${turnName}`;
      statusSubtitleEl.textContent = 'Lindungi Raja Anda dari ancaman!';
    } else {
      statusTitleEl.textContent = `Giliran ${turnName} Melangkah`;
      statusSubtitleEl.textContent = 'Klik atau seret bidak untuk melangkah';
    }
  }

  // Move History List
  const totalHalfMoves = game.history.length;
  moveCounterEl.textContent = `${Math.ceil(totalHalfMoves / 2)} langkah`;
  btnUndo.disabled = totalHalfMoves === 0 || game.aiThinking;

  if (totalHalfMoves === 0) {
    moveListEl.innerHTML = `<div class="empty-history">Belum ada langkah. Silakan mulai permainan!</div>`;
    return;
  }

  moveListEl.innerHTML = '';
  for (let i = 0; i < totalHalfMoves; i += 2) {
    const row = document.createElement('div');
    row.className = 'move-row';

    const numSpan = document.createElement('span');
    numSpan.className = 'move-num';
    numSpan.textContent = `${Math.floor(i / 2) + 1}.`;

    const wSpan = document.createElement('span');
    wSpan.className = `move-san ${i === totalHalfMoves - 1 ? 'latest' : ''}`;
    wSpan.textContent = game.history[i].san;

    const bSpan = document.createElement('span');
    bSpan.className = `move-san ${i + 1 === totalHalfMoves - 1 ? 'latest' : ''}`;
    bSpan.textContent = game.history[i + 1] ? game.history[i + 1].san : '';

    row.appendChild(numSpan);
    row.appendChild(wSpan);
    row.appendChild(bSpan);
    moveListEl.appendChild(row);
  }
  moveListEl.scrollTop = moveListEl.scrollHeight;
}

function renderAll() {
  renderBoard();
  updatePlayerCards();
  updateClocksUI();
  updateEvalBar();
  renderStatusAndHistory();
}

// ==================== HUMAN & AI INTERACTION ====================
function isHumanTurn() {
  if (game.gameOver || game.aiThinking) return false;
  if (game.difficulty === 'pvp') return true;
  return game.turn === game.humanColor;
}

function onSquareClick(r, c) {
  if (!isHumanTurn()) return;

  // Check if clicked square is a valid destination for currently selected piece
  const matchingMoves = game.legalMovesForSelected.filter(m => m.toR === r && m.toC === c);
  if (matchingMoves.length > 0) {
    if (matchingMoves.some(m => m.promotion)) {
      openPromotionModal(matchingMoves);
    } else {
      executeMoveAndContinue(matchingMoves[0]);
    }
    return;
  }

  // Otherwise select own piece
  const clickedPiece = game.board[r][c];
  if (clickedPiece && clickedPiece[0] === game.turn) {
    game.selectedSquare = { r, c };
    game.legalMovesForSelected = game.getLegalMovesForSquare(r, c);
  } else {
    game.selectedSquare = null;
    game.legalMovesForSelected = [];
  }
  renderBoard();
}

function onDragStart(e, r, c) {
  if (!isHumanTurn()) {
    e.preventDefault();
    return;
  }
  const piece = game.board[r][c];
  if (!piece || piece[0] !== game.turn) {
    e.preventDefault();
    return;
  }
  draggedFrom = { r, c };
  game.selectedSquare = { r, c };
  game.legalMovesForSelected = game.getLegalMovesForSquare(r, c);
  setTimeout(() => renderBoard(), 0);
}

function onDrop(e, r, c) {
  e.preventDefault();
  if (!draggedFrom || !isHumanTurn()) return;
  const matchingMoves = game.legalMovesForSelected.filter(m => m.toR === r && m.toC === c);
  draggedFrom = null;
  if (matchingMoves.length > 0) {
    if (matchingMoves.some(m => m.promotion)) {
      openPromotionModal(matchingMoves);
    } else {
      executeMoveAndContinue(matchingMoves[0]);
    }
  }
}

function openPromotionModal(promoMoves) {
  pendingPromotionMoves = promoMoves;
  const modal = document.getElementById('promotion-modal');
  const container = document.getElementById('promo-options');
  container.innerHTML = '';

  const color = game.turn;
  ['Q', 'R', 'B', 'N'].forEach(type => {
    const btn = document.createElement('button');
    btn.className = 'promo-btn';
    btn.innerHTML = PIECE_SVGS[`${color}${type}`];
    btn.addEventListener('click', () => {
      modal.classList.add('hidden');
      const chosen = pendingPromotionMoves.find(m => m.promotion === type);
      pendingPromotionMoves = null;
      if (chosen) executeMoveAndContinue(chosen);
    });
    container.appendChild(btn);
  });

  modal.classList.remove('hidden');
}

function executeMoveAndContinue(move) {
  game.makeMove(move);
  renderAll();

  if (game.gameOver) {
    setTimeout(() => showGameOverModal(), 350);
    return;
  }

  // Trigger AI turn if vs AI
  if (game.difficulty !== 'pvp' && game.turn !== game.humanColor) {
    triggerAIMove();
  }
}

function triggerAIMove() {
  if (game.gameOver) return;
  game.aiThinking = true;
  aiThinkingEl.classList.remove('hidden');
  renderStatusAndHistory();

  setTimeout(() => {
    const aiMove = game.findBestMove(game.turn);
    game.aiThinking = false;
    aiThinkingEl.classList.add('hidden');

    if (aiMove) {
      game.makeMove(aiMove);
      renderAll();
      if (game.gameOver) {
        setTimeout(() => showGameOverModal(), 350);
      }
    }
  }, 260);
}

function showGameOverModal() {
  const modal = document.getElementById('gameover-modal');
  const title = document.getElementById('gameover-title');
  const reason = document.getElementById('gameover-reason');
  const icon = document.getElementById('gameover-trophy');
  const movesStat = document.getElementById('stat-moves');
  const modeStat = document.getElementById('stat-mode');

  if (game.winner === 'draw') {
    icon.textContent = '🤝';
    title.textContent = 'Pertandingan Remis!';
  } else if (game.difficulty !== 'pvp' && game.winner !== game.humanColor) {
    icon.textContent = '🤖';
    title.textContent = 'Komputer AI Menang!';
  } else {
    icon.textContent = '🏆';
    title.textContent = 'Selamat, Anda Menang!';
  }

  reason.textContent = game.gameOverReason;
  movesStat.textContent = Math.ceil(game.history.length / 2);

  const modeNames = {
    easy: 'AI Mudah',
    medium: 'AI Sedang',
    hard: 'AI Sulit',
    master: 'AI Grandmaster',
    pvp: '2 Pemain'
  };
  modeStat.textContent = modeNames[game.difficulty];

  modal.classList.remove('hidden');
}

// ==================== TOOLBAR & MODAL CONTROLS ====================
selectDifficulty.addEventListener('change', (e) => {
  game.difficulty = e.target.value;
  updatePlayerCards();
  if (!game.gameOver && game.difficulty !== 'pvp' && game.turn !== game.humanColor) {
    triggerAIMove();
  }
});

selectTheme.addEventListener('change', (e) => {
  document.body.setAttribute('data-board-theme', e.target.value);
});

btnFlip.addEventListener('click', () => {
  game.flipped = !game.flipped;
  renderAll();
});

btnUndo.addEventListener('click', () => {
  if (game.aiThinking || game.history.length === 0) return;
  if (game.difficulty === 'pvp') {
    game.undoSingle();
  } else {
    // Undo AI move + Human move so it returns to Human's turn
    game.undoSingle();
    if (game.turn !== game.humanColor && game.history.length > 0) {
      game.undoSingle();
    }
  }
  sfx.play('move');
  renderAll();
});

btnHint.addEventListener('click', () => {
  if (!isHumanTurn()) return;
  const best = game.findBestMove(game.turn, 3);
  if (best) {
    game.hintMove = best;
    game.selectedSquare = { r: best.fromR, c: best.fromC };
    game.legalMovesForSelected = game.getLegalMovesForSquare(best.fromR, best.fromC);
    sfx.play('move');
    renderBoard();
  }
});

btnResign.addEventListener('click', () => {
  startNewConfiguredGame();
});

// Sound toggle
document.getElementById('btn-sound').addEventListener('click', () => {
  sfx.enabled = !sfx.enabled;
  document.getElementById('icon-sound-on').classList.toggle('hidden', !sfx.enabled);
  document.getElementById('icon-sound-off').classList.toggle('hidden', sfx.enabled);
});

// Copy PGN
document.getElementById('btn-copy-pgn').addEventListener('click', (e) => {
  if (game.history.length === 0) return;
  let pgn = '';
  for (let i = 0; i < game.history.length; i += 2) {
    pgn += `${Math.floor(i / 2) + 1}. ${game.history[i].san} `;
    if (game.history[i + 1]) pgn += `${game.history[i + 1].san} `;
  }
  navigator.clipboard?.writeText(pgn.trim());
  const btn = e.currentTarget;
  const orig = btn.textContent;
  btn.textContent = '✅ Tersalin!';
  setTimeout(() => { btn.textContent = orig; }, 1600);
});

// New Game Modal logic
const newGameModal = document.getElementById('new-game-modal');
let modalSelectedDiff = 'medium';
let modalSelectedSide = 'w';
let modalSelectedTime = 600;

document.getElementById('btn-new-game-modal').addEventListener('click', () => {
  newGameModal.classList.remove('hidden');
});

document.getElementById('btn-close-modal').addEventListener('click', () => {
  newGameModal.classList.add('hidden');
});

document.querySelectorAll('#modal-diff-grid .diff-option').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#modal-diff-grid .diff-option').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    modalSelectedDiff = btn.dataset.diff;
    document.getElementById('color-picker-group').classList.toggle('hidden', modalSelectedDiff === 'pvp');
  });
});

document.querySelectorAll('.side-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    modalSelectedSide = btn.dataset.side;
  });
});

document.querySelectorAll('.time-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    modalSelectedTime = parseInt(btn.dataset.time, 10);
  });
});

function startNewConfiguredGame() {
  game.difficulty = modalSelectedDiff;
  selectDifficulty.value = modalSelectedDiff;

  if (modalSelectedDiff === 'pvp') {
    game.humanColor = 'w';
    game.flipped = false;
  } else {
    const side = modalSelectedSide === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : modalSelectedSide;
    game.humanColor = side;
    game.flipped = side === 'b';
  }

  game.timeLimit = modalSelectedTime;
  game.timers = { w: modalSelectedTime, b: modalSelectedTime };
  game.resetState();

  newGameModal.classList.add('hidden');
  document.getElementById('gameover-modal').classList.add('hidden');

  startChessClock();
  renderAll();

  if (game.difficulty !== 'pvp' && game.humanColor === 'b') {
    triggerAIMove();
  }
}

document.getElementById('btn-start-game').addEventListener('click', startNewConfiguredGame);
document.getElementById('btn-play-again').addEventListener('click', () => {
  document.getElementById('gameover-modal').classList.add('hidden');
  newGameModal.classList.remove('hidden');
});
document.getElementById('btn-review-board').addEventListener('click', () => {
  document.getElementById('gameover-modal').classList.add('hidden');
});

// Initialize first game on load
startChessClock();
renderAll();
