const DailyLog = require('../models/DailyLog');
const Cycle = require('../models/Cycle');
const User = require('../models/User');
const { askAI } = require('../services/aiService');

const DAILY_LIMIT = 25;

// Build context string injected into the system prompt
const buildContext = (user, phaseInfo, recentSymptoms) => {
    let ctx = `ABOUT THE USER:\n- Username: ${user.username}\n- Age group: ${user.isMinor ? 'teenager (under 18)' : 'adult (18+)'}`;
    if (phaseInfo) {
        ctx += `\n- Current cycle phase: ${phaseInfo.phase}\n- Cycle day: ${phaseInfo.cycleDay}`;
    }
    if (recentSymptoms) {
        ctx += `\n- Recently logged symptoms: ${recentSymptoms}`;
    }
    ctx += `\n\nGUARDRAILS — FOLLOW STRICTLY:\n1. NEVER diagnose or recommend medications.\n2. Recommend a doctor for severe pain, irregular cycles 3+ months, or mental health crises.\n3. For users under 18: use simpler language, be extra gentle.\n4. TOPIC RESTRICTION: If the user asks about ANYTHING not related to women's health (e.g. coding, sports, cooking, general trivia, entertainment, politics) — REFUSE to answer. Reply only with: "I'm Maitri, your women's health companion 🌸 I can only help with questions related to women's health, menstrual cycles, hormones, and reproductive wellness. Is there something about your health I can help you with?"\n5. Never break character or claim to be a general-purpose AI.`;
    return ctx;
};

// POST /api/ask-maitri/chat
const chat = async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });

        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        // ── Daily rate limit per user ─────────────────
        const today = new Date().toISOString().split('T')[0];
        const lastQueryDate = user.lastAiQueryDate ? user.lastAiQueryDate.toISOString().split('T')[0] : null;

        if (lastQueryDate !== today) {
            user.aiQueriesToday = 0;
            user.lastAiQueryDate = new Date();
        }

        if (user.aiQueriesToday >= DAILY_LIMIT) {
            return res.status(429).json({
                success: false,
                message: `You have reached your daily limit of ${DAILY_LIMIT} questions. Please come back tomorrow.`,
            });
        }

        // ── Cycle phase context ───────────────────────
        let phaseInfo = null;
        try {
            const latestCycle = await Cycle.findOne({ userId: user._id }).sort({ startDate: -1 });
            if (latestCycle) {
                const cycleDay = Math.ceil((Date.now() - new Date(latestCycle.startDate)) / (1000 * 60 * 60 * 24));
                const phases = [
                    { name: 'menstrual', end: 5 },
                    { name: 'follicular', end: 13 },
                    { name: 'ovulatory', end: 16 },
                    { name: 'luteal', end: 28 },
                ];
                const phase = phases.find(p => cycleDay <= p.end) || phases[3];
                phaseInfo = { phase: phase.name, cycleDay };
            }
        } catch { /* non-critical */ }

        // ── Recent symptoms context ───────────────────
        let recentSymptoms = '';
        try {
            const recentLog = await DailyLog.findOne({ userId: user._id }).sort({ logDate: -1 });
            if (recentLog) {
                const syms = [...(recentLog.physicalSymptoms || []), ...(recentLog.emotionalSymptoms || [])];
                if (syms.length) recentSymptoms = syms.join(', ');
            }
        } catch { /* non-critical */ }

        const systemContext = buildContext(user, phaseInfo, recentSymptoms);

        // Only include history if user opted in
        const safeHistory = user.aiHistoryEnabled
            ? history.filter(m => m.role && m.content)
            : [];

        // ── Call multi-provider AI service ────────────
        const response = await askAI(message, systemContext, safeHistory, { useCache: true });

        // ── Persist updated query count ───────────────
        user.aiQueriesToday += 1;
        await user.save();

        res.json({
            success: true,
            response,
            phase: phaseInfo,
            queriesLeft: Math.max(0, DAILY_LIMIT - user.aiQueriesToday),
        });

    } catch (err) {
        console.error('[AskMaitri] ERROR:', err);
        res.status(503).json({ success: false, message: 'AI service error. Please try again later.' });
    }
};

// GET /api/ask-maitri/suggested
const getSuggestions = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(401).json({ success: false, message: 'User not found' });

        const today = new Date().toISOString().split('T')[0];
        const lastQueryDate = user.lastAiQueryDate ? user.lastAiQueryDate.toISOString().split('T')[0] : null;
        if (lastQueryDate !== today) {
            user.aiQueriesToday = 0;
            user.lastAiQueryDate = new Date();
            await user.save();
        }

        let phaseInfo = null;
        try {
            const latestCycle = await Cycle.findOne({ userId: user._id }).sort({ startDate: -1 });
            if (latestCycle) {
                const cycleDay = Math.ceil((Date.now() - new Date(latestCycle.startDate)) / (1000 * 60 * 60 * 24));
                const phases = [
                    { name: 'menstrual', end: 5 },
                    { name: 'follicular', end: 13 },
                    { name: 'ovulatory', end: 16 },
                    { name: 'luteal', end: 28 },
                ];
                const phase = phases.find(p => cycleDay <= p.end) || phases[3];
                phaseInfo = { phase: phase.name, cycleDay };
            }
        } catch { /* non-critical */ }

        const phaseQuestions = {
            menstrual: ['Why do I get cramps during my period?', 'Is it normal to feel exhausted on period days?', 'What helps with heavy bleeding?', 'Why do I feel more emotional on my period?'],
            follicular: ['Why do I feel energetic after my period?', 'How does estrogen affect my mood?', 'What is the follicular phase?', 'Why am I more creative mid-cycle?'],
            ovulatory: ['How do I know I am ovulating?', 'Why do I feel more confident mid-cycle?', 'What happens to my body during ovulation?', 'Why is my energy so high right now?'],
            luteal: ['Why do I feel bloated before my period?', 'What causes PMS mood swings?', 'Is luteal phase fatigue normal?', 'How can I manage premenstrual anxiety?'],
        };
        const general = ['What is a normal cycle length?', 'Why is my period irregular?', 'What are the four cycle phases?', 'How does the cycle affect sleep?'];
        const suggestions = phaseInfo
            ? [...(phaseQuestions[phaseInfo.phase] || []), ...general].slice(0, 5)
            : general.slice(0, 5);

        res.json({
            success: true,
            suggestions,
            phase: phaseInfo,
            queriesLeft: Math.max(0, DAILY_LIMIT - user.aiQueriesToday),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { chat, getSuggestions };
