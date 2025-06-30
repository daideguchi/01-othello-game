/**
 * オセロゲーム - 究極のUXと最強AI
 * 
 * ゲームロジックとAIエンジンを全面的に改修。
 * 破綻のないルール実装と、挑戦的な3段階のAIを搭載。
 */

// オセロゲーム - AI対戦機能付き完全版
class OthelloGame {
    constructor() {
        console.log('=== オセロゲーム起動 ===');
        
        // 盤面: 0=空, -1=黒, 1=白
        this.board = Array(8).fill(0).map(() => Array(8).fill(0));
        this.currentPlayer = 'black'; // 'black' or 'white'
        this.gameActive = true;
        this.isThinking = false; // AI思考中フラグ
        
        // ゲーム設定
        this.settings = {
            gameMode: 'human', // 'human' or 'ai'
            aiLevel: 'normal', // 'easy', 'normal', 'hard'
            aiPlayer: 'white', // AIは白を担当
            soundEnabled: true,
            hintMode: false
        };
        
        // DOM要素を取得
        this.initializeDOM();
        
        // イベントリスナーを設定
        this.setupEventListeners();
        
        // ゲームを初期化
        this.resetGame();
    }
    
    initializeDOM() {
        this.dom = {
            board: document.getElementById('game-board'),
            blackScore: document.getElementById('black-score'),
            whiteScore: document.getElementById('white-score'),
            currentPlayerText: document.getElementById('current-player-text'),
            gameStatus: document.getElementById('game-status'),
            
            // モードボタン
            humanBtn: document.getElementById('human-btn'),
            aiEasyBtn: document.getElementById('ai-easy-btn'),
            aiNormalBtn: document.getElementById('ai-normal-btn'),
            aiHardBtn: document.getElementById('ai-hard-btn'),
            
            // 操作ボタン
            hintBtn: document.getElementById('hint-btn'),
            restartBtn: document.getElementById('restart-btn'),
            
            // モーダル
            gameOverModal: document.getElementById('game-over-modal'),
            finalBlackScore: document.getElementById('final-black-score'),
            finalWhiteScore: document.getElementById('final-white-score'),
            winnerText: document.getElementById('winner-text'),
            playAgainBtn: document.getElementById('play-again-btn')
        };
        
        console.log('DOM要素取得完了:', {
            board: !!this.dom.board,
            humanBtn: !!this.dom.humanBtn,
            aiEasyBtn: !!this.dom.aiEasyBtn,
            aiNormalBtn: !!this.dom.aiNormalBtn,
            aiHardBtn: !!this.dom.aiHardBtn
        });
    }
    
    setupEventListeners() {
        console.log('=== イベントリスナー設定開始 ===');
        
        // モードボタン
        if (this.dom.humanBtn) {
            this.dom.humanBtn.addEventListener('click', () => {
                console.log('人間対戦モード選択');
                this.setGameMode('human');
            });
        }
        
        if (this.dom.aiEasyBtn) {
            this.dom.aiEasyBtn.addEventListener('click', () => {
                console.log('AI簡単モード選択');
                this.setGameMode('ai', 'easy');
            });
        }
        
        if (this.dom.aiNormalBtn) {
            this.dom.aiNormalBtn.addEventListener('click', () => {
                console.log('AI普通モード選択');
                this.setGameMode('ai', 'normal');
            });
        }
        
        if (this.dom.aiHardBtn) {
            this.dom.aiHardBtn.addEventListener('click', () => {
                console.log('AI難しいモード選択');
                this.setGameMode('ai', 'hard');
            });
        }
        
        // 操作ボタン
        if (this.dom.hintBtn) {
            this.dom.hintBtn.addEventListener('click', () => {
                console.log('ヒントボタン押下');
                this.toggleHint();
            });
        }
        
        if (this.dom.restartBtn) {
            this.dom.restartBtn.addEventListener('click', () => {
                console.log('再開ボタン押下');
                this.resetGame();
            });
        }
        
        if (this.dom.playAgainBtn) {
            this.dom.playAgainBtn.addEventListener('click', () => {
                console.log('もう一度プレイボタン押下');
                this.resetGame();
                this.dom.gameOverModal.style.display = 'none';
            });
        }
        
        console.log('=== イベントリスナー設定完了 ===');
    }
    
    setGameMode(mode, level = 'normal') {
        console.log(`=== ゲームモード変更: ${mode} ${level} ===`);
        
        this.settings.gameMode = mode;
        if (mode === 'ai') {
            this.settings.aiLevel = level;
        }
        
        // ボタンの表示を更新
        this.updateModeButtons();
        
        // ゲームをリセット
        this.resetGame();
    }
    
    updateModeButtons() {
        // すべてのボタンから active クラスを削除
        [this.dom.humanBtn, this.dom.aiEasyBtn, this.dom.aiNormalBtn, this.dom.aiHardBtn].forEach(btn => {
            if (btn) btn.classList.remove('active');
        });
        
        // 現在のモードに応じてボタンを有効化
        if (this.settings.gameMode === 'human') {
            if (this.dom.humanBtn) this.dom.humanBtn.classList.add('active');
        } else if (this.settings.gameMode === 'ai') {
            if (this.settings.aiLevel === 'easy' && this.dom.aiEasyBtn) {
                this.dom.aiEasyBtn.classList.add('active');
            } else if (this.settings.aiLevel === 'normal' && this.dom.aiNormalBtn) {
                this.dom.aiNormalBtn.classList.add('active');
            } else if (this.settings.aiLevel === 'hard' && this.dom.aiHardBtn) {
                this.dom.aiHardBtn.classList.add('active');
            }
        }
        
        console.log('モードボタン更新完了:', this.settings);
    }
    
    resetGame() {
        console.log('=== ゲームリセット ===');
        
        // 盤面を完全クリア
        this.board = Array(8).fill(0).map(() => Array(8).fill(0));
        
        // 初期配置
        this.board[3][3] = 1;  // 白
        this.board[3][4] = -1; // 黒  
        this.board[4][3] = -1; // 黒
        this.board[4][4] = 1;  // 白
        
        // ゲーム状態リセット
        this.currentPlayer = 'black';
        this.gameActive = true;
        this.isThinking = false;
        
        // 初期配置をコンソールに表示
        this.printBoard();
        
        // UI更新
        this.updateUI();
        this.updateModeButtons();
        
        // 初期の有効手を確認
        const validMoves = this.getValidMoves(-1); // 黒の有効手
        console.log('黒の初期有効手:', validMoves);
        
        this.updateStatus('黒の番です');
        
        // AIモードで黒がAIの場合（通常は白がAI）
        if (this.settings.gameMode === 'ai' && this.settings.aiPlayer === 'black') {
            setTimeout(() => this.triggerAI(), 1000);
        }
    }
    
    updateUI() {
        this.renderBoard();
        this.updateScore();
    }
    
    renderBoard() {
        if (!this.dom.board) return;
        
        // ボードを完全にクリア
        this.dom.board.innerHTML = '';
        
        // 8x8のセルを作成
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                // 石がある場合は追加
                const stone = this.board[row][col];
                if (stone !== 0) {
                    const stoneElement = document.createElement('div');
                    stoneElement.className = `stone ${stone === -1 ? 'black' : 'white'}`;
                    cell.appendChild(stoneElement);
                }
                
                // クリックイベント
                cell.addEventListener('click', () => {
                    this.handleCellClick(row, col);
                });
                
                this.dom.board.appendChild(cell);
            }
        }
    }
    
    handleCellClick(row, col) {
        console.log(`=== セルクリック (${row}, ${col}) ===`);
        console.log('現在のプレイヤー:', this.currentPlayer);
        console.log('ゲーム状態:', this.gameActive);
        console.log('AI思考中:', this.isThinking);
        console.log('セルの値:', this.board[row][col]);
        
        // ゲームが終了している場合は無視
        if (!this.gameActive) {
            console.log('ゲーム終了済み');
            return;
        }
        
        // AI思考中の場合は無視
        if (this.isThinking) {
            console.log('AI思考中のため無視');
            return;
        }
        
        // AIモードで現在AIのターンの場合は無視
        if (this.settings.gameMode === 'ai' && this.currentPlayer === this.settings.aiPlayer) {
            console.log('AIのターンなので無視');
            return;
        }
        
        // セルが既に占有されている場合は無視
        if (this.board[row][col] !== 0) {
            console.log('セルは既に占有されています');
            return;
        }
        
        // 現在のプレイヤーの値を取得
        const playerValue = this.currentPlayer === 'black' ? -1 : 1;
        
        // ひっくり返せる石を取得
        const flippedStones = this.getFlippedStones(row, col, playerValue);
        console.log('ひっくり返せる石:', flippedStones);
        
        // 有効な手でない場合は無視
        if (flippedStones.length === 0) {
            console.log('無効な手です');
            this.updateStatus('無効な手です');
            return;
        }
        
        // 手を実行
        this.makeMove(row, col, playerValue, flippedStones);
    }
    
    makeMove(row, col, playerValue, flippedStones) {
        console.log(`=== 手を実行: (${row}, ${col}) ===`);
        
        // 石を配置
        this.board[row][col] = playerValue;
        
        // 石をひっくり返す
        flippedStones.forEach(([r, c]) => {
            this.board[r][c] = playerValue;
        });
        
        console.log('手を実行後の盤面:');
        this.printBoard();
        
        // UI更新
        this.updateUI();
        
        // 次のターンへ
        this.nextTurn();
    }
    
    getFlippedStones(row, col, playerValue) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        
        const allFlipped = [];
        
        // 8方向をチェック
        for (const [dr, dc] of directions) {
            const line = [];
            let r = row + dr;
            let c = col + dc;
            
            // 相手の石を探す
            while (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === -playerValue) {
                line.push([r, c]);
                r += dr;
                c += dc;
            }
            
            // 自分の石で挟めるかチェック
            if (r >= 0 && r < 8 && c >= 0 && c < 8 && this.board[r][c] === playerValue && line.length > 0) {
                allFlipped.push(...line);
            }
        }
        
        return allFlipped;
    }
    
    getValidMoves(playerValue) {
        const moves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === 0) {
                    const flipped = this.getFlippedStones(row, col, playerValue);
                    if (flipped.length > 0) {
                        moves.push([row, col]);
                    }
                }
            }
        }
        
        return moves;
    }
    
    nextTurn() {
        // プレイヤーを切り替え
        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        const playerValue = this.currentPlayer === 'black' ? -1 : 1;
        
        // 有効な手があるかチェック
        const validMoves = this.getValidMoves(playerValue);
        
        if (validMoves.length === 0) {
            // パスまたはゲーム終了
            const opponentValue = -playerValue;
            const opponentMoves = this.getValidMoves(opponentValue);
            
            if (opponentMoves.length === 0) {
                // ゲーム終了
                this.endGame();
                return;
            } else {
                // パス
                this.updateStatus(`${this.currentPlayer === 'black' ? '黒' : '白'}はパスします`);
                setTimeout(() => {
                    this.nextTurn();
                }, 1500);
                return;
            }
        }
        
        // 通常のターン
        this.updateStatus(`${this.currentPlayer === 'black' ? '黒' : '白'}の番です`);
        console.log(`${this.currentPlayer}の番、有効手:`, validMoves);
        
        // AIのターンかチェック
        if (this.settings.gameMode === 'ai' && this.currentPlayer === this.settings.aiPlayer) {
            setTimeout(() => this.triggerAI(), 500);
        }
    }
    
    // ==============================================
    // AI機能
    // ==============================================
    
    triggerAI() {
        if (!this.gameActive) return;
        
        console.log(`=== AI思考開始 (${this.settings.aiLevel}) ===`);
        this.isThinking = true;
        this.updateStatus('AIが考え中...');
        
        const playerValue = this.settings.aiPlayer === 'black' ? -1 : 1;
        const validMoves = this.getValidMoves(playerValue);
        
        if (validMoves.length === 0) {
            console.log('AIに有効手なし');
            this.isThinking = false;
            this.nextTurn();
            return;
        }
        
        // 難易度に応じた思考時間
        const thinkingTime = {
            easy: 500,
            normal: 1000,
            hard: 1500
        };
        
        setTimeout(() => {
            if (!this.gameActive) return;
            
            let bestMove;
            
            switch (this.settings.aiLevel) {
                case 'easy':
                    bestMove = this.getRandomMove(validMoves);
                    break;
                case 'normal':
                    bestMove = this.getGreedyMove(validMoves, playerValue);
                    break;
                case 'hard':
                    bestMove = this.getAdvancedMove(validMoves, playerValue);
                    break;
                default:
                    bestMove = validMoves[0];
            }
            
            console.log('AI選択:', bestMove);
            
            const flippedStones = this.getFlippedStones(bestMove[0], bestMove[1], playerValue);
            this.isThinking = false;
            this.makeMove(bestMove[0], bestMove[1], playerValue, flippedStones);
            
        }, thinkingTime[this.settings.aiLevel]);
    }
    
    getRandomMove(validMoves) {
        return validMoves[Math.floor(Math.random() * validMoves.length)];
    }
    
    getGreedyMove(validMoves, playerValue) {
        let bestMove = validMoves[0];
        let maxFlips = 0;
        
        for (const move of validMoves) {
            const flips = this.getFlippedStones(move[0], move[1], playerValue).length;
            if (flips > maxFlips) {
                maxFlips = flips;
                bestMove = move;
            }
        }
        
        return bestMove;
    }
    
    getAdvancedMove(validMoves, playerValue) {
        // 角の位置に重みを付ける
        const cornerPositions = [[0,0], [0,7], [7,0], [7,7]];
        const edgePositions = [];
        
        // 端の位置を計算
        for (let i = 0; i < 8; i++) {
            if (i !== 0 && i !== 7) {
                edgePositions.push([0, i], [7, i], [i, 0], [i, 7]);
            }
        }
        
        // 角があれば最優先
        for (const move of validMoves) {
            if (cornerPositions.some(([r, c]) => move[0] === r && move[1] === c)) {
                return move;
            }
        }
        
        // 端があれば次に優先
        for (const move of validMoves) {
            if (edgePositions.some(([r, c]) => move[0] === r && move[1] === c)) {
                return move;
            }
        }
        
        // それ以外は貪欲法
        return this.getGreedyMove(validMoves, playerValue);
    }
    
    endGame() {
        this.gameActive = false;
        
        // スコア計算
        const scores = this.calculateScore();
        
        let message;
        if (scores.black > scores.white) {
            message = '黒の勝利！';
        } else if (scores.white > scores.black) {
            message = '白の勝利！';
        } else {
            message = '引き分け！';
        }
        
        this.updateStatus(`ゲーム終了！ ${message}`);
        console.log('=== ゲーム終了 ===');
        console.log('最終スコア:', scores);
        console.log('結果:', message);
        
        // モーダル表示
        if (this.dom.gameOverModal) {
            if (this.dom.finalBlackScore) this.dom.finalBlackScore.textContent = scores.black;
            if (this.dom.finalWhiteScore) this.dom.finalWhiteScore.textContent = scores.white;
            if (this.dom.winnerText) this.dom.winnerText.textContent = message;
            this.dom.gameOverModal.style.display = 'flex';
        }
    }
    
    calculateScore() {
        let black = 0, white = 0;
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === -1) black++;
                else if (this.board[row][col] === 1) white++;
            }
        }
        
        return { black, white };
    }
    
    updateScore() {
        const scores = this.calculateScore();
        
        if (this.dom.blackScore) {
            this.dom.blackScore.textContent = scores.black;
        }
        if (this.dom.whiteScore) {
            this.dom.whiteScore.textContent = scores.white;
        }
    }
    
    updateStatus(message) {
        if (this.dom.gameStatus) {
            this.dom.gameStatus.textContent = message;
        }
        if (this.dom.currentPlayerText) {
            this.dom.currentPlayerText.textContent = message;
        }
    }
    
    toggleHint() {
        this.settings.hintMode = !this.settings.hintMode;
        
        if (this.settings.hintMode) {
            this.showHints();
        } else {
            this.hideHints();
        }
    }
    
    showHints() {
        // AI思考中は無視
        if (this.isThinking) return;
        
        const playerValue = this.currentPlayer === 'black' ? -1 : 1;
        const validMoves = this.getValidMoves(playerValue);
        
        // すべてのヒントを削除
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('hint');
        });
        
        // 有効手にヒントを追加
        validMoves.forEach(([row, col]) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('hint');
            }
        });
    }
    
    hideHints() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.remove('hint');
        });
    }
    
    // デバッグ用：盤面を表示
    printBoard() {
        console.log('=== 現在の盤面 ===');
        console.log('  0 1 2 3 4 5 6 7');
        for (let row = 0; row < 8; row++) {
            let line = row + ' ';
            for (let col = 0; col < 8; col++) {
                const cell = this.board[row][col];
                if (cell === 0) line += '・';
                else if (cell === -1) line += '●';
                else if (cell === 1) line += '○';
                line += ' ';
            }
            console.log(line);
        }
        console.log('==================');
    }
    
    // テスト用関数
    testGame() {
        console.log('=== ゲームテスト開始 ===');
        this.printBoard();
        
        const blackMoves = this.getValidMoves(-1);
        console.log('黒の有効手:', blackMoves);
        
        blackMoves.forEach(([row, col]) => {
            const flipped = this.getFlippedStones(row, col, -1);
            console.log(`(${row},${col}): ${flipped.length}個ひっくり返し`, flipped);
        });
        
        return blackMoves.length > 0 ? '正常' : '異常';
    }
}

// ゲーム開始
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== DOM読み込み完了 ===');
    window.game = new OthelloGame();
    
    // テスト実行
    setTimeout(() => {
        console.log('テスト結果:', window.game.testGame());
    }, 1000);
}); 