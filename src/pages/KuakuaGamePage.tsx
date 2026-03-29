import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { updateCoinBalance, getDailyRewards, updateDailyRewards } from '../utils/storage';

export const KuakuaGamePage = () => {
  const navigate = useNavigate();
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardMessage, setRewardMessage] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'praiseTargetReached') {
        handleReward(event.data.praiseValue);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleReward = (praiseValue: number) => {
    const dailyRewards = getDailyRewards();
    let totalReward = 0;
    let messages: string[] = [];

    if (praiseValue >= 300 && !dailyRewards.kuakua300) {
      totalReward += 10;
      messages.push('赞美值达到300');
      updateDailyRewards('kuakua300', true);
    }

    if (praiseValue === 525 && !dailyRewards.kuakua525) {
      totalReward += 15;
      messages.push('触发隐藏彩蛋525');
      updateDailyRewards('kuakua525', true);
    }

    if (totalReward > 0) {
      updateCoinBalance(totalReward, `夸夸消消乐: ${messages.join(', ')}`);
      setRewardAmount(totalReward);
      setRewardMessage(messages.join('、'));
      setShowRewardModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowRewardModal(false);
  };

  const gameHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>夸夸消消乐 (Praise Pop)</title>
    <style>
        body, html {
            margin: 0; padding: 0; width: 100%; height: 100%;
            overflow: hidden; font-family: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif;
            background: linear-gradient(135deg, #fffcf9 0%, #ffeaf1 100%);
            touch-action: none;
        }
        #gameCanvas {
            display: block; width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 1;
        }
        .ui-layer {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            z-index: 10; background: rgba(255, 255, 255, 0.3); backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            transition: opacity 0.5s ease;
        }
        .hidden { opacity: 0; pointer-events: none; }
        .glass-card {
            background: rgba(255, 255, 255, 0.9); border-radius: 32px;
            padding: 45px 35px; box-shadow: 0 15px 45px rgba(255, 180, 190, 0.15);
            text-align: center; width: 80%; max-width: 340px;
            border: 2px solid rgba(255, 255, 255, 1);
        }
        .glass-card h1 { color: #ff8a93; margin: 0 0 12px 0; font-size: 26px; letter-spacing: 1px; }
        .glass-card p { color: #9e8e8e; font-size: 15px; margin-bottom: 30px; line-height: 1.5; }
        .option-btn {
            display: block; width: 100%; border: 2px solid transparent;
            padding: 16px; margin-bottom: 16px; border-radius: 20px;
            font-size: 16px; font-weight: bold; cursor: pointer;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); 
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        }
        .option-btn:active { transform: scale(0.96); box-shadow: 0 2px 6px rgba(0,0,0,0.02); }
        .opt-effort { background: #f3faee; color: #558b2f; border-color: #e5f2db; }
        .opt-wisdom { background: #fffbe6; color: #e68a00; border-color: #fff0b3; }
        .opt-kindness { background: #fdf0f4; color: #c2185b; border-color: #fbe0e8; }
        /* 规则按钮 */
        .rule-btn {
            display: block; width: 100%; border: 2px solid #6B55FF;
            padding: 14px; margin-top: 12px; border-radius: 20px;
            font-size: 15px; font-weight: bold; cursor: pointer;
            background: #f0edff; color: #6B55FF;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 12px rgba(107, 85, 255, 0.1);
        }
        .rule-btn:active { transform: scale(0.96); box-shadow: 0 2px 6px rgba(107, 85, 255, 0.1); }
        /* 弹窗样式 */
        .modal {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            z-index: 20; background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        }
        .modal-content {
            background: white; border-radius: 24px;
            padding: 30px 25px;
            width: 85%; max-width: 400px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
            position: relative;
        }
        .close-btn {
            position: absolute; top: 15px; right: 15px;
            background: none; border: none; font-size: 24px; cursor: pointer;
            color: #999; width: 30px; height: 30px;
            display: flex; align-items: center; justify-content: center;
        }
        .modal-content h2 {
            color: #6B55FF; margin: 0 0 20px 0; font-size: 20px;
            text-align: center;
        }
        .rule-content {
            max-height: 300px; overflow-y: auto;
            margin-bottom: 20px;
        }
        .rule-content h3 {
            color: #333; margin: 15px 0 8px 0; font-size: 16px;
        }
        .rule-content ul {
            margin: 0 0 15px 0; padding-left: 20px;
        }
        .rule-content li {
            color: #666; margin-bottom: 6px; font-size: 14px;
            line-height: 1.4;
        }
        .confirm-btn {
            width: 100%; padding: 12px; border: none;
            border-radius: 16px; background: #6B55FF; color: white;
            font-size: 16px; font-weight: bold; cursor: pointer;
            transition: background 0.2s;
        }
        .confirm-btn:active { background: #5a44e0; }
        #game-header {
            position: absolute; top: 3%; left: 0; width: 100%; text-align: center;
            z-index: 5; pointer-events: none;
        }
        #score-display { 
            font-size: 22px; font-weight: bold; color: #d48888;
            text-shadow: 0 2px 6px rgba(255,255,255,0.9); 
        }
        #back-btn {
            position: absolute; top: 3%; left: 5%; z-index: 15;
            background: rgba(255, 250, 250, 0.9); border: none;
            padding: 12px 22px; border-radius: 25px;
            font-size: 14px; color: #b89f9f; font-weight: bold; cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 180, 190, 0.15);
            transition: transform 0.2s, background 0.2s;
        }
        #back-btn:active { transform: scale(0.95); background: #fff; }
        #hint-text {
            position: absolute; bottom: 8%; width: 100%; text-align: center;
            font-size: 15px; color: #b89f9f; z-index: 5; pointer-events: none;
            animation: breathe 2.5s infinite ease-in-out;
            text-shadow: 0 1px 3px rgba(255,255,255,0.8);
        }
        @keyframes breathe { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
    </style>
</head>
<body>
    <button id="back-btn" class="hidden" onclick="goBack()">← 返回</button>
    <div id="game-header" class="hidden">
        <div id="score-display">获得赞美: 0</div>
    </div>
    <div id="hint-text" class="hidden">点击两个相邻方块即可交换</div>
    <canvas id="gameCanvas"></canvas>
    <div id="start-screen" class="ui-layer">
        <div class="glass-card">
            <h1>✨ 夸夸消消乐</h1>
            <p>游戏开始前<br>你今天最希望在哪个方面被肯定？</p>
            <button class="option-btn opt-effort" onclick="startGame('effort')">🌱 努力与坚持</button>
            <button class="option-btn opt-wisdom" onclick="startGame('wisdom')">💡 智慧与洞察</button>
            <button class="option-btn opt-kindness" onclick="startGame('kindness')">💖 善良与温柔</button>
            <button class="rule-btn" onclick="showRules()">📖 游戏规则</button>
        </div>
        
        <!-- 游戏规则弹窗 -->
        <div id="rule-modal" class="modal hidden">
            <div class="modal-content">
                <button class="close-btn" onclick="hideRules()">×</button>
                <h2>🎮 游戏规则</h2>
                <div class="rule-content">
                    <h3>游戏玩法：</h3>
                    <ul>
                        <li>点击两个相邻的方块进行交换</li>
                        <li>当三个或以上相同方块连成一线时消除</li>
                        <li>消除方块获得赞美值</li>
                        <li>赞美值达到300时获得10枚心理货币</li>
                        <li>赞美值刚好达到525时触发隐藏彩蛋，额外获得15枚心理货币</li>
                    </ul>
                    <h3>奖励规则：</h3>
                    <ul>
                        <li>赞美值达到300 → 10枚心理货币（每日限领1次）</li>
                        <li>赞美值刚好525 → 15枚心理货币（每日限领1次）</li>
                        <li>两个奖励可同时触发，共获得25枚心理货币</li>
                    </ul>
                </div>
                <button class="confirm-btn" onclick="hideRules()">我知道了</button>
            </div>
        </div>
    </div>
<script>
    const praiseDict = {
        effort: ["每一滴汗水都在发光！", "你的坚持让人感动。", "看，努力正在生根发芽。", "即使缓慢，也是向前！", "你比你想象的更强大。", "为你今天没有放弃而鼓掌！"],
        wisdom: ["逻辑满分！", "这洞察力太惊人了！", "绝妙的选择！", "聪明如你，一眼看透。", "大脑疯狂运转的性感！", "心思缜密，步步为营。"],
        kindness: ["你的温柔治愈了世界。", "世界因为你而柔软。", "你发出的光，很温暖。", "连方块都感受到了你的善意。", "谢谢你一直这么好。", "爱意在此刻消除烦恼。"],
        combo: ["绝杀！完美节奏！", "你是节奏大师！", "这种掌控感太棒了！", "救命！你的优秀让屏幕发烫！", "不可思议的连击！", "势如破竹的能量！"]
    };
    const stressWords = {
        effort: ["拖延症", "放弃念头", "太累了", "不够好", "想偷懒", "没力气", "坚持不住", "怕失败"],
        wisdom: ["想不通", "脑子乱", "没思路", "智商税", "钻牛角", "犯糊涂", "想复杂", "记错了"],
        kindness: ["生气了", "冷漠脸", "不耐烦", "太委屈", "想计较", "不开心", "想吵架", "心累了"]
    };
    const TILE_TYPES = [
        { id: 1, color: '#ffb8b8', emoji: '💖', name: '爱心' },
        { id: 2, color: '#f8efba', emoji: '💡', name: '灯泡' },
        { id: 3, color: '#d1d8e0', emoji: '🛡️', name: '护盾' },
        { id: 4, color: '#b8e994', emoji: '🌱', name: '嫩芽' },
        { id: 5, color: '#d980fa', emoji: '✨', name: '星光' }
    ];
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    function playEncourageSound(isCombo) {
        if (audioContext.state === 'suspended') audioContext.resume();
        const now = audioContext.currentTime;
        if (isCombo) {
            const osc1 = audioContext.createOscillator();
            const osc2 = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            osc1.connect(gainNode); osc2.connect(gainNode); gainNode.connect(audioContext.destination);
            osc1.type = 'square'; osc2.type = 'square';
            osc1.frequency.setValueAtTime(880, now); osc1.frequency.setValueAtTime(1760, now + 0.08);
            osc2.frequency.setValueAtTime(1108.73, now); osc2.frequency.setValueAtTime(2217.46, now + 0.08);
            gainNode.gain.setValueAtTime(0.15, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc1.start(now); osc1.stop(now + 0.25); osc2.start(now); osc2.stop(now + 0.25);
        } else {
            const osc = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            osc.connect(gainNode); gainNode.connect(audioContext.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1174.66, now); osc.frequency.exponentialRampToValueAtTime(2349.32, now + 0.12);
            gainNode.gain.setValueAtTime(0.2, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now); osc.stop(now + 0.2);
        }
    }
    function playSwapSound() {
        if (audioContext.state === 'suspended') audioContext.resume();
        const osc = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        osc.connect(gainNode); gainNode.connect(audioContext.destination);
        const now = audioContext.currentTime;
        osc.type = 'sine'; osc.frequency.setValueAtTime(880, now);
        gainNode.gain.setValueAtTime(0.1, now); gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
    }
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    const GRID_SIZE = 6;
    let tileSize = 0, offsetX = 0, offsetY = 0;
    let gameState = 'START';
    let chosenTrait = 'effort';
    let score = 0;
    let rewardGiven = { 300: false, 525: false };
    let grid = [], stressBlocks = [], particles = [], floatingTexts = [], bgParticles = [];
    let selectedTile = null, isAnimating = false;
    function resize() {
        width = window.innerWidth; height = window.innerHeight;
        canvas.width = width * window.devicePixelRatio; canvas.height = height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        const maxWidth = width * 0.65, maxHeight = height * 0.5;
        const maxTileWidth = Math.floor(maxWidth / GRID_SIZE), maxTileHeight = Math.floor(maxHeight / GRID_SIZE);
        tileSize = Math.min(maxTileWidth, maxTileHeight);
        offsetX = (width - tileSize * GRID_SIZE) / 2;
        offsetY = (height - tileSize * GRID_SIZE) / 2 + 30;
    }
    window.addEventListener('resize', resize);
    resize();
    for(let i=0; i<15; i++) {
        bgParticles.push({
            x: Math.random() * width, y: Math.random() * height,
            r: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
            color: 'rgba(255, 255, 255, ' + (Math.random() * 0.5 + 0.1) + ')'
        });
    }
    function startGame(trait) {
        chosenTrait = trait;
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('back-btn').classList.remove('hidden');
        gameState = 'STRESS_SMASH';
        initStressBlocks();
    }
    function goBack() {
        gameState = 'START';
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('game-header').classList.add('hidden');
        document.getElementById('hint-text').classList.add('hidden');
        document.getElementById('back-btn').classList.add('hidden');
        score = 0;
        rewardGiven = { 300: false, 525: false };
        document.getElementById('score-display').innerText = '获得赞美: ' + score;
        stressBlocks = []; grid = []; particles = []; floatingTexts = [];
        selectedTile = null; isAnimating = false;
    }
    
    // 显示游戏规则
    function showRules() {
        document.getElementById('rule-modal').classList.remove('hidden');
    }
    
    // 隐藏游戏规则
    function hideRules() {
        document.getElementById('rule-modal').classList.add('hidden');
    }
    function initStressBlocks() {
        stressBlocks = [];
        const words = stressWords[chosenTrait];
        for(let i=0; i<5; i++) {
            stressBlocks.push({
                x: width/2 + (Math.random()-0.5)*100,
                y: height/2 - 120 + i*60 + (Math.random()-0.5)*20,
                w: 130, h: 45,
                text: words[Math.floor(Math.random()*words.length)],
                vx: (Math.random()-0.5)*2, vy: (Math.random()-0.5)*2,
                broken: false
            });
        }
    }
    function initGrid() {
        grid = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            grid[r] = [];
            for (let c = 0; c < GRID_SIZE; c++) {
                grid[r][c] = createRandomTile(r, c);
            }
        }
        while(checkMatches().length > 0) {
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    grid[r][c] = createRandomTile(r, c);
                }
            }
        }
    }
    function createRandomTile(r, c) {
        const type = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)];
        return { r: r, c: c, type: type, x: offsetX + c * tileSize, y: offsetY + r * tileSize, targetX: offsetX + c * tileSize, targetY: offsetY + r * tileSize, scale: 0 };
    }
    function handleInput(e) {
        if(e.cancelable) e.preventDefault();
        let ex, ey;
        if(e.touches) { ex = e.touches[0].clientX; ey = e.touches[0].clientY; }
        else { ex = e.clientX; ey = e.clientY; }
        if(gameState === 'STRESS_SMASH') {
            let allBroken = true;
            for(let b of stressBlocks) {
                if(!b.broken && ex > b.x - b.w/2 && ex < b.x + b.w/2 && ey > b.y - b.h/2 && ey < b.y + b.h/2) {
                    b.broken = true;
                    createParticles(b.x, b.y, '#e7dfdd', 10);
                }
                if(!b.broken) allBroken = false;
            }
            if(allBroken && stressBlocks.length > 0) {
                stressBlocks = [];
                setTimeout(function() {
                    gameState = 'PLAYING';
                    document.getElementById('game-header').classList.remove('hidden');
                    document.getElementById('hint-text').classList.remove('hidden');
                    initGrid();
                }, 500);
            }
        } else if (gameState === 'PLAYING' && !isAnimating) {
            let c = Math.floor((ex - offsetX) / tileSize);
            let r = Math.floor((ey - offsetY) / tileSize);
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && grid[r][c]) {
                if (!selectedTile) {
                    selectedTile = grid[r][c];
                } else {
                    let tile1 = selectedTile;
                    let tile2 = grid[r][c];
                    let isAdjacent = Math.abs(tile1.r - tile2.r) + Math.abs(tile1.c - tile2.c) === 1;
                    if (isAdjacent) swapTiles(tile1, tile2);
                    selectedTile = null;
                }
            } else {
                selectedTile = null;
            }
        }
    }
    canvas.addEventListener('mousedown', handleInput);
    canvas.addEventListener('touchstart', handleInput, {passive: false});
    canvas.addEventListener('dblclick', function(e) { e.preventDefault(); });
    function swapTiles(t1, t2) {
        isAnimating = true;
        playSwapSound();
        let tempR = t1.r, tempC = t1.c;
        t1.r = t2.r; t1.c = t2.c;
        t2.r = tempR; t2.c = tempC;
        grid[t1.r][t1.c] = t1;
        grid[t2.r][t2.c] = t2;
        let tempX = t1.targetX, tempY = t1.targetY;
        t1.targetX = t2.targetX; t1.targetY = t2.targetY;
        t2.targetX = tempX; t2.targetY = tempY;
        let startTime = Date.now();
        let duration = 150;
        function animate() {
            let elapsed = Date.now() - startTime;
            let progress = Math.min(elapsed / duration, 1);
            let ease = 1 - Math.pow(1 - progress, 3);
            t1.x = t1.x + (t1.targetX - t1.x) * ease;
            t1.y = t1.y + (t1.targetY - t1.y) * ease;
            t2.x = t2.x + (t2.targetX - t2.x) * ease;
            t2.y = t2.y + (t2.targetY - t2.y) * ease;
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                t1.x = t1.targetX; t1.y = t1.targetY;
                t2.x = t2.targetX; t2.y = t2.targetY;
                let matches = checkMatches();
                if (matches.length > 0) {
                    processMatches(matches);
                } else {
                    let tempR = t1.r, tempC = t1.c;
                    t1.r = t2.r; t1.c = t2.c;
                    t2.r = tempR; t2.c = tempC;
                    grid[t1.r][t1.c] = t1;
                    grid[t2.r][t2.c] = t2;
                    let tempX = t1.targetX, tempY = t1.targetY;
                    t1.targetX = t2.targetX; t1.targetY = t2.targetY;
                    t2.targetX = tempX; t2.targetY = tempY;
                    let returnStartTime = Date.now();
                    function returnAnimate() {
                        let returnElapsed = Date.now() - returnStartTime;
                        let returnProgress = Math.min(returnElapsed / (duration/2), 1);
                        let returnEase = 1 - Math.pow(1 - returnProgress, 3);
                        t1.x = t1.x + (t1.targetX - t1.x) * returnEase;
                        t1.y = t1.y + (t1.targetY - t1.y) * returnEase;
                        t2.x = t2.x + (t2.targetX - t2.x) * returnEase;
                        t2.y = t2.y + (t2.targetY - t2.y) * returnEase;
                        if (returnProgress < 1) {
                            requestAnimationFrame(returnAnimate);
                        } else {
                            t1.x = t1.targetX; t1.y = t1.targetY;
                            t2.x = t2.targetX; t2.y = t2.targetY;
                            isAnimating = false;
                        }
                    }
                    returnAnimate();
                }
            }
        }
        animate();
    }
    function checkMatches() {
        let matches = [];
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE - 2; c++) {
                if (grid[r][c] && grid[r][c+1] && grid[r][c+2]) {
                    if (grid[r][c].type.id === grid[r][c+1].type.id && grid[r][c].type.id === grid[r][c+2].type.id) {
                        matches.push(grid[r][c], grid[r][c+1], grid[r][c+2]);
                    }
                }
            }
        }
        for (let c = 0; c < GRID_SIZE; c++) {
            for (let r = 0; r < GRID_SIZE - 2; r++) {
                if (grid[r][c] && grid[r+1][c] && grid[r+2][c]) {
                    if (grid[r][c].type.id === grid[r+1][c].type.id && grid[r][c].type.id === grid[r+2][c].type.id) {
                        matches.push(grid[r][c], grid[r+1][c], grid[r+2][c]);
                    }
                }
            }
        }
        return [...new Set(matches)];
    }
    function processMatches(matches) {
        let isCombo = matches.length > 3;
        playEncourageSound(isCombo);
        score += matches.length;
        document.getElementById('score-display').innerText = '获得赞美: ' + score;
        let centerX = 0, centerY = 0;
        matches.forEach(function(t) {
            centerX += t.x; centerY += t.y;
            createParticles(t.x + tileSize/2, t.y + tileSize/2, t.type.color, 4);
            grid[t.r][t.c] = null;
        });
        centerX /= matches.length;
        centerY /= matches.length;
        spawnPraiseText(centerX + tileSize/2, centerY, isCombo);
        if (score >= 300 && !rewardGiven[300]) {
            rewardGiven[300] = true;
            parent.postMessage({ type: 'praiseTargetReached', praiseValue: 300 }, '*');
        }
        if (score === 525 && !rewardGiven[525]) {
            rewardGiven[525] = true;
            parent.postMessage({ type: 'praiseTargetReached', praiseValue: 525 }, '*');
        }
        setTimeout(function() { dropTiles(); }, 100);
    }
    function dropTiles() {
        for (let c = 0; c < GRID_SIZE; c++) {
            let emptySpaces = 0;
            for (let r = GRID_SIZE - 1; r >= 0; r--) {
                if (grid[r][c] === null) {
                    emptySpaces++;
                } else if (emptySpaces > 0) {
                    let tile = grid[r][c];
                    grid[r][c] = null;
                    grid[r + emptySpaces][c] = tile;
                    tile.r = r + emptySpaces;
                    tile.targetY = offsetY + tile.r * tileSize;
                }
            }
            for (let i = 0; i < emptySpaces; i++) {
                let newTile = createRandomTile(i, c);
                newTile.y = offsetY - (emptySpaces - i) * tileSize;
                newTile.targetY = offsetY + i * tileSize;
                grid[i][c] = newTile;
            }
        }
        setTimeout(function() {
            let matches = checkMatches();
            if(matches.length > 0) {
                processMatches(matches);
            } else {
                isAnimating = false;
            }
        }, 300);
    }
    function spawnPraiseText(x, y, isCombo) {
        let textArr = isCombo ? praiseDict.combo : praiseDict[chosenTrait];
        let text = textArr[Math.floor(Math.random() * textArr.length)];
        floatingTexts.push({ x: x, y: y, text: text, life: 1.0, dy: -1.5, color: isCombo ? '#ff7979' : '#8d6e63', scale: isCombo ? 1.5 : 1.0 });
    }
    function createParticles(x, y, color, count) {
        for(let i=0; i<count; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = Math.random() * 4 + 1;
            particles.push({ x: x, y: y, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 1, color: color, size: Math.random()*4 + 2 });
        }
    }
    function draw() {
        ctx.clearRect(0, 0, width, height);
        bgParticles.forEach(function(p) {
            p.x += p.vx; p.y += p.vy;
            if(p.x<0 || p.x>width) p.vx*=-1;
            if(p.y<0 || p.y>height) p.vy*=-1;
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        });
        if (gameState === 'STRESS_SMASH') {
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            stressBlocks.forEach(function(b) {
                if(b.broken) return;
                b.x += b.vx; b.y += b.vy;
                if(b.x - b.w/2 < 0 || b.x + b.w/2 > width) b.vx *= -1;
                if(b.y - b.h/2 < 0 || b.y + b.h/2 > height) b.vy *= -1;
                ctx.fillStyle = '#bcaaa4';
                ctx.beginPath(); ctx.roundRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h, 16); ctx.fill();
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 20px PingFang SC';
                ctx.fillText(b.text, b.x, b.y);
            });
            ctx.fillStyle = '#b89f9f';
            ctx.font = '16px PingFang SC';
            ctx.fillText("点击粉碎这些压力情绪，让美好涌入", width/2, height - 100);
        } else if (gameState === 'PLAYING') {
            ctx.fillStyle = 'rgba(255, 245, 245, 0.45)';
            ctx.beginPath();
            ctx.roundRect(offsetX-8, offsetY-8, GRID_SIZE*tileSize+16, GRID_SIZE*tileSize+16, 20);
            ctx.fill();
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    let tile = grid[r][c];
                    if (tile) {
                        tile.x += (tile.targetX - tile.x) * 0.2;
                        tile.y += (tile.targetY - tile.y) * 0.2;
                        if(tile.scale < 1) tile.scale += 0.1;
                        let padding = 4;
                        let sSize = (tileSize - padding * 2) * tile.scale;
                        let cx = tile.x + tileSize/2;
                        let cy = tile.y + tileSize/2;
                        ctx.save();
                        ctx.translate(cx, cy);
                        if(selectedTile === tile) {
                            ctx.scale(1.1, 1.1);
                            ctx.shadowColor = tile.type.color;
                            ctx.shadowBlur = 20;
                        }
                        ctx.fillStyle = tile.type.color;
                        ctx.beginPath();
                        ctx.roundRect(-sSize/2, -sSize/2, sSize, sSize, 14);
                        ctx.fill();
                        ctx.font = (sSize * 0.5) + 'px Arial';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillText(tile.type.emoji, 0, 2);
                        ctx.restore();
                    }
                }
            }
        }
        for(let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.x += p.vx; p.y += p.vy;
            p.life -= 0.04;
            if(p.life <= 0) { particles.splice(i, 1); continue; }
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI*2); ctx.fill();
            ctx.globalAlpha = 1;
        }
        for(let i = floatingTexts.length - 1; i >= 0; i--) {
            let ft = floatingTexts[i];
            ft.y += ft.dy;
            ft.life -= 0.02;
            if(ft.life <= 0) { floatingTexts.splice(i, 1); continue; }
            ctx.globalAlpha = Math.max(0, ft.life);
            ctx.textAlign = 'center';
            ctx.font = 'bold ' + (18 * ft.scale) + 'px PingFang SC';
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = 'rgba(255,255,255,0.9)';
            ctx.strokeText(ft.text, ft.x, ft.y);
            ctx.fillStyle = ft.color;
            ctx.fillText(ft.text, ft.x, ft.y);
            ctx.globalAlpha = 1;
        }
        requestAnimationFrame(draw);
    }
    draw();
    if (!CanvasRenderingContext2D.prototype.roundRect) {
        CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
            if (w < 2 * r) r = w / 2;
            if (h < 2 * r) r = h / 2;
            this.moveTo(x+r, y);
            this.arcTo(x+w, y, x+w, y+h, r);
            this.arcTo(x+w, y+h, x, y+h, r);
            this.arcTo(x, y+h, x, y, r);
            this.arcTo(x, y, x+w, y, r);
            return this;
        }
    }
</script>
</body>
</html>`;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between p-4 bg-[#FFA203] text-white">
        <button 
          onClick={() => navigate('/mental-save')}
          className="flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>返回</span>
        </button>
        <h1 className="text-xl font-bold">夸夸消消乐</h1>
        <div className="w-8"></div>
      </div>
      <div className="w-full" style={{ height: 'calc(100vh - 64px)' }}>
        <iframe
          ref={iframeRef}
          srcDoc={gameHtml}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin"
          title="夸夸消消乐游戏"
        />
      </div>
      {showRewardModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md">
            <h3 className="text-xl font-bold text-center mb-4">🎉 恭喜获得奖励！</h3>
            <p className="text-center text-gray-700 mb-2">{rewardMessage}</p>
            <p className="text-center text-2xl font-bold text-[#6B55FF] mb-6">+{rewardAmount} 心理货币</p>
            <button onClick={handleCloseModal} className="w-full py-3 bg-[#FFA203] text-white rounded-full font-medium">太棒了！</button>
          </div>
        </div>
      )}
    </div>
  );
};
