const DailyLog = require('../models/DailyLog');
const Cycle = require('../models/Cycle');
const { askAI } = require('../services/aiService');


// @route GET /api/insights/daily
const getDailyInsight = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find today's log
        const todayLog = await DailyLog.findOne({
            userId: req.user._id,
            logDate: today
        });

        if (!todayLog) {
            // User hasn't logged today
            return res.json({
                success: true,
                insight: {
                    hasLog: false,
                },
            });
        }

        // If insight already generated today, return it (unless it was the fallback error)
        if (todayLog.aiInsight && !todayLog.aiInsight.whatsHappening.includes('small hiccup') && !todayLog.aiInsight.whatsHappening.includes('API Error')) {
            return res.json({
                success: true,
                insight: {
                    hasLog: true,
                    ...todayLog.aiInsight
                }
            });
        }

        // Fetch up to 7 previous logs for historical pattern analysis (excluding today), if allowed
        let historyContext = 'History analysis disabled by user.';
        if (req.user.patternDetectionEnabled) {
            const historyLogs = await DailyLog.find({
                userId: req.user._id,
                logDate: { $lt: today }
            }).sort({ logDate: -1 }).limit(7);

            historyContext = 'No previous logs available yet.';
            if (historyLogs.length > 0) {
                historyContext = 'Recent check-in history:\n' + historyLogs.map(l =>
                    `- ${l.logDate.toISOString().split('T')[0]}: Energy: ${l.energyLevel}, Symptoms: ${[...l.physicalSymptoms, ...l.emotionalSymptoms].join(', ') || 'None'}, Mood: ${l.moodWord || 'None'}`
                ).join('\n');
            }
        }

        // Fetch cycle data for AI context
        const latestCycle = await Cycle.findOne({ userId: req.user._id }).sort({ startDate: -1 });
        let phaseContext = 'User has not started tracking their cycle yet. Focus primarily on their logged symptoms.';
        if (latestCycle) {
            const daysSinceStart = Math.floor((new Date() - new Date(latestCycle.startDate)) / (1000 * 60 * 60 * 24));
            const cycleDay = daysSinceStart + 1;
            phaseContext = `User is on Day ${cycleDay} of their cycle.`;
            if (cycleDay <= 5) phaseContext += ' They are likely in the menstrual phase.';
            else if (cycleDay <= 13) phaseContext += ' They are likely in the follicular phase.';
            else if (cycleDay <= 17) phaseContext += ' They are likely in the ovulatory phase.';
            else phaseContext += ' They are likely in the luteal phase.';
        }

        // Prepare symptoms string
        const syms = [...todayLog.physicalSymptoms, ...todayLog.emotionalSymptoms].join(', ');
        const energy = todayLog.energyLevel;
        const mood = todayLog.moodWord;

        const systemPrompt = `You are Maitri, an empathetic women's health AI. 
Read the user's daily check-in and their recent history (to spot patterns), then output a JSON response with exactly two fields:
{
  "whatsHappening": "A brief 2-3 sentence explanation connecting their cycle phase or just general health to their lived experience today (symptoms: ${syms}, energy: ${energy}, mood: ${mood}). Note if this is a recurring pattern or just for today. Be extremely warm. Don't diagnose anything.",
  "oneSmallThing": "A single, actionable, gentle tip for today based on what they logged today or their recent pattern."
}
Only output the JSON object. Do not include markdown codeblocks (\`\`\`json) or any conversational text around the object. Just the raw JSON.`;

        const insightPrompt = `Read this user's daily check-in and their recent history (to spot patterns), then output ONLY a JSON object with exactly two fields:
{"whatsHappening": "2-3 sentence explanation connecting cycle phase/general health to today's experience (symptoms: ${syms}, energy: ${energy}, mood: ${mood}). Note if this is a recurring pattern or just today. Be extremely warm. Don't diagnose.", "oneSmallThing": "Single actionable gentle tip for today based on what they logged."}
Only output the raw JSON object. No markdown. No codeblocks. No extra text.`;

        const contextForService = `${phaseContext}\n\nHistory:\n${historyContext}\n\nLogged today:\n- Symptoms: ${syms || 'None'}\n- Energy: ${energy}\n- Mood word: ${mood || 'None'}`;

        let aiResponse = null;
        try {
            const rawText = await askAI(insightPrompt, contextForService, [], { useCache: false });
            // Strip markdown code fences if present
            const cleanJson = rawText.replace(/^```json/i, '').replace(/```$/i, '').trim();
            try {
                aiResponse = JSON.parse(cleanJson);
            } catch {
                const start = cleanJson.indexOf('{');
                const end = cleanJson.lastIndexOf('}');
                if (start !== -1 && end !== -1) {
                    aiResponse = JSON.parse(cleanJson.substring(start, end + 1));
                }
            }
        } catch (aiErr) {
            console.warn('[Insight] AI call failed:', aiErr.message);
        }

        if (!aiResponse) {
            aiResponse = {
                whatsHappening: `Your body is sending you signals today. Keep listening to it — you know yourself best. 🌸`,
                oneSmallThing: 'Try to rest, hydrate, and be kind to yourself today.',
            };
        }

        // Save back to DB
        todayLog.aiInsight = aiResponse;
        await todayLog.save();

        res.json({
            success: true,
            insight: {
                hasLog: true,
                ...aiResponse
            }
        });
    } catch (err) {
        console.error('INSIGHT ERROR:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = { getDailyInsight };
