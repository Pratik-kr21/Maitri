export const mockUser = {
    username: "priya_m",
    isMinor: false,
    cycleDay: 21,
    phase: "Luteal",
    nextPeriodDays: 7,
    cyclesLogged: 3,
    predictionConfidence: "Getting more accurate",
    recentSymptoms: ["fatigue", "bloating"],
    lastMood: "overwhelmed"
};

export const mockInsightCard = {
    phase: "Luteal",
    whatsHappening: "You're in your luteal phase — your body is in a quiet, inward mode right now.",
    whyYouFeel: "You logged fatigue yesterday. During the luteal phase, progesterone rises and can make your body feel heavier and slower — this is completely normal.",
    oneSmallThing: "Iron-rich foods like spinach and lentils can help counter the energy dip. Even one handful counts."
};

export const mockPatterns = [
    { id: 1, headline: "Anxious on days 20–24", explanation: "That's your luteal phase — serotonin dips as progesterone rises. This is a hormonal pattern, not a personal failing.", cycles: 3 },
    { id: 2, headline: "Peak energy around day 12–14", explanation: "This is your ovulatory phase, when oestrogen peaks. Many women feel their sharpest and most social here.", cycles: 3 },
    { id: 3, headline: "Cramps on period days 1–2", explanation: "You've logged cramps on the first 2 days of your last 3 periods — this is a consistent pattern worth noting for your doctor.", cycles: 3 }
];

export const mockCommunityPosts = [
    { id: 1, type: "Win", username: "luna_k", content: "Finally understood why I cry every month on day 22. It's the luteal phase! I thought I was broken. I'm not broken.", upvotes: 47, replies: 12, timeAgo: "2h ago" },
    { id: 2, type: "Question", username: "rhea_p", content: "Does anyone else get really bloated in the week before their period? Is there anything that actually helps?", upvotes: 23, replies: 8, timeAgo: "5h ago" },
    { id: 3, type: "Experience", username: "anya_s", content: "Week 2 of my cycle I feel like I can take on the world. Week 4 I want to hide under a blanket. Cycle syncing has been a game changer for scheduling my big work tasks.", upvotes: 61, replies: 19, timeAgo: "1d ago" }
];

export const mockCircles = [
    { id: 1, name: "Teen Talk", description: "A safe space for ages 13–24", ageGated: true, posts: 234, gradient: "linear-gradient(135deg, #FDE0E4, #FFDAB9)" },
    { id: 2, name: "Working & Cycling", description: "For women 25–45 balancing life and cycles", ageGated: false, posts: 891, gradient: "linear-gradient(135deg, #FFF3CD, #FDE0E4)" },
    { id: 3, name: "PCOS Warriors", description: "Open to all — share, learn, support", ageGated: false, posts: 1203, gradient: "linear-gradient(135deg, #FDE0E4, #E87A86)" },
    { id: 4, name: "Irregular Periods", description: "You're not alone — come talk about it", ageGated: false, posts: 445, gradient: "linear-gradient(135deg, #FFDAB9, #FFF3CD)" }
];

export const mockChatHistory = [
    { role: "maitri", content: "Hi Priya! I know you're in your luteal phase today and logged fatigue recently. What's on your mind?" },
    { role: "user", content: "Why do I feel so awful and sad before my period every month?" },
    { role: "maitri", content: "What you're describing sounds really frustrating — and you're not alone in this. In the luteal phase, progesterone rises and serotonin (the mood-stabilising chemical in your brain) can dip. This combination can cause irritability, low mood, and that heavy, hopeless feeling. It's a hormonal pattern, not a character flaw. If it's significantly affecting your daily life, it's worth mentioning to a doctor — they can look at whether it might be PMDD, which is treatable. Would you like help preparing what to say at that appointment?" }
];
